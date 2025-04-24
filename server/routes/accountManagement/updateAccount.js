const express = require("express");
const router = express.Router();

function UpdateAccount(admin, supabase) {
  router.put("/api/admin/update-account", async (req, res) => {
    const { uid, name, password } = req.body;

    if (!uid) {
      return res
        .status(400)
        .json({ error: "User UID is required for update." });
    }

    try {
      const updatedUser = await admin.auth().updateUser(uid, {
        ...(name && { displayName: name }),
        ...(password && { password }),
      });

      const { data, error } = await supabase
        .from("shop_accounts")
        .update({
          ...(name && { name: name }),
        })
        .eq("uid", uid)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        message: "User updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error updating user",
        error: error.message,
      });
    }
  });

  return router;
}

module.exports = UpdateAccount;
