const express = require("express");
const router = express.Router();

function GetUserDetails(supabase) {
  router.get("/api/get-user-details", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("user_data")
        .select("*")
        .eq("uid", req.uid)
        .eq("email", req.email)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "User fetched successfully",
        data: data,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = GetUserDetails;
