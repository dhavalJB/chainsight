const knownExchanges = [
  "0x8894e0a0c962cb723c1976a4421c95949be2d4e3",
];

const profileWallet = async ({
  walletData,
}) => {
  try {
    if (!walletData) {
      return null;
    }

    const txCount =
      walletData.txCount || 0;

    const transactions =
      walletData
        .recentTransactions || [];

    let stablecoinIn = 0;

    let stablecoinOut = 0;

    let incoming = 0;

    let outgoing = 0;

    let rapidSettlements = 0;

    let exchangeInteractions = 0;

    const counterparties =
      new Set();

    const findings = [];

    const incomingTxs = [];

    const outgoingTxs = [];

    // ========================
    // ANALYZE TRANSACTIONS
    // ========================

    for (const tx of transactions) {
      const direction =
        tx.direction ||
        "UNKNOWN";

      const value =
        Number(tx.value || 0);

      const asset =
        tx.asset || "";

      const timestamp =
        tx.timestamp || null;

      const isStablecoin =
        tx.stablecoin ===
          true ||
        [
          "USDT",
          "USDC",
          "DAI",
          "BUSD",
        ].includes(
          asset.toUpperCase()
        );

      const counterparty =
        direction === "IN"
          ? tx.from
          : tx.to;

      // ========================
      // COUNTERPARTIES
      // ========================

      if (counterparty) {
        counterparties.add(
          counterparty.toLowerCase()
        );
      }

      // ========================
      // INCOMING
      // ========================

      if (direction === "IN") {
        incoming++;

        if (isStablecoin) {
          stablecoinIn += value;

          incomingTxs.push({
            value,
            timestamp,
          });
        }
      }

      // ========================
      // OUTGOING
      // ========================

      if (direction === "OUT") {
        outgoing++;

        if (isStablecoin) {
          stablecoinOut += value;

          outgoingTxs.push({
            value,
            timestamp,
          });
        }
      }

      // ========================
      // EXCHANGE INTERACTION
      // ========================

      if (
        counterparty &&
        knownExchanges.includes(
          counterparty.toLowerCase()
        )
      ) {
        exchangeInteractions++;
      }
    }

    // ========================
    // RAPID SETTLEMENT
    // ========================

    for (const inTx of incomingTxs) {
      for (const outTx of outgoingTxs) {
        const diff =
          Math.abs(
            inTx.value -
              outTx.value
          );

        if (diff < 2) {
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
              rapidSettlements++;
            }
          }
        }
      }
    }

    // ========================
    // PROBABILITIES
    // ========================

    let exchangeProbability = 0;

    let merchantProbability = 0;

    let customerProbability = 0;

    let routingProbability = 0;

    // ========================
    // EXCHANGE DETECTION
    // ========================

    if (txCount > 100000) {
      exchangeProbability += 70;

      findings.push(
        "Extremely high transaction count"
      );
    }

    if (
      counterparties.size > 50
    ) {
      exchangeProbability += 20;

      findings.push(
        "Large counterparty network"
      );
    }

    if (
      exchangeInteractions >= 2
    ) {
      exchangeProbability += 20;

      findings.push(
        "Repeated exchange interaction detected"
      );
    }

    // ========================
    // MERCHANT DETECTION
    // ========================

    if (
      stablecoinIn > 0 &&
      stablecoinOut > 0
    ) {
      merchantProbability += 35;

      findings.push(
        "Active stablecoin flow detected"
      );
    }

    const flowDiff =
      Math.abs(
        stablecoinIn -
          stablecoinOut
      );

    if (
      stablecoinIn > 50 &&
      flowDiff <
        stablecoinIn * 0.2
    ) {
      merchantProbability += 30;

      findings.push(
        "Balanced inflow/outflow pattern"
      );
    }

    if (
      rapidSettlements >= 1
    ) {
      merchantProbability += 25;

      findings.push(
        "Rapid settlement behavior detected"
      );
    }

    if (
      incoming > 5 &&
      outgoing > 5
    ) {
      merchantProbability += 15;

      findings.push(
        "High wallet activity"
      );
    }

    // ========================
    // ROUTING DETECTION
    // ========================

    if (
      stablecoinIn > 0 &&
      stablecoinOut > 0
    ) {
      routingProbability += 30;
    }

    if (
      rapidSettlements >= 1
    ) {
      routingProbability += 40;

      findings.push(
        "Possible routing wallet behavior"
      );
    }

    // ========================
    // CUSTOMER DETECTION
    // ========================

    if (
      txCount < 50 &&
      incoming <= 5 &&
      outgoing <= 5
    ) {
      customerProbability += 70;

      findings.push(
        "Low activity wallet"
      );
    }

    // ========================
    // DETERMINE TYPE
    // ========================

    let walletType =
      "Unknown";

    const highest =
      Math.max(
        exchangeProbability,
        merchantProbability,
        customerProbability,
        routingProbability
      );

    if (
      highest ===
      exchangeProbability
    ) {
      walletType =
        "Exchange";
    }

    else if (
      highest ===
      merchantProbability
    ) {
      walletType =
        "Merchant";
    }

    else if (
      highest ===
      routingProbability
    ) {
      walletType =
        "Routing Wallet";
    }

    else if (
      highest ===
      customerProbability
    ) {
      walletType =
        "Customer";
    }

    // ========================
    // ACTIVITY LEVEL
    // ========================

    let activityLevel =
      "LOW";

    if (txCount > 100) {
      activityLevel =
        "MEDIUM";
    }

    if (txCount > 1000) {
      activityLevel =
        "HIGH";
    }

    // ========================
    // FINAL OUTPUT
    // ========================

    return {
      walletType,

      activityLevel,

      probabilities: {
        exchange:
          exchangeProbability,

        merchant:
          merchantProbability,

        customer:
          customerProbability,

        routing:
          routingProbability,
      },

      statistics: {
        txCount,

        stablecoinIn,

        stablecoinOut,

        incoming,

        outgoing,

        rapidSettlements,

        exchangeInteractions,

        counterparties:
          counterparties.size,
      },

      findings,
    };
  } catch (error) {
    console.log(
      "Wallet Profiler Error:",
      error.message
    );

    return null;
  }
};

module.exports = {
  profileWallet,
};