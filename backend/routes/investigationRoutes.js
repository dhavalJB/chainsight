const express = require("express");

const router =
  express.Router();

const {
  getInvestigation,
  getLatestInvestigation,
} = require(
  "../services/investigationStorage"
);

/* ========================================= */
/* GET LATEST INVESTIGATION */
/* ========================================= */

router.get(
  "/latest",
  (req, res) => {
    try {
      const result =
        getLatestInvestigation();

      if (
        !result.success
      ) {
        return res
          .status(404)
          .json({
            success: false,

            error:
              result.error,
          });
      }

      return res.json({
        success: true,

        timestamp:
          new Date().toISOString(),

        investigation:
          result.investigation,
      });
    } catch (error) {
      console.error(
        "Get Latest Investigation Error:"
      );

      console.error(error);

      return res
        .status(500)
        .json({
          success: false,

          error:
            "Failed to fetch latest investigation",
        });
    }
  }
);

/* ========================================= */
/* GET INVESTIGATION BY ID */
/* ========================================= */

router.get(
  "/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const result =
        getInvestigation(
          id
        );

      if (
        !result.success
      ) {
        return res
          .status(404)
          .json({
            success: false,

            error:
              result.error,
          });
      }

      return res.json({
        success: true,

        timestamp:
          new Date().toISOString(),

        investigation:
          result.investigation,
      });
    } catch (error) {
      console.error(
        "Get Investigation Route Error:"
      );

      console.error(error);

      return res
        .status(500)
        .json({
          success: false,

          error:
            "Failed to fetch investigation",
        });
    }
  }
);

/* ========================================= */

module.exports = router;