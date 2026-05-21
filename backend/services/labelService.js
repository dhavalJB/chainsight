const protocolLabels =
  require(
    "../config/protocolLabels"
  );

// ========================
// KNOWN LABELS
// ========================

const labels = {
  // ========================
  // BINANCE
  // ========================

  "0x8894e0a0c962cb723c1976a4421c95949be2d4e3":
    {
      label:
        "Binance Hot Wallet",

      type:
        "Exchange",

      exchange:
        "Binance",

      chain:
        "BSC",

      risk:
        "LOW",

      confidence:
        "HIGH",
    },

  // ========================
  // KUCOIN
  // ========================

  "0x28c6c06298d514db089934071355e5743bf21d60":
    {
      label:
        "KuCoin Hot Wallet",

      type:
        "Exchange",

      exchange:
        "KuCoin",

      chain:
        "Ethereum",

      risk:
        "LOW",

      confidence:
        "HIGH",
    },

  // ========================
  // OKX
  // ========================

  "0x1b96b92314c44b159149f7e0303511fb2fc4774f":
    {
      label:
        "OKX Hot Wallet",

      type:
        "Exchange",

      exchange:
        "OKX",

      chain:
        "BSC",

      risk:
        "LOW",

      confidence:
        "HIGH",
    },
};

// ========================
// GET LABEL
// ========================

const getWalletLabel = (
  address,

  chain = null
) => {
  try {
    if (!address) {
      return null;
    }

    // ========================
    // DIRECT LABELS
    // ========================

    const normalized =
      address.toLowerCase();

    if (
      labels[normalized]
    ) {
      return labels[
        normalized
      ];
    }

    // ========================
    // PROTOCOL LABELS
    // ========================

    if (
      chain &&
      protocolLabels[chain]
    ) {
      const protocolLabel =
        protocolLabels[
          chain
        ][normalized];

      if (
        protocolLabel
      ) {
        return {
          ...protocolLabel,

          chain,

          confidence:
            "HIGH",
        };
      }
    }

    return null;
  } catch (error) {
    console.log(
      "Label Service Error:",
      error.message
    );

    return null;
  }
};

// ========================
// EXCHANGE CHECK
// ========================

const isKnownExchangeWallet =
  (
    address,

    chain = null
  ) => {
    const label =
      getWalletLabel(
        address,
        chain
      );

    return (
      label &&
      label.type ===
        "Exchange"
    );
  };

// ========================
// PROTOCOL CHECK
// ========================

const isKnownProtocol =
  (
    address,

    chain = null
  ) => {
    const label =
      getWalletLabel(
        address,
        chain
      );

    return (
      label &&
      [
        "DEX",
        "Bridge",
        "DEX Aggregator",
      ].includes(
        label.type
      )
    );
  };

module.exports = {
  labels,

  getWalletLabel,

  isKnownExchangeWallet,

  isKnownProtocol,
};