const express = require("express");
const router = express.Router();

function DeleteAccount(admin, supabase) {
  router.delete("/api/admin/delete-account", async (req, res) => {
    const { uid } = req.body;

    try {
      await admin.auth().deleteUser(uid);

      const { error: supabaseError } = await supabase
        .from("shop_accounts")
        .delete()
        .eq("uid", uid);

      if (supabaseError) {
        return res.status(500).json({ error: `Supabase error: ${supabaseError.message}` });
      }

      return res.status(200).json({ message: "User deleted successfully from Firebase and Supabase" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = DeleteAccount;