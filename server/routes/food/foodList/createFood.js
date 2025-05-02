const express = require("express");
const router = express.Router();

function CreateFood(supabase) {
  router.post("/api/admin/create-food", async (req, res) => {
    const { category_id, name, image_link, description, rate, quantity } =
      req.body;
    try {
      const { data, error } = await supabase
        .from("food_list")
        .insert([
          {
            category_id,
            name,
            image_link,
            description,
            rate,
            quantity,
          },
        ])
        .select();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Food created",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = CreateFood;
