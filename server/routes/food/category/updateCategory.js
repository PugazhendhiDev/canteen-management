const express = require("express");
const router = express.Router();

function UpdateCategory(supabase) {
  router.put("/api/admin/update-category", async (req, res) => {
    const { id, category, image_link } = req.body;
    try {
      const { data, error } = await supabase
        .from("food_categories")
        .update({
          ...(category &&
            image_link && { category, image_link }),
        })
        .eq("id", id)
        .select();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "category updated",
        data: data,
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = UpdateCategory;
