const { Alchemy } = require("alchemy-sdk");

const ethereumConfig = require("./ethereumConfig");

const {
  isStablecoin,
  isSuspiciousToken,
  isFakeStablecoin,
} = require("../../utils/tokenUtils");

const {
  analyzeTokenRisk,
} = require("../../services/tokenRiskService");

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: ethereumConfig.network,
};

const alchemy = new Alchemy(settings);

exports.getEthereumWallet = async (address) => {
  try {
    // ETH Balance
    const balanceWei =
      await alchemy.core.getBalance(address);

    // Transaction Count
// Transaction Count
const txCount =
  await alchemy.core.getTransactionCount(
    address
  );

// Recent Transactions
const txHistory =
  await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toAddress: address,
    category: [
      "external",
      "erc20",
    ],
    maxCount: 10,
  });

const recentTransactions =
  txHistory.transfers.map((tx) => ({
    hash: tx.hash,

    from: tx.from,

    to: tx.to,

    asset: tx.asset,

    value: tx.value,

    category: tx.category,

    blockNum: tx.blockNum,
  }));

    // Token Balances
    const tokenBalances =
      await alchemy.core.getTokenBalances(
        address
      );

    // Remove zero balances
    const activeTokens =
      tokenBalances.tokenBalances.filter(
        (token) =>
          token.tokenBalance !== "0" &&
          token.tokenBalance !== "0x0"
      );

    // Limit for speed
    const limitedTokens =
      activeTokens.slice(0, 15);

    const formattedTokens =
      await Promise.all(
        limitedTokens.map(
          async (token) => {
            try {
              const metadata =
                await alchemy.core.getTokenMetadata(
                  token.contractAddress
                );

              const decimals =
                metadata.decimals || 18;

              const rawBalance =
                BigInt(
                  token.tokenBalance
                );

              const formattedBalance =
                Number(rawBalance) /
                10 ** decimals;

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

                stablecoin:
                  isStablecoin(
                    metadata.symbol
                  ),

...analyzeTokenRisk({
  name:
    metadata.name || "Unknown",

  symbol:
    metadata.symbol || "UNKNOWN",

  balance:
    formattedBalance,

  fakeStablecoin:
    isFakeStablecoin({
      contract:
        token.contractAddress,

      symbol:
        metadata.symbol || "UNKNOWN",
    }),
}),

                fakeStablecoin:
                  isFakeStablecoin({
                    contract:
                      token.contractAddress,

                    symbol:
                      metadata.symbol,
                  }),
              };
            } catch (error) {
              return null;
            }
          }
        )
      );

    // Remove failed tokens
    const cleanTokens =
      formattedTokens.filter(Boolean);

    return {
      exists: true,

      wallet: address,

      chain: "Ethereum",

      balanceETH:
        Number(balanceWei) / 1e18,

      txCount,

      tokenCount:
        cleanTokens.length,

      tokens:
        cleanTokens,

      active:
        txCount > 0,
    };
  } catch (error) {
    console.error(
      "Ethereum Service Error:",
      error.message
    );

    return {
        recentTransactions,
      exists: false,

      error:
        "Failed to fetch Ethereum wallet",
    };
  }
};