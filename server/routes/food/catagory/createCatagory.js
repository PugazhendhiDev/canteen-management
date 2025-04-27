const express = require("express");
const { messaging } = require("firebase-admin");
const router = express.Router();

function CreateCatagory(supabase) {
  router.post("/api/admin/create-catagory", async (req, res) => {
    const { catagory, image_link } = req.body;
    try {
      const { data, error } = await supabase
        .from("food_catagories")
        .insert([
          {
            catagory,
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
        message: "Catagory created",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = CreateCatagory;
