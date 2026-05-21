const walletService =
  require(
    "../services/walletService"
  );

const {
  isValidWallet,
} = require(
  "../utils/walletUtils"
);

const {
  saveInvestigation,
} = require(
  "../services/investigationStorage"
);

/* ========================================= */
/* WALLET SEARCH + FULL INVESTIGATION */
/* ========================================= */

exports.walletSearch =
  async (req, res) => {
    try {
      const {
        address,
      } = req.params;

      /* ========================================= */
      /* VALIDATION */
      /* ========================================= */

      if (!address) {
        return res.status(400).json(
          {
            success: false,

            message:
              "Wallet address required",
          }
        );
      }

      /* ========================================= */
      /* WALLET FORMAT CHECK */
      /* ========================================= */

      if (
        !isValidWallet(
          address
        )
      ) {
        return res.status(400).json(
          {
            success: false,

            message:
              "Invalid or unsupported wallet format",
          }
        );
      }

      /* ========================================= */
      /* START TIMER */
      /* ========================================= */

      const startedAt =
        Date.now();

      console.log(
        `🔍 Starting Investigation: ${address}`
      );

      /* ========================================= */
      /* DETECT + ANALYZE */
      /* ========================================= */

      let result =
        null;

      try {
        result =
          await walletService.detectWallet(
            address
          );
      } catch (
        analysisError
      ) {
        console.error(
          "Wallet Analysis Error:"
        );

        console.error(
          analysisError
        );

        return res.status(500).json(
          {
            success: false,

            message:
              "Wallet analysis pipeline failed",

            error:
              analysisError.message,
          }
        );
      }

      /* ========================================= */
      /* FAILED ANALYSIS */
      /* ========================================= */

      if (!result) {
        return res.status(500).json(
          {
            success: false,

            message:
              "Wallet analysis failed",
          }
        );
      }

      /* ========================================= */
      /* STORE INVESTIGATION */
      /* ========================================= */

      const saved =
        saveInvestigation(
          address,
          result
        );

      /* ========================================= */
      /* STORAGE FAILED */
      /* ========================================= */

      if (
        !saved.success
      ) {
        return res.status(500).json(
          {
            success: false,

            message:
              "Failed to store investigation",
          }
        );
      }

      /* ========================================= */
      /* INVESTIGATION SUMMARY */
      /* ========================================= */

      const completedIn =
        Date.now() -
        startedAt;

      const txSummary =
        result
          ?.transactionAnalysis
          ?.summary || {};

      const riskAnalysis =
        result
          ?.riskAnalysis || {};

      const custody =
        result
          ?.custody || {};

      /* ========================================= */
      /* SUCCESS */
      /* ========================================= */

      console.log(
        `✅ Investigation Completed: ${saved.id}`
      );

      return res.json({
        success: true,

        cached: false,

        timestamp:
          new Date().toISOString(),

        /* ========================================= */
        /* INVESTIGATION */
        /* ========================================= */

        investigation: {
          id: saved.id,

          wallet:
            address,

          createdAt:
            saved.createdAt,

          expiresAt:
            saved.expiresAt,

          processingTimeMs:
            completedIn,
        },

        /* ========================================= */
        /* QUICK OVERVIEW */
        /* ========================================= */

        overview: {
          chain:
            result
              ?.walletOverview
              ?.chain ||
            null,

          active:
            result
              ?.walletOverview
              ?.active ||
            false,

          txCount:
            result
              ?.walletOverview
              ?.txCount ||
            0,

          tokenCount:
            result
              ?.walletOverview
              ?.tokenCount ||
            0,
        },

        /* ========================================= */
        /* RISK */
        /* ========================================= */

        risk: {
          riskScore:
            riskAnalysis
              ?.riskScore ||
            0,

          riskLevel:
            riskAnalysis
              ?.riskLevel ||
            "UNKNOWN",

          launderingProbability:
            riskAnalysis
              ?.launderingProbability ||
            0,
        },

        /* ========================================= */
        /* TRANSACTION SUMMARY */
        /* ========================================= */

        transactions: {
          total:
            txSummary
              ?.totalTransactions ||
            0,

          incoming:
            txSummary
              ?.incomingTransactions ||
            0,

          outgoing:
            txSummary
              ?.outgoingTransactions ||
            0,

          stablecoin:
            txSummary
              ?.stablecoinTransactions ||
            0,
        },

        /* ========================================= */
        /* NETWORK */
        /* ========================================= */

        network: {
          custodyNodes:
            custody
              ?.nodes
              ?.length ||
            0,

          custodyEdges:
            custody
              ?.edges
              ?.length ||
            0,

          custodyPaths:
            custody
              ?.paths
              ?.length ||
            0,
        },
      });
    } catch (error) {
      console.error(
        "Wallet Controller Fatal Error:"
      );

      console.error(
        error
      );

      return res.status(500).json(
        {
          success: false,

          message:
            "Internal Server Error",

          error:
            error.message,
        }
      );
    }
  };