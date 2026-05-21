const axios = require(
  "axios"
);

const bscConfig =
  require(
    "../chains/bsc/bscConfig"
  );

const ethereumConfig =
  require(
    "../chains/ethereum/ethereumConfig"
  );

const tonConfig =
  require(
    "../chains/ton/tonConfig"
  );

const {
  detectWallet,
} = require(
  "./walletService"
);

const {
  classifyTransaction,
} = require(
  "./transactionClassifierService"
);

const {
  analyzeProtocolFlows,
} = require(
  "./protocolFlowService"
);

const {
  generateRiskScore,
} = require(
  "./riskScoringService"
);

const {
  getBscWallet,
} = require(
  "../chains/bsc/bscService"
);

// =========================
// EVM TX CHECK
// =========================

const checkEvmTransaction =
  async (
    rpcUrl,
    txHash,
    chain
  ) => {
    try {
      const response =
        await axios.post(
          rpcUrl,
          {
            jsonrpc:
              "2.0",

            method:
              "eth_getTransactionReceipt",

            params: [
              txHash,
            ],

            id: 1,
          }
        );

      const receipt =
  response.data
    ?.result;

if (!receipt) {
  return null;
}

const txResponse =
  await axios.post(
    rpcUrl,
    {
      jsonrpc:
        "2.0",

      method:
        "eth_getTransactionByHash",

      params: [
        txHash,
      ],

      id: 2,
    }
  );

const tx =
  txResponse.data
    ?.result;

if (!tx) {
  return null;
}

      if (!tx) {
        return null;
      }

      return {
        found: true,

        chain,

        transaction: {
  ...tx,

  receipt,
},
      };
    } catch (error) {
      return null;
    }
  };

// =========================
// TON TX CHECK
// =========================

const checkTonTransaction =
  async (txHash) => {
    try {
      const response =
        await axios.get(
          `${tonConfig.apiUrl}/getTransactions`,
          {
            params: {
              limit: 20,

              api_key:
                tonConfig.apiKey,
            },
          }
        );

      const txs =
        response.data
          ?.result || [];

      const match =
        txs.find(
          (tx) =>
            tx
              .transaction_id
              ?.hash ===
            txHash
        );

      if (!match) {
        return null;
      }

      return {
        found: true,

        chain: "TON",

        transaction:
          match,
      };
    } catch (error) {
      return null;
    }
  };

  // =========================
// SEARCH TX IN WALLET
// =========================

