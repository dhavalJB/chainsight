const {
  analyzeBehavior,
} = require(
  "./behaviorService"
);

const {
  correlateExchangeFlow,
} = require(
  "./exchangeCorrelationService"
);

const {
  generateChainOfCustody,
} = require(
  "./custodyService"
);

const {
  classifyTransaction,
} = require(
  "./transactionClassifierService"
);

const {
  analyzeProtocolFlows,
} = require(
  "./protocolFlowService"
);

const {
  analyzeRelationships,
} = require(
  "./relationshipIntelligenceService"
);

const {
  analyzeTemporalPatterns,
} = require(
  "./temporalIntelligenceService"
);

const {
  analyzeAMLPatterns,
} = require(
  "./antiMoneyLaunderingService"
);

const analyzeTransactions =
  async ({
    wallet,

    transactions,

    traceFunction,
  }) => {
    try {
      // ========================
      // NORMALIZE
      // ========================

      const normalized =
        transactions.map(
          (tx) => {
            const direction =
              tx.direction ||
              (tx.to &&
              tx.to.toLowerCase() ===
                wallet.toLowerCase()
                ? "IN"
                : "OUT");

            const stablecoin =
              tx.stablecoin ===
                true ||
              (tx.asset &&
                [
                  "USDT",
                  "USDC",
                  "DAI",
                  "BUSD",
                  "FDUSD",
                  "TUSD",
                ].includes(
                  tx.asset.toUpperCase()
                ));

            // ========================
            // CLASSIFICATION
            // ========================

            const classification =
              classifyTransaction(
                {
                  tx,

                  chain:
                    tx.chain,
                }
              );

            return {
              hash: tx.hash,

              chain: tx.chain,

              from: tx.from,

              to: tx.to,

              asset: tx.asset,

              value: tx.value,

              category:
                tx.category,

              blockNum:
                tx.blockNum,

              timestamp:
                tx.timestamp,

              direction,

              stablecoin,

              classification,
            };
          }
        );

      // ========================
      // STABLECOIN TXS
      // ========================

      const stablecoinTransactions =
        normalized.filter(
          (tx) =>
            tx.stablecoin ===
            true
        );

      // ========================
      // BEHAVIOR
      // ========================

      const behavior =
        analyzeBehavior(
          stablecoinTransactions
        );

      // ========================
      // EXCHANGE FLOW
      // ========================

      const exchangeCorrelation =
        await correlateExchangeFlow(
          {
            transactions:
              stablecoinTransactions,
          }
        );

      // ========================
      // PROTOCOL FLOWS
      // ========================

      const protocolFlows =
        analyzeProtocolFlows(
          {
            transactions:
              normalized,
          }
        );

      // ========================
      // TEMPORAL INTELLIGENCE
      // ========================

      const temporalIntelligence =
        analyzeTemporalPatterns(
          {
            transactions:
              normalized,
          }
        );

      // ========================
      // RELATIONSHIP INTELLIGENCE
      // ========================

      const relationshipIntelligence =
        analyzeRelationships(
          {
            transactions:
              stablecoinTransactions,

            behavior,

            custody:
              null,

            temporalIntelligence,
          }
        );

      // ========================
      // CUSTODY
      // ========================

      const custody =
        await generateChainOfCustody(
          {
            wallet,

            chain:
              stablecoinTransactions[0]
                ?.chain ||
              "Unknown",

            transactions:
              stablecoinTransactions,

            traceFunction,

            depth: 1,

            maxPerLevel: 3,
          }
        );

      // ========================
      // AML ANALYSIS
      // ========================

      const finalAMLAnalysis =
        analyzeAMLPatterns(
          {
            wallet,

            transactions:
              stablecoinTransactions,

            custody,

            relationshipIntelligence,

            protocolFlows,
          }
        );

      // ========================
      // ENRICH RELATIONSHIPS
      // ========================

      if (
        relationshipIntelligence
      ) {
        relationshipIntelligence.custodyPaths =
          custody?.paths
            ?.length || 0;

        relationshipIntelligence.nodes =
          custody?.nodes
            ?.length || 0;

        if (
          custody?.paths
            ?.length >= 3
        ) {
          relationshipIntelligence.confidence +=
            15;

          relationshipIntelligence.signals.push(
            "Complex custody graph detected"
          );
        }

        // ========================
        // FINAL RISK UPDATE
        // ========================

        if (
          relationshipIntelligence.confidence >=
          80
        ) {
          relationshipIntelligence.relationshipRisk =
            "HIGH";
        }

        else if (
          relationshipIntelligence.confidence >=
          45
        ) {
          relationshipIntelligence.relationshipRisk =
            "MEDIUM";
        }

        else {
          relationshipIntelligence.relationshipRisk =
            "LOW";
        }
      }

      // ========================
      // SUMMARY
      // ========================

      const summary = {
        totalTransactions:
          normalized.length,

        stablecoinTransactions:
          stablecoinTransactions.length,

        incomingTransactions:
          stablecoinTransactions.filter(
            (tx) =>
              tx.direction ===
              "IN"
          ).length,

        outgoingTransactions:
          stablecoinTransactions.filter(
            (tx) =>
              tx.direction ===
              "OUT"
          ).length,
      };

      // ========================
      // FINAL
      // ========================

      return {
        summary,

        behavior,

        exchangeCorrelation,

        protocolFlows,

        temporalIntelligence,

        relationshipIntelligence,

        custody,

        amlAnalysis:
          finalAMLAnalysis,
      };
    } catch (error) {
      console.log(
        "Transaction Analysis Error:",
        error.message
      );

      return null;
    }
  };

module.exports = {
  analyzeTransactions,
};