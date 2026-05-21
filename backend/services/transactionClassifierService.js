const {
  getWalletLabel,
} = require(
  "./labelService"
);

const classifyTransaction =
  ({
    tx,

    chain,
  }) => {
    try {
      let type =
        "TRANSFER";

      let protocol =
        null;

      let confidence =
        "LOW";

      let findings = [];

      // ========================
      // LABEL LOOKUP
      // ========================

      const receiverLabel =
        getWalletLabel(
          tx.to,
          chain
        );

      // ========================
      // EXCHANGE
      // ========================

      if (
        receiverLabel
          ?.type ===
        "Exchange"
      ) {
        type =
          "EXCHANGE_DEPOSIT";

        protocol =
          receiverLabel.exchange;

        confidence =
          "HIGH";

        findings.push(
          "Funds sent to centralized exchange"
        );
      }

      // ========================
      // DEX
      // ========================

      else if (
        receiverLabel
          ?.type ===
        "DEX"
      ) {
        type =
          "DEX_SWAP";

        protocol =
          receiverLabel.protocol;

        confidence =
          "HIGH";

        findings.push(
          "DEX interaction detected"
        );
      }

      // ========================
      // AGGREGATOR
      // ========================

      else if (
        receiverLabel
          ?.type ===
        "DEX Aggregator"
      ) {
        type =
          "AGGREGATOR_ROUTE";

        protocol =
          receiverLabel.protocol;

        confidence =
          "HIGH";

        findings.push(
          "DEX aggregator interaction detected"
        );
      }

      // ========================
      // BRIDGE
      // ========================

      else if (
        receiverLabel
          ?.type ===
        "Bridge"
      ) {
        type =
          "BRIDGE_TRANSFER";

        protocol =
          receiverLabel.protocol;

        confidence =
          "HIGH";

        findings.push(
          "Cross-chain bridge interaction detected"
        );
      }

      // ========================
      // FINAL
      // ========================

      return {
        type,

        protocol,

        confidence,

        findings,
      };
    } catch (error) {
      console.log(
        "Transaction Classifier Error:",
        error.message
      );

      return {
        type:
          "TRANSFER",
      };
    }
  };

module.exports = {
  classifyTransaction,
};