const analyzeBehavior = (
  transactions = []
) => {
  try {
    let p2pScore = 0;

    let totalStablecoinIn = 0;

    let totalStablecoinOut = 0;

    let gasRefills = 0;

    let routingTransactions = 0;

    let repeatedAmounts = 0;

    let rapidSettlementCount = 0;

    let dexInteractions = 0;

    let bridgeInteractions = 0;

    let exchangeDeposits = 0;

    let aggregatorRoutes = 0;

    const findings = [];

    const counterparties =
      new Set();

    const amountMap = {};

    const incoming = [];

    const outgoing = [];

    // ========================
    // ANALYZE TRANSACTIONS
    // ========================

    const analyzedTransactions =
      transactions.map((tx) => {
        const direction =
          tx.direction ||
          "UNKNOWN";

        const asset =
          tx.asset || "";

        const value =
          Number(tx.value) || 0;

        const timestamp =
          tx.timestamp || null;

        const counterparty =
          direction === "IN"
            ? tx.from
            : tx.to;

        if (counterparty) {
          counterparties.add(
            counterparty.toLowerCase()
          );
        }

        // ========================
        // CLASSIFICATION
        // ========================

        const classification =
          tx.classification ||
          {
            type:
              "TRANSFER",
          };

        const type =
          classification.type;

        // ========================
        // STABLECOIN
        // ========================

        const isStablecoin =
          tx.stablecoin ===
            true;

        // ========================
        // FLOW TRACKING
        // ========================

        if (
          direction === "IN" &&
          isStablecoin
        ) {
          totalStablecoinIn +=
            value;

          incoming.push({
            value,
            timestamp,
          });

          p2pScore += 5;
        }

        if (
          direction === "OUT" &&
          isStablecoin
        ) {
          totalStablecoinOut +=
            value;

          outgoing.push({
            value,
            timestamp,
          });

          p2pScore += 10;
        }

        // ========================
        // CLASSIFICATION ANALYSIS
        // ========================

        if (
          type ===
          "EXCHANGE_DEPOSIT"
        ) {
          exchangeDeposits++;

          p2pScore += 15;

          findings.push(
            "Funds sent to exchange"
          );
        }

        if (
          type ===
          "DEX_SWAP"
        ) {
          dexInteractions++;

          p2pScore += 10;

          findings.push(
            `DEX interaction detected (${classification.protocol})`
          );
        }

        if (
          type ===
          "BRIDGE_TRANSFER"
        ) {
          bridgeInteractions++;

          p2pScore += 20;

          findings.push(
            `Bridge usage detected (${classification.protocol})`
          );
        }

        if (
          type ===
          "AGGREGATOR_ROUTE"
        ) {
          aggregatorRoutes++;

          p2pScore += 15;

          findings.push(
            `DEX aggregator routing detected (${classification.protocol})`
          );
        }

        // ========================
        // GAS REFILL
        // ========================

        if (
          ["BNB", "ETH", "TON"].includes(
            asset.toUpperCase()
          ) &&
          value < 0.01 &&
          direction === "IN"
        ) {
          gasRefills++;

          p2pScore += 5;

          findings.push(
            "Gas refill detected"
          );
        }

        // ========================
        // REPEATED AMOUNTS
        // ========================

        const rounded =
          value.toFixed(2);

        amountMap[rounded] =
          (amountMap[rounded] ||
            0) + 1;

        return {
          ...tx,

          direction,

          counterparty,
        };
      });

    // ========================
    // ROUTING DETECTION
    // ========================

    for (const inTx of incoming) {
      for (const outTx of outgoing) {
        const diff =
          Math.abs(
            inTx.value -
              outTx.value
          );

        if (diff < 2) {
          routingTransactions++;

          p2pScore += 15;

          findings.push(
            "Possible routing behavior detected"
          );

          // ========================
          // RAPID SETTLEMENT
          // ========================

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

            if (minutes <= 30) {
              rapidSettlementCount++;

              p2pScore += 20;

              findings.push(
                `Rapid settlement detected (${minutes.toFixed(
                  1
                )} minutes)`
              );
            }
          }
        }
      }
    }

    // ========================
    // REPEATED TRANSFERS
    // ========================

    Object.values(
      amountMap
    ).forEach((count) => {
      if (count >= 2) {
        repeatedAmounts++;

        p2pScore += 10;
      }
    });

    // ========================
    // COUNTERPARTIES
    // ========================

    if (
      counterparties.size >= 10
    ) {
      p2pScore += 20;

      findings.push(
        "High counterparty count"
      );
    }

    // ========================
    // MERCHANT PROBABILITY
    // ========================

    let merchantProbability = 0;

    if (
      routingTransactions >= 1
    ) {
      merchantProbability += 30;
    }

    if (
      rapidSettlementCount >= 1
    ) {
      merchantProbability += 30;
    }

    if (
      exchangeDeposits >= 2
    ) {
      merchantProbability += 20;
    }

    if (
      dexInteractions >= 2
    ) {
      merchantProbability += 15;
    }

    if (
      bridgeInteractions >= 1
    ) {
      merchantProbability += 25;
    }

    // ========================
    // ACTIVITY LEVEL
    // ========================

    let activityLevel =
      "LOW";

    if (
      analyzedTransactions.length >
      20
    ) {
      activityLevel =
        "HIGH";
    }

    else if (
      analyzedTransactions.length >
      5
    ) {
      activityLevel =
        "MEDIUM";
    }

    // ========================
    // RISK LEVEL
    // ========================

    let riskLevel = "LOW";

    if (p2pScore >= 30) {
      riskLevel = "MEDIUM";
    }

    if (p2pScore >= 60) {
      riskLevel = "HIGH";
    }

    // ========================
    // FINAL OUTPUT
    // ========================

    return {
      p2pScore,

      riskLevel,

      activityLevel,

      merchantProbability,

      totalStablecoinIn,

      totalStablecoinOut,

      routingTransactions,

      rapidSettlementCount,

      repeatedAmounts,

      gasRefills,

      dexInteractions,

      bridgeInteractions,

      exchangeDeposits,

      aggregatorRoutes,

      uniqueCounterparties:
        counterparties.size,

      findings,

      analyzedTransactions,
    };
  } catch (error) {
    console.log(
      "Behavior Analysis Error:",
      error.message
    );

    return null;
  }
};

module.exports = {
  analyzeBehavior,
};