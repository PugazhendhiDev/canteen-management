const express = require("express");
const router = express.Router();

function GetUserWalletAmount(supabase) {
  router.get("/api/get-user-wallet-amount", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("user_data")
        .select("amount")
        .eq("uid", req.uid)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Amount fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = GetUserWalletAmount;
