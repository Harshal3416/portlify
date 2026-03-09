"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoSettingsOutline } from "react-icons/io5";
import { useAuth } from "@/app/context/AuthContext";
import Card, { Product } from "@/app/components/ui/card";

// type Tab = "login" | "register";

export default function Products() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // products state for dashboard
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // shared state for add / edit form
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [highlightImage, setHighlightImage] = useState<File | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateProductId = () => {
    // Simple unique ID generator (for demo purposes only)
    const id = Math.floor(100000 + Math.random() * 900000)+'';
    if (products.find(p => p.productId === id)) {
      return generateProductId(); // ensure uniqueness
    }
    return id;
  };

  useEffect(() => {
    setProductId(generateProductId());
  }, []);

  // fetch products only when logged in
  useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();
        // newest first
        setProducts((data || []).slice().reverse());
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [user]);

  const resetProductForm = () => {
    setProductName("");
    setProductId(generateProductId());
    setDescription("");
    setHighlightImage(null);
    setEditingProductId(null);
  };

  const handleSubmitProduct = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (!productId || !productName) {
        setError("Product ID and name are required");
        return;
      }

      // if editing: simple JSON update (no file change for now)
      if (editingProductId) {
        const res = await fetch(
          `http://localhost:3000/api/products/${editingProductId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: productName,
              description,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to update product");
          return;
        }
        setProducts((prev) =>
          prev.map((p) => (p.productId === editingProductId ? { ...p, ...data } : p))
        );
        resetProductForm();
        return;
      }

      // creating new product (with optional highlight image)
      const form = new FormData();
      form.append("productId", productId);
      form.append("name", productName);
      form.append("description", description);
      if (highlightImage) {
        form.append("highlightImage", highlightImage);
      }

      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create product");
        return;
      }
      // prepend so newest appears first
      setProducts((prev) => [data.data, ...prev]);
      resetProductForm();
    } catch (err: any) {
      console.error("Product submit error:", err);
      setError("Failed to save product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to delete product", data);
        return;
      }
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const siteSettings = () => {
    router.push("/admin/settings");
  };

  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.productId);
    setProductName(product.name || "");
    setProductId(product.productId || "");
    setDescription(product.description || "");
    setHighlightImage(null);
  };

 return (
    <div className="flex min-h-screen flex-col items-start justify-start w-auto mt-10 px-4">
      <div className="flex w-full items-center justify-between mb-4">
        <h6 className="text-2xl">Products</h6>
        <div className="flex flex-row ml-auto">
        <button
          type="button"
          className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100"
          onClick={() => {
            logout();
            router.push("/admin/login");
          }}
        >
          Logout
        </button>
        <IoSettingsOutline className="m-4" onClick={() => siteSettings()}/>
        </div>
      </div>

      {error && (
        <p className="text-red-600 mb-2 text-sm max-w-md">
          {error}
        </p>
      )}

      {loadingProducts ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
          {/* First card: Add / edit product */}
          <div className="border border-gray-300 rounded-md p-4 flex flex-col h-full">
            <h4 className="text-xl font-bold mb-2">
              {editingProductId ? "Edit product" : "Add a product"}
            </h4>
            <input
              className="p-2 mt-1 border border-gray-300 rounded-md text-sm"
              name="Product Name"
              type="text"
              placeholder="Enter Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />

            <input
              className="p-2 mt-3 border border-gray-300 rounded-md text-sm"
              type="text"
              value={productId}
              placeholder="Enter Product ID"
              disabled={true}
            />

            <textarea
              className="p-2 mt-3 border border-gray-300 rounded-md text-sm"
              name="Description"
              placeholder="Enter Product Description"
              maxLength={150}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/150 characters
            </p>

            {!editingProductId && (
              <>
                <label className="mt-3 text-xs font-medium text-gray-700">
                  Upload Highlight Image <span className="text-red-700">*</span>
                </label>
                <input
                  className="p-2 mt-1 border border-gray-300 rounded-md text-sm"
                  name="highlightImage"
                  placeholder="Upload Highlight Image"
                  type="file"
                  accept="image/*"
                  value={highlightImage ? undefined : ""}
                  onChange={(e) =>
                    setHighlightImage(e.target.files?.[0] || null)
                  }
                />
              </>
            )}

            <div className="flex gap-2 mt-3">
              <button
                className="px-4 py-2 bg-black text-white rounded-md text-sm disabled:opacity-60"
                onClick={handleSubmitProduct}
                type="button"
                disabled={
                  submitting ||
                  !productId ||
                  !productName ||
                  (!editingProductId && !highlightImage)
                }
              >
                {editingProductId ? "Save changes" : "+ Add this product"}
              </button>
              {editingProductId && (
                <button
                  className="px-4 py-2 border border-gray-400 rounded-md text-sm"
                  type="button"
                  onClick={resetProductForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Existing product cards */}
          {products.length === 0 ? (
            <p className="text-sm text-gray-500 self-center">
              No products added yet. Use the first card to add one.
            </p>
          ) : (
            products.map((product) => (
              <Card
                key={product.productId}
                product={product}
                mode="admin"
                onDelete={handleDeleteProduct}
                onEdit={startEditingProduct}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

