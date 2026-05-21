const { Alchemy } = require(
  "alchemy-sdk"
);

const bscConfig = require(
  "./bscConfig"
);

const {
  isStablecoin,
  isFakeStablecoin,
} = require(
  "../../utils/tokenUtils"
);

const {
  analyzeTokenRisk,
} = require(
  "../../services/tokenRiskService"
);

const {
  normalizeTransaction,
} = require(
  "../../utils/transactionNormalizer"
);

const settings = {
  apiKey:
    process.env.ALCHEMY_API_KEY,

  network:
    bscConfig.network,
};

const alchemy =
  new Alchemy(settings);

// =========================
// FORMAT TRANSACTIONS
// =========================

const formatTransfers = (
  transfers = [],

  direction = "IN"
) => {
  return transfers.map(
    (tx) => {
      return normalizeTransaction(
        {
          chain:
            "BNB Smart Chain",

          hash: tx.hash,

          from: tx.from,

          to: tx.to,

          asset: tx.asset,

          value: tx.value,

          category:
            tx.category,

          blockNum:
            tx.blockNum,

          timestamp:
            tx.metadata
              ?.blockTimestamp ||
            null,

          direction,

          metadata: {
            rawCategory:
              tx.category,
          },
        }
      );
    }
  );
};

// =========================
// FETCH TRANSACTIONS
// =========================

const fetchTransactions =
  async (address) => {
    // INCOMING
    const incomingHistory =
      await alchemy.core.getAssetTransfers(
        {
          fromBlock: "0x0",

          toAddress: address,

          category: [
            "external",
            "erc20",
          ],

          withMetadata: true,

          maxCount: 20,
        }
      );

    // OUTGOING
    const outgoingHistory =
      await alchemy.core.getAssetTransfers(
        {
          fromBlock: "0x0",

          fromAddress:
            address,

          category: [
            "external",
            "erc20",
          ],

          withMetadata: true,

          maxCount: 20,
        }
      );

    // FORMAT
    const incomingTransactions =
      formatTransfers(
        incomingHistory.transfers,
        "IN"
      );

    const outgoingTransactions =
      formatTransfers(
        outgoingHistory.transfers,
        "OUT"
      );

    // MERGE + SORT
    return [
      ...incomingTransactions,

      ...outgoingTransactions,
    ].sort((a, b) => {
      const timeA =
        new Date(
          a.timestamp || 0
        ).getTime();

      const timeB =
        new Date(
          b.timestamp || 0
        ).getTime();

      return timeB - timeA;
    });
  };

// =========================
// LITE FETCHER
// =========================

const getBscWalletLite =
  async (address) => {
    try {
      const txCount =
        await alchemy.core.getTransactionCount(
          address
        );

      const recentTransactions =
        await fetchTransactions(
          address
        );

      return {
        exists: true,

        wallet: address,

        chain:
          "BNB Smart Chain",

        txCount,

        active:
          txCount > 0,

        recentTransactions,
      };
    } catch (error) {
      console.error(
        "BSC Lite Error:",
        error.message
      );

      return null;
    }
  };

// =========================
// FULL FETCHER
// =========================

const getBscWallet =
  async (
    address,

    options = {}
  ) => {
    try {
      // =========================
      // LITE MODE
      // =========================

      if (
        options.lite ===
        true
      ) {
        return await getBscWalletLite(
          address
        );
      }

      // =========================
      // BALANCE
      // =========================

      const balanceWei =
        await alchemy.core.getBalance(
          address
        );

      // =========================
      // TX COUNT
      // =========================

      const txCount =
        await alchemy.core.getTransactionCount(
          address
        );

      // =========================
      // TRANSACTIONS
      // =========================

      const recentTransactions =
        await fetchTransactions(
          address
        );

      // =========================
      // TOKENS
      // =========================

      const tokenBalances =
        await alchemy.core.getTokenBalances(
          address
        );

      const activeTokens =
        tokenBalances.tokenBalances.filter(
          (token) =>
            token.tokenBalance !==
              "0" &&
            token.tokenBalance !==
              "0x0"
        );

      const limitedTokens =
        activeTokens.slice(
          0,
          15
        );

      const formattedTokens =
        await Promise.all(
          limitedTokens.map(
            async (
              token
            ) => {
              try {
                const metadata =
                  await alchemy.core.getTokenMetadata(
                    token.contractAddress
                  );

                const decimals =
                  metadata.decimals ||
                  18;

                const rawBalance =
                  BigInt(
                    token.tokenBalance
                  );

                const formattedBalance =
                  Number(
                    rawBalance
                  ) /
                  10 **
                    decimals;

                const fakeStablecoin =
                  isFakeStablecoin(
                    {
                      chain:
                        "BSC",

                      contract:
                        token.contractAddress,

                      symbol:
                        metadata.symbol,
                    }
                  );

                const stablecoin =
                  isStablecoin(
                    metadata.symbol
                  );

                return {
                  contract:
                    token.contractAddress,

                  name:
                    metadata.name ||
                    "Unknown",

                  symbol:
                    metadata.symbol ||
                    "UNKNOWN",

                  balance:
                    formattedBalance,

                  decimals,

                  logo:
                    metadata.logo ||
                    null,

                  stablecoin,

                  ...analyzeTokenRisk(
                    {
                      name:
                        metadata.name ||
                        "Unknown",

                      symbol:
                        metadata.symbol ||
                        "UNKNOWN",

                      balance:
                        formattedBalance,

                      fakeStablecoin,
                    }
                  ),

                  fakeStablecoin,
                };
              } catch (
                error
              ) {
                return null;
              }
            }
          )
        );

      const cleanTokens =
        formattedTokens.filter(
          Boolean
        );

      // =========================
      // FINAL
      // =========================

      return {
        exists: true,

        wallet: address,

        chain:
          "BNB Smart Chain",

        balanceBNB:
          Number(
            balanceWei
          ) / 1e18,

        txCount,

        tokenCount:
          cleanTokens.length,

        tokens:
          cleanTokens,

        recentTransactions,

        active:
          txCount > 0,
      };
    } catch (error) {
      console.error(
        "BSC Service Error:",
        error.message
      );

      return {
        exists: false,

        wallet: address,

        chain:
          "BNB Smart Chain",

        error:
          "Failed to fetch BSC wallet",
      };
    }
  };

module.exports = {
  getBscWallet,

  getBscWalletLite,
};