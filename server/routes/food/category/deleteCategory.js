const express = require("express");
const router = express.Router();

function DeleteCategory(supabase) {
  router.delete("/api/admin/delete-category", async (req, res) => {
    const { id } = req.body;

    try {
      const { data, error } = await supabase
        .from("food_categories")
        .delete()
        .eq("id", id);

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "category deleted",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = DeleteCategory;
