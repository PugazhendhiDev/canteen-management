const express = require("express");
const router = express.Router();

function ShopLogin(supabase) {
  router.get("/api/counter/login", async (req, res) => {

    try {
      if (!req.email || !req.uid) {
        return res.status(400).json({ error: "Missing email or uid" });
      }

      const { data, error } = await supabase
        .from("shop_accounts")
        .select("*")
        .eq("email", req.email)
        .eq("uid", req.uid)
        .single();

      if (error && error.code !== "PGRST116") {
        return res.status(500).json({ error: error.message });
      }

      if (data) {
        return res.status(200).json({
          message: "Counter verified",
        });
      } else {
        if (error && error.code === "PGRST116") {
          return res.status(500).json({
            message: "Use counter account",
            error: error.message,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Error verifing counter",
        error: error.message,
      });
    }
  });

  return router;
}

module.exports = ShopLogin;
