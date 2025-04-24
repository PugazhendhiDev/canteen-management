const express = require("express");
const router = express.Router();

function FetchAccounts(supabase) {
  router.get("/api/admin/fetch-accounts", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("shop_accounts")
        .select("*")
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Accounts fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = FetchAccounts;
