const express = require("express");
const router = express.Router();

function AccountCreation(admin, supabase) {
  router.post("/api/admin/create-account", async (req, res) => {
    const { email, password, displayName } = req.body;

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });

      if (userRecord) {
        const { data, error } = await supabase
          .from("shop_accounts")
          .insert([
            {
              uid: userRecord.uid,
              email: userRecord.email,
              name: userRecord.displayName,
            },
          ])
          .select();

        if (error) {
          try {
            await admin.auth().deleteUser(userRecord.uid);
            return res.status(500).json({ error: error.message });
          } catch (err) {
            res.status(500).json({ error: err.message });
          }
        }
      }

      res.status(200).json({
        message: "User created successfully",
        uid: userRecord.uid,
        email: userRecord.email,
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

module.exports = AccountCreation;
