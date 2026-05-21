const analyzeProtocolFlows =
  ({
    transactions = [],
  }) => {
    try {
      const findings = [];

      let dexSwapCount = 0;

      let bridgeTransferCount = 0;

      let aggregatorRouteCount = 0;

      let chainHops = 0;

      let obfuscationRisk = 0;

      // =========================
      // PROCESS TXS
      // =========================

      for (let i = 0; i < transactions.length; i++) {
        const tx =
          transactions[i];

        const classification =
          tx.classification ||
          {};

        const type =
          classification.type;

        // =========================
        // DEX SWAPS
        // =========================

        if (
          type ===
          "DEX_SWAP"
        ) {
          dexSwapCount++;

          findings.push(
            `DEX interaction via ${classification.protocol}`
          );

          obfuscationRisk += 10;
        }

        // =========================
        // BRIDGES
        // =========================

        if (
          type ===
          "BRIDGE_TRANSFER"
        ) {
          bridgeTransferCount++;

          findings.push(
            `Bridge transfer detected via ${classification.protocol}`
          );

          obfuscationRisk += 25;
        }

        // =========================
        // AGGREGATORS
        // =========================

        if (
          type ===
          "AGGREGATOR_ROUTE"
        ) {
          aggregatorRouteCount++;

          findings.push(
            `DEX aggregator routing detected via ${classification.protocol}`
          );

          obfuscationRisk += 15;
        }

        // =========================
        // CHAIN HOPPING
        // =========================

        const nextTx =
          transactions[
            i + 1
          ];

        if (
          nextTx &&
          tx.chain &&
          nextTx.chain &&
          tx.chain !==
            nextTx.chain
        ) {
          chainHops++;

          findings.push(
            `Possible chain hopping detected (${tx.chain} → ${nextTx.chain})`
          );

          obfuscationRisk += 30;
        }
      }

      // =========================
      // RISK LEVEL
      // =========================

      let riskLevel =
        "LOW";

      if (
        obfuscationRisk >=
        40
      ) {
        riskLevel =
          "MEDIUM";
      }

      if (
        obfuscationRisk >=
        70
      ) {
        riskLevel =
          "HIGH";
      }

      // =========================
      // FINAL
      // =========================

      return {
        dexSwapCount,

        bridgeTransferCount,

        aggregatorRouteCount,

        chainHops,

        obfuscationRisk,

        riskLevel,

        findings,
      };
    } catch (error) {
      console.log(
        "Protocol Flow Error:",
        error.message
      );

      return null;
    }
  };

module.exports = {
  analyzeProtocolFlows,
};