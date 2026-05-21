const analyzeAMLPatterns =
  ({
    wallet,
    transactions = [],
    custody = null,
    relationshipIntelligence = null,
    protocolFlows = null,
  }) => {
    try {
      let launderingScore = 0;

      let launderingRisk =
        "LOW";

      const findings = [];

      // ========================
      // NORMALIZE
      // ========================

      const incoming =
        transactions.filter(
          (tx) =>
            tx.direction ===
            "IN"
        );

      const outgoing =
        transactions.filter(
          (tx) =>
            tx.direction ===
            "OUT"
        );

      // ========================
      // RAPID PASS THROUGH
      // ========================

      let rapidForwarding =
        0;

      let lowHoldingTime =
        0;

      for (const inTx of incoming) {
        for (const outTx of outgoing) {
          if (
            !inTx.timestamp ||
            !outTx.timestamp
          ) {
            continue;
          }

          const inTime =
            new Date(
              inTx.timestamp
            ).getTime();

          const outTime =
            new Date(
              outTx.timestamp
            ).getTime();

          if (
            outTime <= inTime
          ) {
            continue;
          }

          const diffMinutes =
            (outTime -
              inTime) /
            (1000 * 60);

          // forwarding within 30 min

          if (
            diffMinutes <=
            30
          ) {
            rapidForwarding++;
          }

          // laundering wallets
          // rarely hold funds

          if (
            diffMinutes <=
            10
          ) {
            lowHoldingTime++;
          }
        }
      }

      if (
        rapidForwarding >= 3
      ) {
        launderingScore +=
          20;

        findings.push(
          "Rapid pass-through routing detected"
        );
      }

      if (
        lowHoldingTime >= 2
      ) {
        launderingScore +=
          25;

        findings.push(
          "Very low holding-time behavior detected"
        );
      }

      // ========================
      // FAN OUT
      // ========================

      const uniqueOutgoing =
        new Set();

      outgoing.forEach(
        (tx) => {
          if (tx.to) {
            uniqueOutgoing.add(
              tx.to.toLowerCase()
            );
          }
        }
      );

      if (
        uniqueOutgoing.size >=
        7
      ) {
        launderingScore +=
          25;

        findings.push(
          "Fund distribution pattern detected"
        );
      }

      // ========================
      // FAN IN
      // ========================

      const uniqueIncoming =
        new Set();

      incoming.forEach(
        (tx) => {
          if (tx.from) {
            uniqueIncoming.add(
              tx.from.toLowerCase()
            );
          }
        }
      );

      if (
        uniqueIncoming.size >=
        10
      ) {
        launderingScore +=
          20;

        findings.push(
          "Fund aggregation pattern detected"
        );
      }

      // ========================
      // CIRCULAR ROUTING
      // ========================

      let circularRouting =
        0;

      incoming.forEach(
        (inTx) => {
          outgoing.forEach(
            (outTx) => {
              if (
                inTx.from &&
                outTx.to &&
                inTx.from.toLowerCase() ===
                  outTx.to.toLowerCase()
              ) {
                circularRouting++;
              }
            }
          );
        }
      );

      if (
        circularRouting >= 2
      ) {
        launderingScore +=
          30;

        findings.push(
          "Circular routing behavior detected"
        );
      }

      // ========================
      // MULTI-HOP LAYERING
      // ========================

      const pathCount =
        custody?.paths
          ?.length || 0;

      if (
        pathCount >= 5
      ) {
        launderingScore +=
          20;

        findings.push(
          "Multi-hop layering structure detected"
        );
      }

      // ========================
      // CROSS-CHAIN ROUTING
      // ========================

      const chains =
        new Set();

      transactions.forEach(
        (tx) => {
          if (tx.chain) {
            chains.add(
              tx.chain
            );
          }
        }
      );

      if (
        chains.size >= 2
      ) {
        launderingScore +=
          35;

        findings.push(
          "Cross-chain movement detected"
        );
      }

      // ========================
      // MIXER PATTERN
      // ========================

      const mixerIndicators =
        [];

      if (
        uniqueOutgoing.size >=
          10 &&
        rapidForwarding >=
          5 &&
        lowHoldingTime >=
          3
      ) {
        launderingScore +=
          40;

        mixerIndicators.push(
          "High wallet dispersion"
        );

        mixerIndicators.push(
          "Rapid redistribution"
        );

        mixerIndicators.push(
          "Low fund retention"
        );

        findings.push(
          "Potential mixer-style obfuscation detected"
        );
      }

      // ========================
      // RELATIONSHIP OVERLAP
      // ========================

      if (
        relationshipIntelligence
          ?.sharedCounterparties >=
        10
      ) {
        launderingScore +=
          15;

        findings.push(
          "Dense counterparty overlap detected"
        );
      }

      // ========================
      // PROTOCOL RISK
      // ========================

      if (
        protocolFlows
          ?.bridgeTransferCount >
        0
      ) {
        launderingScore +=
          15;

        findings.push(
          "Bridge usage detected"
        );
      }

      // ========================
      // FALSE POSITIVE REDUCTION
      // ========================

      const likelyMerchant =
        incoming.length >=
          10 &&
        outgoing.length >=
          10 &&
        uniqueIncoming.size >=
          10 &&
        uniqueOutgoing.size >=
          10 &&
        rapidForwarding <
          3;

      if (likelyMerchant) {
        launderingScore -=
          25;

        findings.push(
          "Operational merchant activity likely"
        );
      }

      // ========================
      // FINAL SCORE
      // ========================

      if (
        launderingScore < 0
      ) {
        launderingScore = 0;
      }

      if (
        launderingScore >=
        40
      ) {
        launderingRisk =
          "MEDIUM";
      }

      if (
        launderingScore >=
        75
      ) {
        launderingRisk =
          "HIGH";
      }

      return {
        launderingScore,

        launderingRisk,

        rapidForwarding,

        lowHoldingTime,

        fanInWallets:
          uniqueIncoming.size,

        fanOutWallets:
          uniqueOutgoing.size,

        circularRouting,

        chainsUsed:
          chains.size,

        mixerIndicators,

        findings,
      };
    } catch (error) {
      console.log(
        "AML Service Error:",
        error.message
      );

      return null;
    }
  };

module.exports = {
  analyzeAMLPatterns,
};