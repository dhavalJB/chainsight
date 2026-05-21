const express =
  require("express");

const router =
  express.Router();

const transactionController =
  require(
    "../controllers/transactionController"
  );

router.get(
  "/search/:hash",
  transactionController.transactionSearch
);

module.exports =
  router;