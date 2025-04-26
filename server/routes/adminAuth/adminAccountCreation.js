const express = require("express");
const router = express.Router();

function AdminAccountCreation(admin, supabase) {
  router.post("/api/admin/create-admin-account", async (req, res) => {
    const { email } = req.body;

    try {
      if (!email || !req.uid) {
        return res.status(400).json({ error: "Missing email or uid" });
      }

      const { data: existingAdmin, error: fetchError } = await supabase
        .from("admin_accounts")
        .select("*")
        .eq("email", email)
        .eq("uid", req.uid)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        return res.status(500).json({ error: fetchError.message });
      }

      if (existingAdmin) {
        return res.status(200).json({
          message: "Admin already exists",
        });
      }

      const { data, error } = await supabase
        .from("admin_accounts")
        .insert([{ email: email, uid: req.uid }])
        .select();

      if (error) {
        try {
          await admin.auth().deleteUser(req.uid);
          return res.status(500).json({ error: error.message });
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      }

      res.status(200).json({
        message: "User created successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating user",
        error: error.message,
      });
    }
  });

  return router;
}

module.exports = AdminAccountCreation;
