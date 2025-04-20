const express = require("express");
const router = express.Router();

function UpdateUserDetails(admin, supabase) {
  router.put("/api/update-user-details", async (req, res) => {
    const { name, roll_no, dept, section, year, batch } = req.body;

    try {
      const decodedToken = await admin.auth().verifyIdToken(req.token);
      const { uid, email } = decodedToken;

      const { data, error } = await supabase
        .from("user_data")
        .update({ name, roll_no, dept, section, year, batch })
        .eq("uid", uid)
        .eq("email", email)
        .select();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "User updated successfully",
        user: data[0],
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = UpdateUserDetails;
