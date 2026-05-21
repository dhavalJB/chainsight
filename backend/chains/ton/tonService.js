const axios = require(
  "axios"
);

const {
  normalizeTransaction,
} = require(
  "../../utils/transactionNormalizer"
);

const {
  analyzeTokenRisk,
} = require(
  "../../services/tokenRiskService"
);

const {
  isStablecoin,
  isFakeStablecoin,
} = require(
  "../../utils/tokenUtils"
);

// =====================================
// TON API
// =====================================

const tonApi = axios.create(
  {
    baseURL:
      "https://tonapi.io/v2",
  }
);

// =====================================
// ACCOUNT INFO
// =====================================

const fetchAccountInfo =
  async (address) => {
    try {
      const response =
        await tonApi.get(
          `/accounts/${address}`
        );

      return response.data;
    } catch (error) {
      console.log(
        "TON Account Error:",
        error.message
      );

      return null;
    }
  };

// =====================================
// JETTON BALANCES
// =====================================

const fetchJettons =
  async (address) => {
    try {
      const response =
        await tonApi.get(
          `/accounts/${address}/jettons`
        );

      const balances =
        response.data
          ?.balances || [];

      return balances.map(
        (item) => {
          const jetton =
            item.jetton ||
            {};

          const balance =
            Number(
              item.balance ||
                0
            ) /
            10 **
              (jetton.decimals ||
                6);

          const fakeStablecoin =
            isFakeStablecoin(
              {
                chain:
                  "TON",

                contract:
                  jetton.address,

                symbol:
                  jetton.symbol,
              }
            );

          return {
            contract:
              jetton.address,

            name:
              jetton.name,

            symbol:
              jetton.symbol,

            balance,

            decimals:
              jetton.decimals,

            logo:
              jetton.image,

            verification:
              jetton.verification,

            stablecoin:
              isStablecoin(
                jetton.symbol
              ),

            fakeStablecoin,

            ...analyzeTokenRisk(
              {
                name:
                  jetton.name,

                symbol:
                  jetton.symbol,

                balance,

                fakeStablecoin,
              }
            ),
          };
        }
      );
    } catch (error) {
      console.log(
        "TON Jetton Error:",
        error.message
      );

      return [];
    }
  };

// =====================================
// JETTON HISTORY
// =====================================

const fetchJettonHistory =
  async (address) => {
    try {
      const response =
        await tonApi.get(
          `/accounts/${address}/jettons/history`,
          {
            params: {
              limit: 50,
            },
          }
        );

      const operations =
        response.data
          ?.operations || [];

      return operations.map(
        (tx) => {
          const amount =
            Number(
              tx.amount || 0
            ) /
            10 **
              (tx.jetton
                ?.decimals ||
                6);

          const source =
            tx.source || {};

          const destination =
            tx.destination ||
            {};

          const symbol =
            tx.jetton
              ?.symbol ||
            "JETTON";

          return normalizeTransaction(
            {
              chain: "TON",

              hash:
                tx.transaction_hash,

              from:
                source.address,

              to:
                destination.address,

              asset:
                symbol,

              value:
                amount,

              category:
                "jetton",

              timestamp:
                tx.utime
                  ? new Date(
                      tx.utime *
                        1000
                    ).toISOString()
                  : null,

              direction:
                destination.address?.toLowerCase() ===
                address.toLowerCase()
                  ? "IN"
                  : "OUT",

              stablecoin:
                isStablecoin(
                  symbol
                ),

              metadata: {
                verification:
                  tx.jetton
                    ?.verification,

                sourceName:
                  source.name ||
                  null,

                destinationName:
                  destination.name ||
                  null,

                sourceScam:
                  source.is_scam,

                destinationScam:
                  destination.is_scam,

                sourceWallet:
                  source.is_wallet,

                destinationWallet:
                  destination.is_wallet,

                payload:
                  tx.payload,

                traceId:
                  tx.trace_id,
              },
            }
          );
        }
      );
    } catch (error) {
      console.log(
        "TON History Error:",
        error.message
      );

      return [];
    }
  };

// =====================================
// TON TRANSFERS
// =====================================

