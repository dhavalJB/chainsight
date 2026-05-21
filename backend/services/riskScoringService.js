const generateRiskScore =
  ({
    behavior,

    exchangeCorrelation,

    custody,

    intelligence,

    protocolFlows = null,

    temporalIntelligence = null,

    relationshipIntelligence = null,
  }) => {
    try {
      // =========================
      // MAIN SCORES
      // =========================

      let operationalRisk = 0;

      let launderingRisk = 0;

      let protocolRisk = 0;

      let temporalRisk = 0;

      let tokenRisk = 0;

      // =========================
      // SUPPORTING SCORES
      // =========================

      let merchantConfidence = 0;

      let exchangeExposure = 0;

      // =========================
      // FINDINGS
      // =========================

      const findings = [];

      // =========================
      // BEHAVIOR ANALYSIS
      // =========================

      if (
        behavior
          ?.routingTransactions >
        0
      ) {
        operationalRisk += 10;

        findings.push(
          "Routing behavior detected"
        );
      }

      if (
        behavior
          ?.rapidSettlementCount >
        0
      ) {
        operationalRisk += 15;

        findings.push(
          "Rapid settlement behavior detected"
        );
      }

      // Merchant behavior
      if (
        behavior
          ?.merchantProbability >
        50
      ) {
        merchantConfidence += 40;

        operationalRisk += 10;

        findings.push(
          "Merchant-style settlement activity detected"
        );
      }

      // =========================
      // EXCHANGE EXPOSURE
      // =========================

      if (
        exchangeCorrelation
          ?.detected
      ) {
        exchangeExposure += 25;

        operationalRisk += 5;

        findings.push(
          "Exchange settlement activity detected"
        );
      }

      // =========================
      // GRAPH ANALYSIS
      // =========================

      const pathCount =
        custody?.paths
          ?.length || 0;

      const nodeCount =
        custody?.nodes
          ?.length || 0;

      // Complex graph
      if (pathCount >= 3) {
        launderingRisk += 10;

        findings.push(
          "Complex fund flow graph detected"
        );
      }

      // Large graph
      if (nodeCount >= 5) {
        operationalRisk += 10;

        findings.push(
          "Large transaction relationship network detected"
        );
      }

      // =========================
      // PROTOCOL RISK
      // =========================

      if (
        protocolFlows
          ?.bridgeTransferCount >
        0
      ) {
        protocolRisk += 25;

        launderingRisk += 15;

        findings.push(
          "Bridge transfer activity detected"
        );
      }

      if (
        protocolFlows
          ?.aggregatorRouteCount >
        0
      ) {
        protocolRisk += 15;

        findings.push(
          "DEX aggregator routing detected"
        );
      }

      if (
        protocolFlows
          ?.chainHops > 0
      ) {
        protocolRisk += 30;

        launderingRisk += 25;

        findings.push(
          "Cross-chain hopping behavior detected"
        );
      }

      // =========================
      // TEMPORAL RISK
      // =========================

      if (
        temporalIntelligence
          ?.rapidBursts >= 2
      ) {
        temporalRisk += 10;

        findings.push(
          "Coordinated rapid transaction bursts detected"
        );
      }

      if (
        temporalIntelligence
          ?.activityPattern ===
        "Coordinated Settlement Window"
      ) {
        temporalRisk += 15;

        launderingRisk += 10;

        findings.push(
          "Coordinated operational timing behavior detected"
        );
      }

      // =========================
      // RELATIONSHIP RISK
      // =========================

      if (
        relationshipIntelligence
          ?.confidence >= 65
      ) {
        launderingRisk += 10;

        findings.push(
          "Strong operational relationship indicators detected"
        );
      }

      // =========================
      // TOKEN RISK
      // =========================

      if (
        intelligence
          ?.suspiciousTokenCount >
        0
      ) {
        tokenRisk += 10;

        findings.push(
          "Suspicious token exposure detected"
        );
      }

      if (
        intelligence
          ?.fakeStablecoinCount >
        0
      ) {
        tokenRisk += 25;

        launderingRisk += 15;

        findings.push(
          "Fake stablecoin exposure detected"
        );
      }

      // =========================
// WEIGHTED FINAL SCORE
      // =========================

let riskScore =
  Math.round(
    (
      operationalRisk * 0.35 +
      launderingRisk * 1.0 +
      protocolRisk * 0.9 +
      temporalRisk * 0.5 +
      tokenRisk * 0.6
    )
  );

      // =========================
      // RISK LEVEL
      // =========================

      let riskLevel =
        "LOW";

      if (riskScore >= 35) {
        riskLevel =
          "MEDIUM";
      }

      if (riskScore >= 65) {
        riskLevel =
          "HIGH";
      }

      // =========================
      // LAUNDERING PROBABILITY
      // =========================

      let launderingProbability =
        Math.min(
          launderingRisk,
          95
        );

      // =========================
      // EVIDENCE BREAKDOWN
      // =========================

      const evidence = {
        operational:
          operationalRisk,

        laundering:
          launderingRisk,

        protocol:
          protocolRisk,

        temporal:
          temporalRisk,

        token:
          tokenRisk,
      };

      // =========================
      // SUMMARY
      // =========================

      let investigationSummary =
        "Low-risk operational wallet behavior detected.";

      // Strong laundering indicators
      if (
        launderingRisk >= 50
      ) {
        investigationSummary =
          "Wallet exhibits cross-chain obfuscation and transactional behaviors consistent with elevated laundering risk.";
      }

      // Moderate operational activity
      else if (
        operationalRisk >= 25
      ) {
        investigationSummary =
          "Wallet demonstrates active OTC or merchant-style settlement behavior with moderate operational risk indicators.";
      }

      // Merchant
      else if (
        merchantConfidence >=
        40
      ) {
        investigationSummary =
          "Wallet demonstrates repeated merchant-style stablecoin settlement activity.";
      }

      // =========================
      // FINAL
      // =========================

      return {
        riskScore,

        riskLevel,

        launderingProbability,

        merchantConfidence,

        exchangeExposure,

        evidence,

        findings,

        investigationSummary,
      };
    } catch (error) {
      console.log(
        "Risk Scoring Error:",
        error.message
      );

      return null;
    }
  };

module.exports = {
  generateRiskScore,
};