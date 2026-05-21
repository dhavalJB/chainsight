const analyzeTemporalPatterns =
  ({
    transactions = [],
  }) => {
    try {
      const hourMap = {};

      let rapidBursts = 0;

      let nightActivity = 0;

      let riskScore = 0;

      const findings = [];

      // =========================
      // SORT TXS
      // =========================

      const sorted =
        [...transactions].sort(
          (a, b) =>
            new Date(
              a.timestamp
            ) -
            new Date(
              b.timestamp
            )
        );

      // =========================
      // PROCESS TXS
      // =========================

      for (let i = 0; i < sorted.length; i++) {
        const tx =
          sorted[i];

        if (!tx.timestamp) {
          continue;
        }

        const date =
          new Date(
            tx.timestamp
          );

        const hour =
          date.getUTCHours();

        // =========================
        // HOUR DISTRIBUTION
        // =========================

        hourMap[hour] =
          (hourMap[hour] ||
            0) + 1;

        // =========================
        // NIGHT ACTIVITY
        // =========================

        if (
          hour >= 0 &&
          hour <= 5
        ) {
          nightActivity++;

          riskScore += 3;
        }

        // =========================
        // RAPID BURSTS
        // =========================

        const nextTx =
          sorted[i + 1];

        if (
          nextTx?.timestamp
        ) {
          const current =
            new Date(
              tx.timestamp
            ).getTime();

          const next =
            new Date(
              nextTx.timestamp
            ).getTime();

          const diffMinutes =
            Math.abs(
              next -
                current
            ) /
            1000 /
            60;

          if (
            diffMinutes <= 10
          ) {
            rapidBursts++;

            riskScore += 10;
          }
        }
      }

      // =========================
      // MOST ACTIVE HOUR
      // =========================

      let mostActiveHourUTC =
        null;

      let highestCount = 0;

      Object.entries(
        hourMap
      ).forEach(
        ([hour, count]) => {
          if (
            count >
            highestCount
          ) {
            highestCount =
              count;

            mostActiveHourUTC =
              Number(hour);
          }
        }
      );

      // =========================
      // FINDINGS
      // =========================

      if (
        rapidBursts >= 2
      ) {
        findings.push(
          "Rapid burst transaction behavior detected"
        );
      }

      if (
        nightActivity >= 3
      ) {
        findings.push(
          "High late-night operational activity detected"
        );
      }

      // =========================
      // PATTERN
      // =========================

      let activityPattern =
        "Normal";

      if (
        rapidBursts >= 2 &&
        nightActivity >= 2
      ) {
        activityPattern =
          "Coordinated Settlement Window";
      }

      // =========================
      // RISK
      // =========================

      let riskLevel =
        "LOW";

      if (riskScore >= 30) {
        riskLevel =
          "MEDIUM";
      }

      if (riskScore >= 60) {
        riskLevel =
          "HIGH";
      }

      // =========================
      // FINAL
      // =========================

      return {
        mostActiveHourUTC,

        rapidBursts,

        nightActivity,

        activityPattern,

        riskScore,

        riskLevel,

        findings,
      };
    } catch (error) {
      console.log(
        "Temporal Intelligence Error:",
        error.message
      );

      return null;
    }
  };

module.exports = {
  analyzeTemporalPatterns,
};