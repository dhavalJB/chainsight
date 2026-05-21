const express = require(
  "express"
);

const cors = require(
  "cors"
);

require("dotenv").config();

const config = require(
  "./config/config"
);

const walletRoutes =
  require(
    "./routes/walletRoutes"
  );

  const transactionRoutes =
  require(
    "./routes/transactionRoutes"
  );

  const investigationRoutes =
  require(
    "./routes/investigationRoutes"
  );


const app = express();

// ========================
// SECURITY HEADERS
// ========================

app.disable(
  "x-powered-by"
);

// ========================
// CORS
// ========================

app.use(
  cors({
    origin: "*",

    methods: [
      "GET",
      "POST",
    ],
  })
);

// ========================
// JSON
// ========================

app.use(
  express.json({
    limit: "10mb",
  })
);

// ========================
// REQUEST LOGGER
// ========================

app.use(
  (req, res, next) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );

    next();
  }
);

// ========================
// HEALTH CHECK
// ========================

app.get(
  "/health",
  (req, res) => {
    return res.json({
      success: true,

      status: "OK",

      service:
        "ChainSight Backend",

      timestamp:
        new Date().toISOString(),
    });
  }
);

// ========================
// API ROUTES
// ========================

app.use(
  "/api/wallet",
  walletRoutes
);

app.use(
  "/api/transaction",
  transactionRoutes
);

app.use(
  "/api/investigation",
  investigationRoutes
);

// ========================
// 404 HANDLER
// ========================

app.use(
  (req, res) => {
    return res.status(404).json(
      {
        success: false,

        message:
          "Route not found",
      }
    );
  }
);

// ========================
// GLOBAL ERROR HANDLER
// ========================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Global Error:",
      error.message
    );

    return res.status(500).json(
      {
        success: false,

        message:
          "Internal Server Error",
      }
    );
  }
);

// ========================
// START SERVER
// ========================

app.listen(
  config.PORT,
  () => {
    console.log(
      `🚀 ChainSight Backend Running On Port ${config.PORT}`
    );

    console.log(
      `🌐 Health Check: http://localhost:${config.PORT}/health`
    );
  }
);