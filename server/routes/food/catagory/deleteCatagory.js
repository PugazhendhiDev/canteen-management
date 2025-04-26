const express = require("express");
const router = express.Router();

function DeleteCatagory(supabase) {
  router.delete("/api/admin/delete-catagory", async (req, res) => {
    const { id } = req.body;

    try {
      const { data, error } = await supabase
        .from("food_catagories")
        .delete()
        .eq("id", id);

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Catagory deleted",
      });
    } catch (error) {
      console.error("Error deleting catagory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = DeleteCatagory;