const searchTransactionInWallet =
  async (txHash) => {
    try {
      const knownWallets = [
        "0x6c7c936494140b4df4ea0d4ac00ea2182a7bbc54",
      ];

      for (const wallet of knownWallets) {
        const walletData =
          await getBscWallet(
            wallet
          );

        const transactions =
          walletData
            ?.recentTransactions ||
          [];

        const match =
          transactions.find(
            (tx) =>
              tx.hash?.toLowerCase() ===
              txHash.toLowerCase()
          );

        if (match) {
          return {
            found: true,

            chain:
              walletData.chain,

            transaction:
              match,
          };
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  };

// =========================
// MAIN RESOLVER
// =========================

const resolveTransactionHash =
  async (txHash) => {
    try {
      // =========================
      // BSC
      // =========================

      const bscResult =
        await checkEvmTransaction(
          bscConfig.rpcUrl,
          txHash,
          "BSC"
        );

      if (bscResult) {
        return bscResult;
      }

      // =========================
      // ETHEREUM
      // =========================

      const ethResult =
        await checkEvmTransaction(
          ethereumConfig.rpcUrl,
          txHash,
          "Ethereum"
        );

      if (ethResult) {
        return ethResult;
      }

      // =========================
      // TON
      // =========================

      const tonResult =
        await checkTonTransaction(
          txHash
        );

      if (tonResult) {
        return tonResult;
      }

      // =========================
// WALLET HISTORY FALLBACK
// =========================

const fallback =
  await searchTransactionInWallet(
    txHash
  );

if (fallback) {
  return fallback;
}

      // =========================
      // NOT FOUND
      // =========================

      return {
        found: false,

        message:
          "Transaction not found on supported chains",
      };
    } catch (error) {
      console.log(
        "Transaction Resolver Error:",
        error.message
      );

      return {
        found: false,

        error:
          "Failed to resolve transaction",
      };
    }
  };

// =========================
// TRANSACTION INTELLIGENCE
// =========================

const analyzeTransactionHash =
  async (txHash) => {
    try {
      // =========================
      // RESOLVE TX
      // =========================

      const resolved =
        await resolveTransactionHash(
          txHash
        );

      if (
        !resolved?.found
      ) {
        return resolved;
      }

      const chain =
        resolved.chain;

      const tx =
        resolved.transaction;

      // =========================
      // NORMALIZE
      // =========================

      let from = null;

      let to = null;

      let value = 0;

      let asset = "Native";

      let timestamp = null;

      // =========================
      // EVM
      // =========================

     if (
  chain === "BSC" ||
  chain ===
    "Ethereum" ||
  chain ===
    "BNB Smart Chain"
) {
  from =
    tx.from;

  to =
    tx.to;

  value =
    Number(
      tx.value || 0
    );

  asset =
    tx.asset ||
    "Native";

  timestamp =
    tx.timestamp ||
    null;
}

      // =========================
      // TON
      // =========================

      else if (
        chain === "TON"
      ) {
        from =
          tx.in_msg
            ?.source;

        to =
          tx.in_msg
            ?.destination;

        value =
          Number(
            tx.in_msg
              ?.value || 0
          ) / 1e9;

        timestamp =
          tx.utime
            ? new Date(
                tx.utime *
                  1000
              ).toISOString()
            : null;
      }

      // =========================
      // CLASSIFICATION
      // =========================

      const normalizedTx =
        {
          hash: txHash,

          chain,

          from,

          to,

          asset,

          value,

          timestamp,
        };

      const classification =
        classifyTransaction(
          {
            tx:
              normalizedTx,

            chain,
          }
        );

      // =========================
      // PROTOCOL ANALYSIS
      // =========================

      const protocolFlows =
        analyzeProtocolFlows(
          {
            transactions:
              [
                normalizedTx,
              ],
          }
        );

      // =========================
      // WALLET ENRICHMENT
      // =========================

      let senderProfile =
        null;

      let receiverProfile =
        null;

      if (from) {
        senderProfile =
          await detectWallet(
            from
          );
      }

      if (to) {
        receiverProfile =
          await detectWallet(
            to
          );
      }

      // =========================
      // RISK ANALYSIS
      // =========================

const primaryProfile =
  senderProfile ||
  receiverProfile;

const riskAnalysis =
  generateRiskScore(
    {
      behavior:
        primaryProfile
          ?.transactionAnalysis
          ?.behavior,

      exchangeCorrelation:
        primaryProfile
          ?.transactionAnalysis
          ?.exchangeCorrelation,

      custody:
        primaryProfile
          ?.transactionAnalysis
          ?.custody,

      intelligence:
        primaryProfile
          ?.intelligence,

      protocolFlows,

      temporalIntelligence:
        primaryProfile
          ?.transactionAnalysis
          ?.temporalIntelligence,

      relationshipIntelligence:
        primaryProfile
          ?.transactionAnalysis
          ?.relationshipIntelligence,
    }
  );

      // =========================
      // FINAL
      // =========================

      return {
        success: true,

        chain,

        transaction: {
          hash: txHash,

          from,

          to,

          value,

          asset,

          timestamp,

          classification,

          raw: tx,
        },

        protocolFlows,

        riskAnalysis,

        senderProfile,

        receiverProfile,
      };
    } catch (error) {
      console.log(
        "Transaction Intelligence Error:",
        error.message
      );

      return {
        success: false,

        error:
          "Failed to analyze transaction",
      };
    }
  };

module.exports = {
  resolveTransactionHash,

  analyzeTransactionHash,
};