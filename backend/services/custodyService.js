const {
  profileWallet,
} = require(
  "./walletProfilerService"
);

// =========================
// EXCHANGE TYPES
// =========================

const EXCHANGE_TYPES = [
  "Exchange",
];

// =========================
// GRAPH NODE
// =========================

const createNode = ({
  wallet,

  chain,

  walletType =
    "Unknown",

  txCount = 0,

  active = false,
}) => {
  return {
    id:
      wallet.toLowerCase(),

    wallet,

    chain,

    walletType,

    txCount,

    active,
  };
};

// =========================
// GRAPH EDGE
// =========================

const createEdge = ({
  from,

  to,

  asset,

  amount,

  hash,

  timestamp,

  depth,

  direction,
}) => {
  return {
    id:
      `${hash}-${direction}`,

    from:
      from.toLowerCase(),

    to:
      to.toLowerCase(),

    asset,

    amount,

    hash,

    timestamp,

    depth,

    direction,
  };
};

// =========================
// MAIN TRACE ENGINE
// =========================

const generateChainOfCustody =
  async ({
    wallet,

    chain = "Unknown",

    transactions,

    traceFunction,

    depth = 1,

    maxDepth = 4,

    maxPerLevel = 3,

    visited = new Set(),

    tracedTransactions =
      new Set(),

    graph = {
      nodes: [],

      edges: [],

      paths: [],
    },

    currentPath = [],
  }) => {
    try {
      const normalizedWallet =
        wallet.toLowerCase();

      // =========================
      // LOOP PREVENTION
      // =========================

      if (
        visited.has(
          normalizedWallet
        )
      ) {
        graph.paths.push({
          direction:
            "LOOP",

          path: [
            ...currentPath,

            wallet,
          ],

          stoppedReason:
            "Loop prevented",
        });

        return graph;
      }

      visited.add(
        normalizedWallet
      );

      // =========================
      // ROOT PROFILE
      // =========================

      const rootProfile =
        await profileWallet(
          {
            walletData: {
              wallet,

              chain,

              recentTransactions:
                transactions,
            },
          }
        );

      // =========================
      // ROOT NODE
      // =========================

      const rootExists =
        graph.nodes.find(
          (n) =>
            n.id ===
            normalizedWallet
        );

      if (!rootExists) {
        graph.nodes.push(
          createNode({
            wallet,

            chain,

            walletType:
              rootProfile?.walletType ||
              "Unknown",

            txCount:
              transactions.length,

            active: true,
          })
        );
      }

      // =========================
      // OUTGOING
      // =========================

      const outgoing =
        transactions
          .filter(
            (tx) =>
              tx.direction ===
                "OUT" &&
              tx.stablecoin ===
                true
          )
          .slice(
            0,
            maxPerLevel
          );

      // =========================
      // INCOMING
      // =========================

      const incoming =
        transactions
          .filter(
            (tx) =>
              tx.direction ===
                "IN" &&
              tx.stablecoin ===
                true
          )
          .slice(
            0,
            maxPerLevel
          );

      // =========================
      // NO FLOWS
      // =========================

      if (
        outgoing.length ===
          0 &&
        incoming.length === 0
      ) {
        graph.paths.push({
          direction:
            "NONE",

          path: [
            ...currentPath,

            wallet,
          ],

          stoppedReason:
            "No stablecoin transactions",
        });

        return graph;
      }

      // =========================
      // PROCESSOR
      // =========================

      const processTrace =
        async (
          tx,

          direction
        ) => {
          try {
            const targetWallet =
              direction ===
              "OUT"
                ? tx.to
                : tx.from;

            if (
              !targetWallet
            ) {
              return;
            }

            const normalizedTarget =
              targetWallet.toLowerCase();

            // Skip self-loop
            if (
              normalizedTarget ===
              normalizedWallet
            ) {
              return;
            }

            // =========================
// TX DEDUPLICATION
// =========================

const txKey = tx.hash;

if (
  tracedTransactions.has(
    txKey
  )
) {
  return;
}

tracedTransactions.add(
  txKey
);

            // =========================
            // FETCH
            // =========================

            const targetData =
              await traceFunction(
                targetWallet,
                {
                  lite: true,
                }
              );

            if (
              !targetData
            ) {
              return;
            }

            // =========================
            // PROFILE
            // =========================

            const targetProfile =
              await profileWallet(
                {
                  walletData:
                    targetData,
                }
              );

            const targetType =
              targetProfile?.walletType ||
              "Unknown";

            // =========================
            // NODE
            // =========================

            const nodeExists =
              graph.nodes.find(
                (n) =>
                  n.id ===
                  normalizedTarget
              );

            if (
              !nodeExists
            ) {
              graph.nodes.push(
                createNode({
                  wallet:
                    targetWallet,

                  chain:
                    targetData.chain,

                  walletType:
                    targetType,

                  txCount:
                    targetData.txCount,

                  active:
                    targetData.active,
                })
              );
            }

            // =========================
            // EDGE
            // =========================

            const edgeExists =
              graph.edges.find(
                (e) =>
                  e.hash === tx.hash
              );

            if (
              !edgeExists
            ) {
              graph.edges.push(
                createEdge({
                  from:
                    tx.from,

                  to: tx.to,

                  asset:
                    tx.asset,

                  amount:
                    tx.value,

                  hash:
                    tx.hash,

                  timestamp:
                    tx.timestamp,

                  depth,

                  direction,
                })
              );
            }

            // =========================
            // PATH
            // =========================

            const nextPath =
              [
                ...currentPath,

                wallet,
              ];

            // =========================
            // EXCHANGE SINK/SOURCE
            // =========================

            if (
              EXCHANGE_TYPES.includes(
                targetType
              )
            ) {
              graph.paths.push({
                direction,

                path: [
                  ...nextPath,

                  targetWallet,
                ],

                stoppedReason:
                  direction ===
                  "OUT"
                    ? "Exchange sink detected"
                    : "Exchange funding source detected",
              });

              return;
            }

            // =========================
            // MAX DEPTH
            // =========================

            if (
              depth >=
              maxDepth
            ) {
              graph.paths.push({
                direction,

                path: [
                  ...nextPath,

                  targetWallet,
                ],

                stoppedReason:
                  "Maximum depth reached",
              });

              return;
            }

            // =========================
            // NO TXS
            // =========================

            if (
              !targetData.recentTransactions ||
              targetData
                .recentTransactions
                .length ===
                0
            ) {
              graph.paths.push({
                direction,

                path: [
                  ...nextPath,

                  targetWallet,
                ],

                stoppedReason:
                  "No further transactions",
              });

              return;
            }

            // =========================
            // RECURSION
            // =========================

            await generateChainOfCustody(
              {
                wallet:
                  targetWallet,

                chain:
                  targetData.chain,

                transactions:
                  targetData.recentTransactions,

                traceFunction,

                depth:
                  depth + 1,

                maxDepth,

                maxPerLevel: 2,

                visited,

                tracedTransactions,


                graph,

                currentPath:
                  nextPath,
              }
            );
          } catch (error) {
            console.log(
              "Trace Processor Error:",
              error.message
            );
          }
        };

      // =========================
      // OUTGOING TRACE
      // =========================

      for (const tx of outgoing) {
        await processTrace(
          tx,
          "OUT"
        );
      }

      // =========================
      // INCOMING TRACE
      // =========================

      for (const tx of incoming) {
        await processTrace(
          tx,
          "IN"
        );
      }

      // =========================
      // FINAL
      // =========================

      return graph;
    } catch (error) {
      console.log(
        "Custody Service Error:",
        error.message
      );

      return {
        nodes: [],

        edges: [],

        paths: [],
      };
    }
  };

module.exports = {
  generateChainOfCustody,
};