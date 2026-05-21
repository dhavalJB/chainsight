const {
  isStablecoin,
} = require(
  "./tokenUtils"
);

// =========================
// NORMALIZE TRANSACTION
// =========================

const normalizeTransaction =
  ({
    chain,

    hash,

    from,

    to,

    asset,

    value,

    category,

    blockNum,

    timestamp,

    direction,

    metadata = {},
  }) => {
    // =========================
    // SANITIZE
    // =========================

    const cleanAsset =
      asset || "UNKNOWN";

    const cleanValue =
      Number(value || 0);

    const stablecoin =
      isStablecoin(
        cleanAsset
      );

    // =========================
    // NORMALIZED OBJECT
    // =========================

    return {
      chain,

      hash:
        hash || null,

      from:
        from || null,

      to:
        to || null,

      asset:
        cleanAsset,

      value:
        cleanValue,

      stablecoin,

      category:
        category ||
        "unknown",

      blockNum:
        blockNum || null,

      timestamp:
        timestamp || null,

      direction:
        direction ||
        "UNKNOWN",

      metadata,
    };
  };

// =========================
// NORMALIZE ARRAY
// =========================

const normalizeTransactions =
  (
    transactions = []
  ) => {
    return transactions
      .map((tx) =>
        normalizeTransaction(
          tx
        )
      )
      .filter(Boolean);
  };

module.exports = {
  normalizeTransaction,

  normalizeTransactions,
};