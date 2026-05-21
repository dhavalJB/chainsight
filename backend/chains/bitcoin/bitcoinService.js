const axios = require("axios");

const bitcoinConfig = require("./bitcoinConfig");

exports.getBitcoinWallet = async (address) => {
  try {
    const response = await axios.get(
      `${bitcoinConfig.BASE_URL}/rawaddr/${address}`
    );

    const data = response.data;

    return {
      exists: true,

      wallet: address,

      chain: "Bitcoin",

      balanceBTC:
        data.final_balance / 100000000,

      totalReceivedBTC:
        data.total_received / 100000000,

      totalSentBTC:
        data.total_sent / 100000000,

      txCount:
        data.n_tx,

      active:
        data.n_tx > 0,
    };
  } catch (error) {
    console.error(
      "Bitcoin Service Error:",
      error.response?.data || error.message
    );

    return {
      exists: false,
      error: "Failed to fetch Bitcoin wallet",
    };
  }
};