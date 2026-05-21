const express = require(
  "express"
);

const router =
  express.Router();

const walletController =
  require(
    "../controllers/walletController"
  );

// ========================
// UNIVERSAL WALLET SEARCH
// ========================

router.get(
  "/search/:address",
  walletController.walletSearch
);

// ========================
// FUTURE READY ROUTES
// ========================

// Wallet profiling
router.get(
  "/profile/:address",
  walletController.walletSearch
);

// Custody tracing
router.get(
  "/custody/:address",
  walletController.walletSearch
);

// Transaction intelligence
router.get(
  "/transactions/:address",
  walletController.walletSearch
);

// Behavioral analysis
router.get(
  "/behavior/:address",
  walletController.walletSearch
);

// Risk intelligence
router.get(
  "/risk/:address",
  walletController.walletSearch
);

// Exchange correlation
router.get(
  "/exchange/:address",
  walletController.walletSearch
);

// Investigation graph
router.get(
  "/graph/:address",
  walletController.walletSearch
);

// Multi-hop tracing
router.get(
  "/trace/:address",
  walletController.walletSearch
);

// Future tx hash analysis
router.get(
  "/tx/:hash",
  walletController.walletSearch
);

module.exports = router;