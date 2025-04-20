const express = require("express");
const router = express.Router();

function Logout() {
  router.get("/api/logout", async (req, res) => {
    try {
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error signing out:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = Logout;