const fetchTonTransfers =
  async (address) => {
    try {
      const response =
        await tonApi.get(
          `/accounts/${address}/events`,
          {
            params: {
              limit: 30,
            },
          }
        );

      const events =
        response.data
          ?.events || [];

      const transfers =
        [];

      for (const event of events) {
        const actions =
          event.actions || [];

        for (const action of actions) {
          if (
            action.type !==
            "TonTransfer"
          ) {
            continue;
          }

          const transfer =
            action
              .TonTransfer;

          if (!transfer) {
            continue;
          }

          transfers.push(
            normalizeTransaction(
              {
                chain:
                  "TON",

                hash:
                  event.event_id,

                from:
                  transfer
                    ?.sender
                    ?.address,

                to:
                  transfer
                    ?.recipient
                    ?.address,

                asset:
                  "TON",

                value:
                  Number(
                    transfer
                      ?.amount ||
                      0
                  ) / 1e9,

                category:
                  "native",

                timestamp:
                  event.timestamp
                    ? new Date(
                        event.timestamp *
                          1000
                      ).toISOString()
                    : null,

                direction:
                  transfer
                    ?.recipient
                    ?.address
                    ?.toLowerCase() ===
                  address.toLowerCase()
                    ? "IN"
                    : "OUT",

                stablecoin: false,

                metadata: {
                  senderName:
                    transfer
                      ?.sender
                      ?.name,

                  recipientName:
                    transfer
                      ?.recipient
                      ?.name,
                },
              }
            )
          );
        }
      }

      return transfers;
    } catch (error) {
      console.log(
        "TON Transfer Error:",
        error.message
      );

      return [];
    }
  };

// =====================================
// MAIN WALLET FETCHER
// =====================================

const getTonWallet =
  async (
    address,

    options = {}
  ) => {
    try {
      // =========================
      // ACCOUNT
      // =========================

      const account =
        await fetchAccountInfo(
          address
        );

      if (!account) {
        return {
          exists: false,

          wallet:
            address,

          chain: "TON",
        };
      }

      // =========================
      // TOKENS
      // =========================

      const tokens =
        await fetchJettons(
          address
        );

      // =========================
      // TXS
      // =========================

      const jettonHistory =
        await fetchJettonHistory(
          address
        );

      const tonTransfers =
        await fetchTonTransfers(
          address
        );

      const recentTransactions =
        [
          ...jettonHistory,

          ...tonTransfers,
        ].sort((a, b) => {
          const timeA =
            new Date(
              a.timestamp || 0
            ).getTime();

          const timeB =
            new Date(
              b.timestamp || 0
            ).getTime();

          return timeB - timeA;
        });

      // =========================
      // LITE
      // =========================

      if (
        options.lite ===
        true
      ) {
        return {
          exists: true,

          wallet:
            address,

          chain: "TON",

          txCount:
            recentTransactions.length,

          tokenCount:
            tokens.length,

          active:
            account.status ===
            "active",

          recentTransactions,
        };
      }

      // =========================
      // FINAL
      // =========================

      return {
        exists: true,

        wallet:
          address,

        chain: "TON",

        balanceTON:
          Number(
            account.balance ||
              0
          ) / 1e9,

        state:
          account.status,

        active:
          account.status ===
          "active",

        txCount:
          recentTransactions.length,

        tokenCount:
          tokens.length,

        tokens,

        recentTransactions,

        metadata: {
          interfaces:
            account.interfaces,

          isWallet:
            account.is_wallet,

          lastActivity:
            account.last_activity,
        },
      };
    } catch (error) {
      console.error(
        "TON Service Error:"
      );

      if (
        error.response
      ) {
        console.log(
          error.response.data
        );
      } else {
        console.log(
          error.message
        );
      }

      return {
        exists: false,

        wallet:
          address,

        chain: "TON",

        error:
          "Failed to fetch TON wallet",
      };
    }
  };

// =====================================
// LITE
// =====================================

const getTonWalletLite =
  async (address) => {
    try {
      return await getTonWallet(
        address,
        {
          lite: true,
        }
      );
    } catch (error) {
      console.log(
        error.message
      );

      return null;
    }
  };

module.exports = {
  getTonWallet,

  getTonWalletLite,
};