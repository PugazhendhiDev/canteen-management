const express = require("express");
const router = express.Router();

function AdminLogin(supabase) {
  router.post("/api/admin/login", async (req, res) => {
    const { email } = req.body;

    try {
      if (!email || !req.uid) {
        return res.status(400).json({ error: "Missing email or uid" });
      }

      const { data, error } = await supabase
        .from("admin_accounts")
        .select("*")
        .eq("email", email)
        .eq("uid", req.uid)
        .single();

      if (error && error.code !== "PGRST116") {
        return res.status(500).json({ error: error.message });
      }

      if (data) {
        console.log(data);
        return res.status(200).json({
          message: "Admin verified",
        });
      } else {
        if (error && error.code === "PGRST116") {
          return res.status(500).json({
            message: "Use admin account",
            error: error.message,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Error verifing admin",
        error: error.message,
      });
    }
  });

  return router;
}

module.exports = AdminLogin;
