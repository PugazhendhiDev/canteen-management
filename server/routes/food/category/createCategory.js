const express = require("express");
const router = express.Router();

function CreateCategory(supabase) {
  router.post("/api/admin/create-category", async (req, res) => {
    const { category, image_link } = req.body;
    try {
      const { data, error } = await supabase
        .from("food_categories")
        .insert([
          {
            category,
            image_link,
          },
        ])
        .select();

      if (
        error &&
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        return res.status(400).json({ message: "Category already exists" });
      }

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Category created",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = CreateCategory;
