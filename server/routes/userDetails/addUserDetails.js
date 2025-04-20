const express = require("express");
const router = express.Router();

function AddUserDetails(admin, supabase) {
  router.post("/api/add-user-details", async (req, res) => {

    try {
      const decodedToken = await admin.auth().verifyIdToken(req.token);
      const { uid, email } = decodedToken;

      const { data, error } = await supabase
        .from("user_data")
        .insert([{ email, uid }])
        .select();

      if (error) return res.status(500).json({ error: error.message });

      res.status(201).json({
        message: "User added successfully",
        user: data[0],
      });
    } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = AddUserDetails;
