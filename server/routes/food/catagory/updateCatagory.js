const express = require("express");
const router = express.Router();

function UpdateCatagory(supabase) {
  router.put("/api/admin/update-catagory", async (req, res) => {
    const { id, catagory, image_link } = req.body;
    try {
      const { data, error } = await supabase
        .from("food_catagories")
        .update({
          ...(catagory &&
            image_link && { catagory, image_link }),
        })
        .eq("id", id)
        .select();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Catagory updated",
        data: data,
      });
    } catch (error) {
      console.error("Error updating catagory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = UpdateCatagory;
