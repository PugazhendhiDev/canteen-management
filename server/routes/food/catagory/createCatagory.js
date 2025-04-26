const express = require("express");
const router = express.Router();

function CreateCatagory(supabase) {
  router.post("/api/admin/create-catagory", async (req, res) => {
    const {catagory, image_link} = req.body;
    try {
      const { data, error } = await supabase
        .from("food_catagories")
        .insert([
          {
            catagory: catagory,
            image_link: image_link,
          },
        ])
        .select();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Catagory created",
        data: data,
      });
    } catch (error) {
      console.error("Error creating catagory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = CreateCatagory;
