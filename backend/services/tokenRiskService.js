const suspiciousKeywords = [
  "airdrop",
  "claim",
  "reward",
  "bonus",
  "free",
  "visit",
  "gift",
  "winner",
  "profit",
  "100x",
  "tesla",
  "iphone",
  ".com",
  "http",
  "https",
];

const analyzeTokenRisk = (
  token
) => {
  try {
    let riskScore = 0;

    const riskFactors = [];

    const name =
      token.name?.toLowerCase() ||
      "";

    const symbol =
      token.symbol?.toLowerCase() ||
      "";

    // ========================
    // UNKNOWN METADATA
    // ========================

    if (
      token.name ===
        "Unknown" ||
      token.symbol ===
        "UNKNOWN"
    ) {
      riskScore += 25;

      riskFactors.push(
        "Unknown token metadata"
      );
    }

    // ========================
    // SUSPICIOUS KEYWORDS
    // ========================

    const keywordMatched =
      suspiciousKeywords.some(
        (keyword) =>
          name.includes(
            keyword
          ) ||
          symbol.includes(
            keyword
          )
      );

    if (keywordMatched) {
      riskScore += 20;

      riskFactors.push(
        "Suspicious naming pattern"
      );
    }

    // ========================
    // MASSIVE BALANCE
    // ========================

    if (
      token.balance >
      1_000_000
    ) {
      riskScore += 20;

      riskFactors.push(
        "Abnormally large token balance"
      );
    }

    // ========================
    // NUMERIC TOKEN NAME
    // ========================

    if (
      /^\d+$/.test(
        token.name
      )
    ) {
      riskScore += 15;

      riskFactors.push(
        "Numeric-only token name"
      );
    }

    // ========================
    // URL TOKEN SYMBOL
    // ========================

    if (
      symbol.includes(
        "http"
      ) ||
      symbol.includes(".com")
    ) {
      riskScore += 40;

      riskFactors.push(
        "Malicious URL token detected"
      );
    }

    // ========================
    // FAKE STABLECOIN
    // ========================

    if (
      token.fakeStablecoin
    ) {
      riskScore += 50;

      riskFactors.push(
        "Fake stablecoin detected"
      );
    }

    // ========================
    // FINAL
    // ========================

    return {
      suspicious:
        riskScore >= 30,

      riskScore,

      riskFactors,
    };
  } catch (error) {
    console.log(
      "Token Risk Error:",
      error.message
    );

    return {
      suspicious: false,

      riskScore: 0,

      riskFactors: [],
    };
  }
};

module.exports = {
  analyzeTokenRisk,
};