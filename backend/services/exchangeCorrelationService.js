const MAX_SETTLEMENT_WINDOW =
  360; // 6 hours

const correlateExchangeFlow =
  async ({
    transactions = [],
  }) => {
    try {
      const correlations = [];

      // ========================
      // STABLECOIN TXS ONLY
      // ========================

      const stablecoinTxs =
        transactions.filter(
          (tx) =>
            tx.stablecoin ===
            true
        );

      // ========================
      // INCOMING / OUTGOING
      // ========================

      const incoming =
        stablecoinTxs.filter(
          (tx) =>
            tx.direction ===
            "IN"
        );

      const outgoing =
        stablecoinTxs.filter(
          (tx) =>
            tx.direction ===
            "OUT"
        );

      // ========================
      // FLOW CORRELATION
      // ========================

      for (const inTx of incoming) {
        for (const outTx of outgoing) {
          // Prevent self-match
          if (
            inTx.hash ===
            outTx.hash
          ) {
            continue;
          }

          const inValue =
            Number(
              inTx.value || 0
            );

          const outValue =
            Number(
              outTx.value || 0
            );

          const amountDiff =
            Math.abs(
              inValue -
                outValue
            );

          // ========================
          // AMOUNT MATCH
          // ========================

          if (amountDiff >= 2) {
            continue;
          }

          // ========================
          // TIMING
          // ========================

          let timeDifference =
            null;

          if (
            inTx.timestamp &&
            outTx.timestamp
          ) {
            const inTime =
              new Date(
                inTx.timestamp
              ).getTime();

            const outTime =
              new Date(
                outTx.timestamp
              ).getTime();

            const minutes =
              Math.abs(
                outTime -
                  inTime
              ) /
              1000 /
              60;

            timeDifference =
              minutes;
          }

          // ========================
          // INVALID TIMING
          // ========================

          if (
            timeDifference ===
            null
          ) {
            continue;
          }

          // ========================
          // MAX WINDOW
          // ========================

          if (
            timeDifference >
            MAX_SETTLEMENT_WINDOW
          ) {
            continue;
          }

          // ========================
          // SCORING
          // ========================

          let confidence =
            "LOW";

          let score = 40;

          // ========================
          // RAPID SETTLEMENT
          // ========================

          if (
            timeDifference <=
            30
          ) {
            score += 50;
          }

          // ========================
          // FAST SETTLEMENT
          // ========================

          else if (
            timeDifference <=
            120
          ) {
            score += 35;
          }

          // ========================
          // SLOW SETTLEMENT
          // ========================

          else if (
            timeDifference <=
            360
          ) {
            score += 15;
          }

          // ========================
          // HIGH VALUE
          // ========================

          if (
            outValue >= 100
          ) {
            score += 10;
          }

          // ========================
          // CONFIDENCE
          // ========================

          if (score >= 85) {
            confidence =
              "HIGH";
          }

          else if (
            score >= 65
          ) {
            confidence =
              "MEDIUM";
          }

          // ========================
          // FLOW TYPE
          // ========================

          let flowType =
            "Stablecoin Routing";

          if (
            timeDifference <=
            30
          ) {
            flowType =
              "Rapid Settlement";
          }

          else if (
            timeDifference <=
            120
          ) {
            flowType =
              "Fast Settlement";
          }

          // ========================
          // FINDINGS
          // ========================

          const findings = [];

          findings.push(
            "Matching stablecoin amounts detected"
          );

          findings.push(
            `Settlement delay: ${timeDifference.toFixed(
              1
            )} minutes`
          );

          if (
            outValue >= 100
          ) {
            findings.push(
              "High-value settlement flow"
            );
          }

          // ========================
          // PUSH
          // ========================

          correlations.push({
            type:
              flowType,

            confidence,

            score,

            asset:
              outTx.asset,

            amount:
              outTx.value,

            from:
              inTx.from,

            to:
              outTx.to,

            incomingTx:
              inTx.hash,

            outgoingTx:
              outTx.hash,

            settlementDelay:
              timeDifference,

            findings,
          });
        }
      }

      // ========================
      // SORT
      // ========================

      correlations.sort(
        (a, b) =>
          b.score - a.score
      );

      // ========================
      // FINAL
      // ========================

      return {
        detected:
          correlations.length >
          0,

        totalCorrelations:
          correlations.length,

        correlations,
      };
    } catch (error) {
      console.log(
        "Exchange Correlation Error:",
        error.message
      );

      return {
        detected: false,

        totalCorrelations: 0,

        correlations: [],
      };
    }
  };

module.exports = {
  correlateExchangeFlow,
};