const detectChain = (
  address
) => {
  try {
    if (!address) {
      return "Unknown";
    }

    // ========================
    // BITCOIN
    // ========================

    if (
      address.startsWith(
        "bc1"
      ) ||
      address.startsWith("1") ||
      address.startsWith("3")
    ) {
      return "Bitcoin";
    }

    // ========================
    // TRON
    // ========================

    if (
      /^T[a-zA-Z0-9]{33}$/.test(
        address
      )
    ) {
      return "Tron";
    }

    // ========================
    // TON
    // ========================

    if (
      address.startsWith(
        "UQ"
      ) ||
      address.startsWith("EQ")
    ) {
      return "TON";
    }

    // ========================
    // SOLANA
    // ========================

    if (
      /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(
        address
      )
    ) {
      return "Solana";
    }

    // ========================
    // EVM
    // ========================

    if (
      /^0x[a-fA-F0-9]{40}$/.test(
        address
      )
    ) {
      return "BSC";
    }

    return "Unknown";
  } catch (error) {
    return "Unknown";
  }
};

const isValidWallet = (
  address
) => {
  return (
    detectChain(address) !==
    "Unknown"
  );
};

module.exports = {
  detectChain,

  isValidWallet,
};