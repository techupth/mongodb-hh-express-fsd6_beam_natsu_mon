import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const productName = req.query.keywords;
    const productCategory = req.query.category;
    const query = {};
    if (productName) {
      query.productName = new RegExp(productName, "i");
    }
    if (productCategory) {
      query.productCategory = new RegExp(productCategory, "i");
    }
    const collection = db.collection("products");
    const allProducts = await collection.find(query).limit(10).toArray();
    return res.status(200).json({ data: allProducts });
  } catch {
    return res.status(500).json({
      message: `Failed to get product`,
    });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);
    const product = await collection.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ data: product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).json({ message: "Error retrieving product" });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productData = { ...req.body, created_at: new Date() };
    const newProductData = await collection.insertOne(productData);
    console.log("kuy", newProductData);
    return res.status(201).json({
      message: `Product ID ${newProductData.insertedId} has been created successfully`,
    });
  } catch {
    return res.status(500).json({
      message: `Failed to create product: ${error.message}`,
    });
  }
});

productRouter.put("/:productId", async (req, res) => {
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
      message: `Product has been updated successfully`,
    });
  } catch {
    return res.status(500).json({
      message: `Failed to update product: ${error.message}`,
    });
  }
});

productRouter.delete("/:productId", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: productId });
    return res.json({
      message: `Product record ${productId} has been deleted successfully`,
    });
  } catch {
    return res.status(500).json({
      message: `Failed to delte product: ${error.message}`,
    });
  }
});

export default productRouter;
