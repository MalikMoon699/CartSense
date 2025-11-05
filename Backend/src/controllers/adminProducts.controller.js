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
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    let imageUrls = product.images || [];

    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map((file) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "products" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          });
        })
      );
      imageUrls = [...imageUrls, ...uploadedImages];
    }
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name: updateData.name,
        price: updateData.price,
        stock: updateData.stock,
        description: updateData.description,
        categories: Array.isArray(updateData.categories)
          ? updateData.categories
          : [updateData.categories],
        filleds: updateData.specifications
          ? Object.values(updateData.specifications)
          : product.filleds,
        images: imageUrls,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while updating product" });
  }
};

export const getCategories = async (req, res) => {
  try {
    let shop = await shopDetailsModel.findOne();
    if (!shop) {
      shop = await shopDetailsModel.create({});
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

export const getSingleProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "reviews.user",
      "name email"
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
      error: error.message,
    });
  }
};

export const getSameCategoriesProducts = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({
      categories: { $in: [category] },
    }).limit(10);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found in this category",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching same category products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching same category products",
      error: error.message,
    });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, rating } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newReview = {
      user: req.user.id,
      name,
      description,
      rating,
    };

    product.reviews.push(newReview);

    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category = "All",
      minPrice = 0,
      maxPrice = 10000,
      minRating = 0,
    } = req.query;

    const skip = (page - 1) * limit;

    const filter = {
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      $or: [
        { rating: { $gte: Number(minRating) } },
        { rating: { $exists: false } },
      ],
    };

    if (category && category !== "All") {
      filter.categories = { $in: [category] };
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const allProducts = await Product.find({}, "categories");
    const allCategories = [
      "All",
      ...new Set(allProducts.flatMap((p) => p.categories || [])),
    ];

    res.status(200).json({
      success: true,
      products,
      total,
      categories: allCategories,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};
