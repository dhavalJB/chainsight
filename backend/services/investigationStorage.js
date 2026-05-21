const fs = require("fs");

const path = require("path");

/* ========================================= */

const CACHE_DIR = path.join(
  __dirname,
  "../cache/investigations"
);

/* ========================================= */
/* CREATE CACHE DIRECTORY */
/* ========================================= */

if (
  !fs.existsSync(CACHE_DIR)
) {
  fs.mkdirSync(
    CACHE_DIR,
    {
      recursive: true,
    }
  );
}

/* ========================================= */
/* SAVE INVESTIGATION */
/* ========================================= */

function saveInvestigation(
  wallet,
  data
) {
  try {
    const now =
      Date.now();

    const payload = {
      wallet,

      createdAt: now,

      data,
    };

    /* =========================
       SAVE ONLY LATEST FILE
    ========================= */

    const latestPath =
      path.join(
        CACHE_DIR,
        "latest-investigation.json"
      );

    fs.writeFileSync(
      latestPath,
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    console.log(
      "✅ Latest Investigation Updated"
    );

    return {
      success: true,

      createdAt: now,
    };
  } catch (error) {
    console.error(
      "Save Investigation Error:"
    );

    console.error(error);

    return {
      success: false,

      error:
        "Failed to save investigation",
    };
  }
}

/* ========================================= */
/* GET LATEST INVESTIGATION */
/* ========================================= */

function getLatestInvestigation() {
  try {
    const filePath =
      path.join(
        CACHE_DIR,
        "latest-investigation.json"
      );

    if (
      !fs.existsSync(
        filePath
      )
    ) {
      return {
        success: false,

        error:
          "No investigation found",
      };
    }

    const raw =
      fs.readFileSync(
        filePath,
        "utf-8"
      );

    const parsed =
      JSON.parse(raw);

    return {
      success: true,

      investigation:
        parsed,
    };
  } catch (error) {
    console.error(
      "Get Latest Investigation Error:"
    );

    console.error(error);

    return {
      success: false,

      error:
        "Failed to load latest investigation",
    };
  }
}

/* ========================================= */

module.exports = {
  saveInvestigation,

  getLatestInvestigation,
};