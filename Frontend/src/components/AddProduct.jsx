import React, { useState, useRef, useEffect } from "react";
import { BadgePlus, ImageUp, Sparkle, Sparkles, X } from "lucide-react";
import { productDescription } from "../services/Helpers";
import { toast } from "sonner";
import Loader from "./Loader";
import API from "../utils/api";
import { Currencies } from "../services/CurrencyHelper";

const AddProduct = ({ onClose, product }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    currencyType: "",
    stock: "",
    description: "",
    categories: [],
    specifications: [],
    selectedImages: [],
    selectedFiles: [],
  });
  const [customCategory, setCustomCategory] = useState("");
  const [addCategoryLoading, setAddCategoryLoading] = useState(false);
  const [newSpec, setNewSpec] = useState({ title: "", value: "" });
  const [loading, setLoading] = useState(false);
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || 0,
        currencyType: product.currencyType || "",
        stock: product.stock || 0,
        description: product.description || "",
        categories: product.categories || [],
        specifications:
          product.filleds?.map((f) => ({
            title: f.title,
            value: f.value.join(", "),
          })) || [],
        selectedImages: product.images || [],
        selectedFiles: [],
      });
    }
  }, [product]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/adminProduct/getcategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setCategories(res.data.categories || []);
      } else {
        toast.error(res.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Server error while fetching categories");
    }
  };

  const handleAddCategory = async () => {
    if (customCategory.trim() && !categories.includes(customCategory)) {
      try {
        setAddCategoryLoading(true);
        const token = localStorage.getItem("token");
        const res = await API.put(
          "/adminProduct/updatecategories",
          { newCategories: [customCategory] },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          toast.success("Category added successfully");
          setCustomCategory("");
          fetchCategories();
        } else {
          toast.error(res.data.message || "Failed to add category");
        }
      } catch (error) {
        console.error("Error updating categories:", error);
        toast.error("Server error while updating categories");
      } finally {
        setAddCategoryLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category) => {
    setForm((prev) => {
      const alreadySelected = prev.categories.includes(category);
      return {
        ...prev,
        categories: alreadySelected
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  };

  const handleAddSpec = () => {
    if (newSpec.title && newSpec.value) {
      setForm((prev) => ({
        ...prev,
        specifications: [...prev.specifications, newSpec],
      }));
      setNewSpec({ title: "", value: "" });
    } else {
      toast.error("Both title and value required");
    }
  };

  const handleRemoveSpec = (index) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (form.selectedImages.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setForm((prev) => ({
      ...prev,
      selectedImages: [...prev.selectedImages, ...previewUrls],
      selectedFiles: [...(prev.selectedFiles || []), ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      selectedImages: prev.selectedImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.currencyType) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("currencyType", form.currencyType);
      formData.append("stock", form.stock);
      formData.append("description", form.description);
      form.categories.forEach((cat) => formData.append("categories", cat));
      form.specifications.forEach((spec, i) => {
        formData.append(`specifications[${i}][title]`, spec.title);
        formData.append(`specifications[${i}][value]`, spec.value);
      });

      form.selectedFiles.forEach((file) => formData.append("images", file));

      let res;
      if (product?._id) {
        res = await API.put(
          `/adminProduct/updateProduct/${product._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        res = await API.post("/adminProduct/addProduct", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (res.data.success) {
        toast.success(
          product
            ? "Product updated successfully"
            : "Product added successfully"
        );
        onClose();
      } else {
        toast.error(res.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Server error while submitting product");
    } finally {
      setLoading(false);
    }
  };

  const Validations = () => {
    if (!form.name) return false;
    if (!form.price) return false;
    if (!form.categories || form.categories.length === 0) return false;
    if (!form.selectedImages || form.selectedImages.length === 0) return false;
    return true;
  };

  const handleGenerateDescription = async () => {
    if (!Validations())
      return toast.error("Please fill all required fields first.");
    const description = await productDescription(setDescriptionLoading, form);
    setForm((prev) => ({ ...prev, description }));
    toast.success("AI description generated successfully!");
  };

  return (
    <div className="modal-overlay">
      <div style={{ width: "450px" }} className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {product ? "Update Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="modal-close-btn">
            <X />
          </button>
        </div>

        <div>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product title"
            className="login-input"
          />
          <div
            style={{ marginBottom: "1rem" }}
            className="addproduct-category-input"
          >
            <input
              type="number"
              name="price"
              min={0}
              value={form.price}
              onChange={handleChange}
              placeholder="Product price"
              className="login-input"
            />
            <select
              name="currencyType"
              value={form.currencyType}
              onChange={handleChange}
              style={{ cursor: "pointer" }}
              className="login-input"
            >
              <option value="" disabled>
                Select Currency
              </option>
              {Currencies.map((currency, index) => (
                <option key={index} value={currency.ISOCode}>
                  {currency.Symbol} ({currency.ISOCode})
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            name="stock"
            min={0}
            value={form.stock}
            onChange={handleChange}
            placeholder="Product stock"
            className="login-input"
          />

          <div className="addproduct-category-manager">
            <div className="addproduct-category-input">
              <input
                type="text"
                placeholder="Add Custom"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="login-input"
              />
              <button
                className="addproduct-add-category-btn"
                onClick={handleAddCategory}
                disabled={addCategoryLoading}
              >
                {addCategoryLoading ? (
                  <Loader color="white" style={{ width: "35px" }} size="14" />
                ) : (
                  "+ Add"
                )}
              </button>
            </div>

            <div className="addproduct-category-list">
              {categories.map((category, index) => (
                <button
                  onClick={() => handleCategorySelect(category)}
                  key={index}
                  className={`addproduct-select-category-btn ${
                    form.categories.includes(category)
                      ? "addproduct-selected-category-btn"
                      : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="addproduct-specs">
            <div className="specs-inputs">
              <input
                type="text"
                placeholder="Field title Color, Size, etc.."
                value={newSpec.title}
                onChange={(e) =>
                  setNewSpec((prev) => ({ ...prev, title: e.target.value }))
                }
                className="login-input"
              />
              <input
                type="text"
                placeholder="Field value red, blue, green"
                value={newSpec.value}
                onChange={(e) =>
                  setNewSpec((prev) => ({ ...prev, value: e.target.value }))
                }
                className="login-input"
              />
              <button
                className="add-user-btn"
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                onClick={handleAddSpec}
              >
                <span className="icon">
                  <BadgePlus size={16} />
                </span>
                Add Specification
              </button>
            </div>

            <div className="specs-list">
              {form.specifications.map((spec, index) => (
                <div key={index} className="spec-item">
                  <span>
                    <strong>{spec.title}:</strong> {spec.value}
                  </span>
                  <button onClick={() => handleRemoveSpec(index)}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="ai-inherance-textarea-container">
            <button
              onClick={handleGenerateDescription}
              style={
                descriptionLoading
                  ? {
                      backgroundColor: "#858585",
                      cursor: "not-allowed",
                    }
                  : {}
              }
              className="ai-inherance"
            >
              {descriptionLoading ? (
                <span className="spark-loader">
                  <Sparkle size={18} />
                </span>
              ) : (
                <span className="icon">
                  <Sparkles size={18} />
                </span>
              )}
              Inherance
            </button>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="login-textarea"
              placeholder="Product description"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button
            className="addproduct-upload-img-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <span className="icon">
              <ImageUp />
            </span>
            <p>Click to upload your Images (max 10)</p>
          </button>

          <div className="addproduct-selected-images">
            {form.selectedImages.map((img, index) => (
              <div key={index} className="addproduct-image-preview">
                <button
                  className="remove-img-btn"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X size={14} />
                </button>
                <img src={img} alt="product" />
              </div>
            ))}
          </div>

          <button
            style={{
              width: "100%",
              padding: "12px",
              cursor: loading ? "not-allowed" : "",
            }}
            className="add-user-btn"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <Loader color="white" size="14" />
            ) : (
              <>
                <span className="icon">
                  <BadgePlus size={16} />
                </span>
                {product ? "Update Product" : "Add Product"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
