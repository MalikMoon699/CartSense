import Product from "../models/product.model.js";
import shopDetailsModel from "../models/shopDetails.model.js";
import cloudinary from "../config/cloudinary.js";

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = {};

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      categories,
      specifications = [],
      selectedImages = [],
    } = req.body;

    const user = req.user?.id;

    if (!name || !price || !categories) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "CartSense_Products",
                resource_type: "image",
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            )
            .end(file.buffer);
        });
      });

      imageUrls = await Promise.all(uploadPromises);
    } else {
      imageUrls = selectedImages;
    }

    const filleds = specifications.map((spec) => ({
      title: spec.title,
      value: [spec.value],
    }));

    const product = new Product({
      user,
      name,
      description,
      price,
      stock,
      categories,
      filleds,
      images: imageUrls,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while adding product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
};

export const getCategories = async (req, res) => {
  try {
    console.log("➡️ Fetching categories...");

    let shop = await shopDetailsModel.findOne();
    console.log("🔍 Found shop:", shop);

    if (!shop) {
      shop = await shopDetailsModel.create({});
      console.log("✅ Created default ShopDetails document:", shop);
    }

    res.status(200).json({
      success: true,
      categories: shop.categories || [],
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: "Server error while fetching categories" });
  }
};

export const updateCategories = async (req, res) => {
  try {
    const { newCategories } = req.body;
    if (!newCategories || !Array.isArray(newCategories)) {
      return res
        .status(400)
        .json({ message: "newCategories must be an array" });
    }

    const shop = await shopDetailsModel.findOne();
    if (!shop) {
      return res.status(404).json({ message: "Shop details not found" });
    }

    const updatedCategories = [
      ...new Set([...(shop.categories || []), ...newCategories]),
    ];

    shop.categories = updatedCategories;
    await shop.save();
    res.status(200).json({
      success: true,
      message: "Categories updated successfully",
      categories: updatedCategories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating categories",
      error: error.message,
    });
  }
};
