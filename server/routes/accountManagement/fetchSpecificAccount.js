const express = require("express");
const router = express.Router();

function FetchSpecificAccount(supabase) {
  router.get("/api/admin/fetch-specific-account/:uid", async (req, res) => {
    const { uid } = req.params;
    try {
      const { data, error } = await supabase
        .from("shop_accounts")
        .select("*")
        .eq("uid", uid)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Account fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = FetchSpecificAccount;
