const generateWalletIntelligence =
  (walletData) => {
    try {
      const findings = [];

      let riskScore = 0;

      // ========================
      // SAFE FALLBACKS
      // ========================

      const tokens =
        walletData.tokens || [];

      const txCount =
        walletData.txCount || 0;

      // ========================
      // TOKEN ANALYSIS
      // ========================

      const suspiciousTokens =
        tokens.filter(
          (token) =>
            token.suspicious
        );

      const fakeStablecoins =
        tokens.filter(
          (token) =>
            token.fakeStablecoin
        );

      // ========================
      // RISK SCORING
      // ========================

      riskScore +=
        suspiciousTokens.length *
        10;

      riskScore +=
        fakeStablecoins.length *
        25;

      // ========================
      // FINDINGS
      // ========================

      if (
        suspiciousTokens.length >
        0
      ) {
        findings.push(
          `${suspiciousTokens.length} suspicious tokens detected`
        );
      }

      if (
        fakeStablecoins.length >
        0
      ) {
        findings.push(
          `${fakeStablecoins.length} fake stablecoins detected`
        );
      }

      // ========================
      // WALLET CATEGORY
      // ========================

      let walletCategory =
        "Normal Wallet";

      if (
        walletData.balanceETH >
          100 ||
        walletData.balanceBNB >
          100 ||
        walletData.balanceBTC >
          10 ||
        walletData.balanceTON >
          100
      ) {
        walletCategory =
          "Whale Wallet";

        findings.push(
          "Large balance wallet detected"
        );
      }

      // ========================
      // ACTIVITY LEVEL
      // ========================

      let activityLevel =
        "Low";

      if (txCount > 100) {
        activityLevel =
          "Medium";
      }

      if (txCount > 1000) {
        activityLevel =
          "High";
      }

      // ========================
      // HIGH TX COUNT
      // ========================

      if (txCount > 5000) {
        riskScore += 15;

        findings.push(
          "Extremely active wallet"
        );
      }

      // ========================
      // TOKEN SPAM DETECTION
      // ========================

      if (tokens.length > 50) {
        riskScore += 10;

        findings.push(
          "Large token spread detected"
        );
      }

      // ========================
      // FINAL RISK LEVEL
      // ========================

      let riskLevel = "LOW";

      if (riskScore >= 30) {
        riskLevel = "MEDIUM";
      }

      if (riskScore >= 60) {
        riskLevel = "HIGH";
      }

      // ========================
      // FINAL OUTPUT
      // ========================

      return {
        riskScore,

        riskLevel,

        walletCategory,

        activityLevel,

        suspiciousTokenCount:
          suspiciousTokens.length,

        fakeStablecoinCount:
          fakeStablecoins.length,

        findings,
      };
    } catch (error) {
      console.log(
        "Intelligence Service Error:",
        error.message
      );

      return {
        riskScore: 0,

        riskLevel: "LOW",

        walletCategory:
          "Unknown",

        activityLevel:
          "Low",

        suspiciousTokenCount: 0,

        fakeStablecoinCount: 0,

        findings: [],
      };
    }
  };

module.exports = {
  generateWalletIntelligence,
};