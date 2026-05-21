const {
  analyzeTransactionHash,
} = require(
  "../services/transactionSearchService"
);

exports.transactionSearch =
  async (
    req,
    res
  ) => {
    try {
      const { hash } =
        req.params;

      const result =
        await analyzeTransactionHash(
          hash
        );

      return res.json({
        success: true,

        timestamp:
          new Date().toISOString(),

        data: result,
      });
    } catch (error) {
      console.log(
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Internal Server Error",
        });
    }
  };