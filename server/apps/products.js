import { Router } from "express";
import { db } from "../utils/db.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const name = req.query.keywords;
    const category = req.query.category;
    const query = {};
    if (name) {
      query.name = new RegExp(name, "i");
    }
    if (category) {
      query.category = new RegExp(category, "i");
    }
    const collection = db.collection("products");
    const allProducts = await collection.find(query).limit(10).toArray();
    return res.json({ data: allProducts });
  } catch {
    return res.json({
      message: "Find products error",
    });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new Object(req.params.id);

    const productById = await collection.findOne({ _id: productId });

    return res.json({
      data: productById,
    });
  } catch {
    return res.json({
      message: "Error",
    });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productData = { ...req.body, created_at: new Date() };
    const newProductData = await collection.insertOne(productData);
    return res.status(201).json({
      message: `Product ID ${newProductData.insertedId} has been created successfully`,
    });
  } catch {
    return res.status(500).json({
      message: `Failed to create product: ${error.message}`,
    });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const newProductData = { ...req.body, modified_at: new Date() };

    const productId = new ObjectId(req.params.id);

    await collection.updateOne(
      {
        _id: productId,
      },
      {
        $set: newProductData,
      }
    );
    return res.json({
      message: `Product record ${productId} has been updated successfully`,
    });
  } catch {
    return res.json({
      message: "Updated product false",
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: productId });
    return res.json({
      message: `Product record ${productId} has been deleted successfully`,
    });
  } catch {
    return res.json({
      message: "Delete false",
    });
  }
});

export default productRouter;
