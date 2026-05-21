const weights =
  require(
    "../config/relationshipWeights"
  );

const analyzeRelationships =
  ({
    transactions = [],

    behavior = null,

    custody = null,

    temporalIntelligence = null,

    protocolFlows = null,
  }) => {
    try {
      let confidence = 0;

      const signals = [];

      const counterparties =
        new Set();

      const exchangeWallets =
        new Set();

      const amountMap = {};

      let repeatedRoutes = 0;

      let gasFundingPatterns = 0;

      // =========================
      // PROCESS TRANSACTIONS
      // =========================

      for (const tx of transactions) {
        const counterparty =
          tx.direction ===
          "IN"
            ? tx.from
            : tx.to;

        if (counterparty) {
          counterparties.add(
            counterparty.toLowerCase()
          );
        }

        // =========================
        // EXCHANGE EXPOSURE
        // =========================

        if (
          tx.classification
            ?.type ===
          "EXCHANGE_DEPOSIT"
        ) {
          exchangeWallets.add(
            tx.to?.toLowerCase()
          );
        }

        // =========================
        // REPEATED AMOUNTS
        // =========================

        const rounded =
          Number(
            tx.value || 0
          ).toFixed(2);

        amountMap[rounded] =
          (amountMap[
            rounded
          ] || 0) + 1;

        // =========================
        // GAS FUNDING
        // =========================

        if (
          ["BNB", "ETH", "TON"].includes(
            (
              tx.asset || ""
            ).toUpperCase()
          ) &&
          Number(tx.value) <
            0.01 &&
          tx.direction ===
            "IN"
        ) {
          gasFundingPatterns++;

          confidence +=
            weights.gasFunding;

          signals.push(
            "Gas funding behavior detected"
          );
        }
      }

      // =========================
      // REPEATED AMOUNTS
      // =========================

      Object.values(
        amountMap
      ).forEach((count) => {
        if (count >= 2) {
          confidence +=
            weights.repeatedAmounts;

          signals.push(
            "Repeated transfer amounts detected"
          );
        }
      });

      // =========================
      // EXCHANGE EXPOSURE
      // =========================

      if (
        exchangeWallets.size >=
        1
      ) {
        confidence +=
          weights.exchangeExposure;

        signals.push(
          "Shared exchange exposure detected"
        );
      }

      // =========================
      // ROUTING BEHAVIOR
      // =========================

      if (
        behavior
          ?.routingTransactions >
        0
      ) {
        repeatedRoutes++;

        confidence +=
          weights.routingBehavior;

        signals.push(
          "Routing behavior pattern detected"
        );
      }

      // =========================
      // RAPID SETTLEMENT
      // =========================

      if (
        behavior
          ?.rapidSettlementCount >
        0
      ) {
        confidence +=
          weights.rapidSettlement;

        signals.push(
          "Rapid settlement behavior detected"
        );
      }

      // =========================
      // COMPLEX GRAPH
      // =========================

      if (
        custody?.paths
          ?.length >= 3
      ) {
        confidence +=
          weights.complexGraph;

        signals.push(
          "Complex custody graph detected"
        );
      }

      // =========================
      // TEMPORAL SIGNALS
      // =========================

      if (
        temporalIntelligence
          ?.rapidBursts >= 2
      ) {
        confidence +=
          weights.coordinatedTiming;

        signals.push(
          "Coordinated rapid settlement timing detected"
        );
      }

      if (
        temporalIntelligence
          ?.nightActivity >= 3
      ) {
        confidence +=
          weights.nightActivity;

        signals.push(
          "High late-night operational activity detected"
        );
      }

      if (
        temporalIntelligence
          ?.activityPattern ===
        "Coordinated Settlement Window"
      ) {
        confidence +=
          weights.coordinatedTiming;

        signals.push(
          "Coordinated operational timing pattern detected"
        );
      }

      // =========================
      // BRIDGE USAGE
      // =========================

      if (
        protocolFlows
          ?.bridgeTransferCount >
        0
      ) {
        confidence +=
          weights.bridgeUsage;

        signals.push(
          "Bridge usage detected"
        );
      }

      // =========================
      // AGGREGATOR ROUTING
      // =========================

      if (
        protocolFlows
          ?.aggregatorRouteCount >
        0
      ) {
        confidence +=
          weights.aggregatorRouting;

        signals.push(
          "Aggregator routing detected"
        );
      }

      // =========================
      // CHAIN HOPPING
      // =========================

      if (
        protocolFlows
          ?.chainHops > 0
      ) {
        confidence +=
          weights.chainHopping;

        signals.push(
          "Chain hopping behavior detected"
        );
      }

      // =========================
      // HARD CAP
      // =========================

      confidence =
        Math.min(
          confidence,
          95
        );

      // =========================
      // LEVEL
      // =========================

      let relationshipRisk =
        "LOW";

      if (
        confidence >= 45
      ) {
        relationshipRisk =
          "MEDIUM";
      }

      if (
        confidence >= 80
      ) {
        relationshipRisk =
          "HIGH";
      }

      // =========================
      // FINAL
      // =========================

      return {
        possibleOperationalRelationship:
          confidence >= 35,

        confidence,

        relationshipRisk,

        counterparties:
          counterparties.size,

        exchangeExposure:
          exchangeWallets.size,

        repeatedRoutes,

        gasFundingPatterns,

        signals,
      };
    } catch (error) {
      console.log(
        "Relationship Intelligence Error:",
        error.message
      );

      return null;
    }
  };

module.exports = {
  analyzeRelationships,
};