const { detectChain } = require(
  "../utils/walletUtils"
);

const {
  getBitcoinWallet,
} = require(
  "../chains/bitcoin/bitcoinService"
);

const {
  getEthereumWallet,
} = require(
  "../chains/ethereum/ethereumService"
);

const {
  getBscWallet,
} = require(
  "../chains/bsc/bscService"
);

const {
  getTonWallet,
} = require(
  "../chains/ton/tonService"
);

const {
  generateWalletIntelligence,
} = require(
  "./intelligenceService"
);

const {
  analyzeTransactions,
} = require(
  "./transactionAnalysisService"
);

const {
  generateRiskScore,
} = require(
  "./riskScoringService"
);

exports.detectWallet =
  async (address) => {
    try {
      // ========================
      // DETECT CHAIN
      // ========================

      const chain =
        detectChain(
          address
        );

      let walletData =
        null;

      let traceFunction =
        null;

      // ========================
      // BITCOIN
      // ========================

      if (
        chain ===
        "Bitcoin"
      ) {
        walletData =
          await getBitcoinWallet(
            address
          );

        traceFunction =
          getBitcoinWallet;
      }

      // ========================
      // ETHEREUM
      // ========================

      else if (
        chain ===
        "Ethereum"
      ) {
        walletData =
          await getEthereumWallet(
            address
          );

        traceFunction =
          getEthereumWallet;
      }

      // ========================
      // BSC
      // ========================

      else if (
        chain === "BSC"
      ) {
        walletData =
          await getBscWallet(
            address
          );

        traceFunction =
          getBscWallet;
      }

      // ========================
      // TON
      // ========================

      else if (
        chain === "TON"
      ) {
        walletData =
          await getTonWallet(
            address
          );

        traceFunction =
          getTonWallet;
      }

      // ========================
      // TRON
      // ========================

      else if (
        chain === "Tron"
      ) {
        walletData = {
          wallet:
            address,

          chain: "Tron",

          supported:
            false,

          message:
            "Tron support coming next",
        };
      }

      // ========================
      // SOLANA
      // ========================

      else if (
        chain ===
        "Solana"
      ) {
        walletData = {
          wallet:
            address,

          chain:
            "Solana",

          supported:
            false,

          message:
            "Solana support coming next",
        };
      }

      // ========================
      // UNKNOWN
      // ========================

      if (!walletData) {
        return {
          exists: false,

          wallet:
            address,

          chain,

          supported:
            false,
        };
      }

      // ========================
      // UNSUPPORTED
      // ========================
if (
  !walletData ||
  walletData.exists ===
    false
) {
  return {
    exists: false,

    wallet: address,

    chain,

    error:
      walletData?.error ||
      "Wallet lookup failed",
  };
}

if (
  walletData.supported ===
  false
) {
  return walletData;
}

      // ========================
      // EXTRACT RAW TXS
      // ========================

      const rawTransactions =
        walletData.recentTransactions ||
        [];

      // REMOVE RAW TXS
      delete walletData.recentTransactions;

      // ========================
      // CORE INTELLIGENCE
      // ========================

      const intelligence =
        generateWalletIntelligence(
          {
            ...walletData,

            recentTransactions:
              rawTransactions,
          }
        );

      // ========================
      // TRANSACTION ANALYSIS
      // ========================

      let transactionAnalysis =
        null;

      if (
        rawTransactions.length >
        0
      ) {
        transactionAnalysis =
          await analyzeTransactions(
            {
              wallet:
                address,

              transactions:
                rawTransactions,

              traceFunction,
            }
          );
      }

      // ========================
// RISK SCORING
// ========================

let riskAnalysis =
  null;

if (
  transactionAnalysis
) {
  riskAnalysis =
    generateRiskScore(
      {
        behavior:
          transactionAnalysis.behavior,

        exchangeCorrelation:
          transactionAnalysis.exchangeCorrelation,

        custody:
          transactionAnalysis.custody,

        intelligence,
      }
    );
}

      // ========================
      // WALLET OVERVIEW
      // ========================

      const walletOverview =
        {
          wallet:
            walletData.wallet,

          chain:
            walletData.chain,

          exists:
            walletData.exists,

          active:
            walletData.active,

          state:
            walletData.state ||
            null,

          txCount:
            walletData.txCount ||
            0,

          tokenCount:
            walletData.tokenCount ||
            0,
        };

      // ========================
      // BALANCES
      // ========================

      const balances = {
        balanceBTC:
          walletData.balanceBTC ||
          0,

        balanceETH:
          walletData.balanceETH ||
          0,

        balanceBNB:
          walletData.balanceBNB ||
          0,

        balanceTON:
          walletData.balanceTON ||
          0,
      };

      // ========================
      // FINAL RESPONSE
      // ========================

      return {
        walletOverview,

        balances,

        assets: {
          tokens:
            walletData.tokens ||
            [],
        },

        intelligence,

        transactionAnalysis,

        riskAnalysis,
      };
    } catch (error) {
      console.log(
        "Wallet Service Error:",
        error.message
      );

      return {
        exists: false,

        wallet:
          address,

        error:
          "Failed to analyze wallet",
      };
    }
  };