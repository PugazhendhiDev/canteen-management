const express = require("express");
const router = express.Router();

function UpdateFood(supabase) {
  router.put("/api/admin/update-food", async (req, res) => {
    const { id, category_id, name, image_link, description, rate, quantity } =
      req.body;
    try {
      const { data, error } = await supabase
        .from("food_list")
        .update({
          ...{
            category_id,
            name,
            image_link,
            description,
            rate,
            quantity,
          },
        })
        .eq("id", id)
        .select();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Food updated",
        data: data,
      });
    } catch (error) {
      console.error("Error updating food:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = UpdateFood;
