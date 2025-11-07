import Product from "../models/product.model.js";
import shopDetailsModel from "../models/shopDetails.model.js";
import mailer from "../config/mailer.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { Frontend_Url } from "../config/env.js";

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

    const users = await User.find({ role: "user" }, "email name");

    if (users && users.length > 0) {
      const productLink = `${Frontend_Url}/product/${product._id}`;

      const emailHTML = `
        <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px; overflow:hidden;">
          <div style="background:#000; color:#fff; padding:20px; text-align:center;">
            <h2 style="margin:0;">🛍️ New Product Alert!</h2>
          </div>

          <div style="padding:20px;">
            <h3 style="margin-top:0;">${product.name}</h3>
            <p>${
              product.description?.slice(0, 150) ||
              "Check out our latest product!"
            }</p>
            <p><b>Price:</b> Rs ${product.price.toFixed(2)}</p>

            ${
              product.images?.[0]
                ? `<img src="${product.images[0]}" alt="${product.name}" style="max-width:100%; border-radius:10px; margin-top:10px;">`
                : ""
            }

            <div style="text-align:center; margin-top:20px;">
              <a href="${productLink}" style="display:inline-block; background:#000; color:#fff; text-decoration:none; padding:10px 20px; border-radius:5px;">
                View Product
              </a>
            </div>

            <p style="margin-top:30px; font-size:13px; color:#777;">
              You’re receiving this email because you subscribed to Cart Sense updates.
            </p>
          </div>
        </div>
      `;

      const emailPromises = users.map((u) =>
        mailer.sendMail({
          from: `"Cart Sense" <${process.env.EMAIL_USER}>`,
          to: u.email,
          subject: `New Product Added: ${product.name}`,
          html: emailHTML,
        })
      );

      await Promise.allSettled(emailPromises);
      console.log(`📩 Sent new product email to ${users.length} users`);
    }

    res.status(201).json({
      success: true,
      message: "Product added successfully & notifications sent",
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
    const { page = 1, limit = 10, search = "", category = "All" } = req.query;

    const skip = (page - 1) * limit;

    const filter = {};

    if (category && category !== "All") {
      filter.categories = { $in: [category] };
    }

    if (search && search.trim() !== "") {
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
