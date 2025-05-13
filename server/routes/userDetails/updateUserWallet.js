const express = require("express");
const router = express.Router();

function UpdateUserWallet(supabase) {
  router.put("/api/admin/update-user-wallet", async (req, res) => {
    const { roll_no, amount } = req.body;

    try {
      const { data: userData, error: fetchError } = await supabase
        .from("user_data")
        .select("amount")
        .eq("roll_no", roll_no)
        .single();

      if (fetchError) {
        return res.status(404).json({ error: "User not found" });
      }

      const newAmount = Number(userData.amount) + Number(amount);

      const { data, error: updateError } = await supabase
        .from("user_data")
        .update({ amount: newAmount })
        .eq("roll_no", roll_no)
        .select();

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }

      res.status(200).json({
        message: `₹${amount} added successfully`,
        newAmount,
        user: data[0],
      });
    } catch (error) {
      console.error("Error updating wallet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = UpdateUserWallet;
