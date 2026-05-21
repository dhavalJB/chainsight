const stablecoinContracts =
  require(
    "../config/stablecoinContracts"
  );

// ========================
// HIGH-RISK AML TOKENS
// ========================

const amlRelevantTokens = [
  "USDT",
  "USDC",
  "DAI",
  "BUSD",
  "FDUSD",
  "TUSD",
  "USDP",
  "PYUSD",

  // Gaming / Casino
  "WIN",
  "FUN",
  "ROLL",
  "DG",
  "SAND",
  "MANA",
  "GALA",
  "MAGIC",

  // Privacy / Laundering
  "XMR",
  "ZEC",
  "DASH",

  // Exchange Ecosystem
  "BNB",
  "TRX",
  "TON",
  "ETH",

  // Bridge-heavy assets
  "WBTC",
  "WETH",
];

// ========================
// STABLECOINS
// ========================

const stablecoins = [
  "USDT",
  "USDC",
  "DAI",
  "BUSD",
  "FDUSD",
  "TUSD",
  "USDP",
  "PYUSD",
  "USD₮",
];

// ========================
// STABLECOIN CHECK
// ========================

const isStablecoin = (
  symbol
) => {
  try {
    if (!symbol) {
      return false;
    }

    return stablecoins.includes(
      symbol.toUpperCase()
    );
  } catch (error) {
    return false;
  }
};

// ========================
// AML TOKEN CHECK
// ========================

const isAMLRelevantToken =
  (symbol) => {
    try {
      if (!symbol) {
        return false;
      }

      return amlRelevantTokens.includes(
        symbol.toUpperCase()
      );
    } catch (error) {
      return false;
    }
  };

// ========================
// FAKE STABLECOIN
// ========================

const isFakeStablecoin = ({
  chain,
  contract,
  symbol,
}) => {
  try {
    if (
      !chain ||
      !contract ||
      !symbol
    ) {
      return false;
    }

    // Not stablecoin
    if (
      !isStablecoin(symbol)
    ) {
      return false;
    }

    const chainContracts =
      stablecoinContracts[
        chain
      ];

    if (!chainContracts) {
      return false;
    }

    const officialContract =
      chainContracts[
        symbol.toUpperCase()
      ];

    if (!officialContract) {
      return false;
    }

    // Compare
    return (
      officialContract.toLowerCase() !==
      contract.toLowerCase()
    );
  } catch (error) {
    return false;
  }
};

// ========================
// TOKEN CATEGORY
// ========================

const getTokenCategory = (
  symbol
) => {
  try {
    if (!symbol) {
      return "UNKNOWN";
    }

    const upper =
      symbol.toUpperCase();

    if (
      stablecoins.includes(
        upper
      )
    ) {
      return "STABLECOIN";
    }

    if (
      [
        "XMR",
        "ZEC",
        "DASH",
      ].includes(upper)
    ) {
      return "PRIVACY";
    }

    if (
      [
        "WIN",
        "FUN",
        "ROLL",
      ].includes(upper)
    ) {
      return "GAMBLING";
    }

    if (
      [
        "SAND",
        "MANA",
        "GALA",
      ].includes(upper)
    ) {
      return "GAMING";
    }

    return "STANDARD";
  } catch (error) {
    return "UNKNOWN";
  }
};

module.exports = {
  isStablecoin,

  isAMLRelevantToken,

  isFakeStablecoin,

  getTokenCategory,
};