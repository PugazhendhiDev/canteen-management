const express = require("express");
const router = express.Router();

function AddUserDetails(supabase) {
  router.post("/api/add-user-details", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("user_data")
        .insert([{ email: req.email, uid: req.uid }])
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
