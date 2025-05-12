const express = require("express");
const router = express.Router();

function AddUserDetails(firebaseAdmin, supabase) {
  router.post("/api/add-user-details", async (req, res) => {
    const { roll_no } = req.body;

    try {
      const { data, error } = await supabase
        .from("user_data")
        .insert([{ email: req.email, uid: req.uid, roll_no }])
        .select();

      if (error) {
        try {
          await firebaseAdmin.auth().deleteUser(req.uid);
          console.log("Deleted user from Firebase Auth:", req.uid);
        } catch (fbError) {
          console.error(
            "Error deleting user from Firebase Auth:",
            fbError.message
          );
        }

        return res
          .status(500)
          .json({ error: "User creation failed, account removed." });
      }

      res.status(201).json({
        message: "User added successfully",
        user: data[0],
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = AddUserDetails;
