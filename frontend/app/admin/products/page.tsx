"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoSettingsOutline } from "react-icons/io5";
import { useAuth } from "@/app/context/AuthContext";
import Card, { Product } from "@/app/components/ui/card";
import { useCreateProduct, useDeleteProduct, useGetProductsQuery, useUpdateProduct } from "@/hooks/useProductMutation";
import { useToast } from "@/app/context/ToastContext";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// type Tab = "login" | "register";

export default function Products() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const { showToast } = useToast();

  const shopid = user?.shopid || '';

  // Use React Query for fetching products - simplifies data fetching with caching
  // Returns data, loading state, error, and refetch function
  const { data: products = [], isLoading: loadingProducts, error } = useGetProductsQuery(shopid);

  // shared state for add / edit form
  const [productName, setProductName] = useState("");
  const [productid, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [highlightimage, setHighlightImage] = useState<File | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [addProductsModal, setAddProductModal] = useState(false);

  const generateProductId = () => {
    // Simple unique ID generator (for demo purposes only)
    const id = Math.floor(100000 + Math.random() * 900000) + '';
    if (products.find((p: any) => p.productid === id)) {
      return generateProductId(); // ensure uniqueness
    }
    return id;
  };

  useEffect(() => {
    setProductId(generateProductId());
  }, []);

  // Route protection - redirect to login if not authenticated
  // useEffect(() => {
  //   if (!user) {
  //     router.push("/admin/login");
  //     return;
  //   }
  // }, [user, router]);

  // Note: Products are now fetched via useGetProductsQuery hook above
  // No need for manual useEffect fetch anymore

  const resetProductForm = () => {
    setProductName("");
    setProductId(generateProductId());
    setDescription("");
    setHighlightImage(null);
    // Clear file input visually
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setEditingProductId(null);
  };

  const handleSubmitProduct = async () => {
    // Validate required fields
    if (!productid || !productName) {
      setSubmitError("Product ID and name are required");
      return;
    }

    // Build FormData - common for both create and update
    const form = new FormData();
    form.append("productid", productid);
    form.append("name", productName);
    form.append("description", description);
    form.append("shopid", shopid);

    // Only append image if a new file is selected
    if (highlightimage) {
      form.append("highlightimage", highlightimage);
    }

    try {
      if (editingProductId) {
        // Update existing product
        await updateMutation.mutateAsync({
          id: editingProductId,
          formData: form,
        });
        // React Query handles cache invalidation via onSuccess in the mutation hook
      } else {
        // Create new product
        await createMutation.mutateAsync(form);
        // React Query handles cache invalidation via onSuccess in the mutation hook
      }
      showToast(`Product Added!`, "success")

      // Reset form after successful submit
      resetProductForm();
    } catch (err: any) {
      // Display error message to user
      setSubmitError(err.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async () => {
    const productid = deleteId;
    deleteMutation.mutate(
      {
        productid
      },
      {
        onSuccess: (data) => {
          console.log("DELETED", data);
          // remove from cart
          const remainingProducts = JSON.parse(localStorage.getItem("cart") || "[]").filter((el: any) => {
            return el.productid !== productid
          })
          showToast(`${data.name || 'Product'} Deleted!`, "success")
          setShowDeleteModal(false)
          localStorage.setItem('cart', JSON.stringify(remainingProducts))
        },
        onError: (err) => {
          console.log("Error in deleting")
        }
      }
    )
  }

  const siteSettings = () => {
    router.push("/admin/settings");
  };

  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.productid);
    setProductName(product.name || "");
    setProductId(product.productid || "");
    setDescription(product.description || "");
    setHighlightImage(null);
  };

  return (
    <div className="m-4 w-[80%] mx-auto">

      <header className="flex flex-row justify-between items-center my-4">
        <div className="text-2xl m-2">Products</div>

        <div className="flex flex-row justify-end my-4">
          <button
            type="button"
            className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100"
            onClick={() => {
              setAddProductModal(true);
              resetProductForm()
              console.log("addProductsModal", addProductsModal)
            }}
          >
            Add new Product
          </button>
          {/* <button
            type="button"
            className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100"
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
          >
            Logout
          </button> */}
          <button
            type="button"
            className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100"
            onClick={() => {
              router.push(`/store?shop=${shopid}`);
            }}
          >
            Customer Portal
          </button>

          <button
            className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100"
            onClick={() => siteSettings()}> Site Settings
          </button>
        </div>
      </header>
      

      {submitError && (
        <p className="text-red-600 mb-2 text-sm max-w-md">
          {submitError}
        </p>
      )}

      {loadingProducts && (
        <p>Loading products...</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
        {/* Existing product cards */}
        {products.length === 0 ? (
          <p className="text-sm text-gray-500 self-center">
            No products added yet. Use the first card to add one.
          </p>
        ) : (
          products.map((product: any) => (
            <Card
              key={product.productid}
              product={product}
              mode="admin"
              onDelete={() => { setDeleteId(product.productid); setShowDeleteModal(true) }}
              onEdit={() => { startEditingProduct(product); setAddProductModal(true) } }
            />
          ))
        )}
      </div>

      {addProductsModal &&
        <Modal show={addProductsModal} centered>
          <Modal.Header><Modal.Title>{editingProductId ? "Edit product" : "Add a product"}</Modal.Title></Modal.Header>
          <Modal.Body>
              <div className="rounded-md p-4 flex flex-col h-full w-full">
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
                  className="p-2 mt-3 border border-gray-300 rounded-md text-sm opacity-50"
                  type="text"
                  value={productid}
                  placeholder="Enter Product ID"
                  disabled
                />

                <textarea
                  className="p-2 mt-3 border border-gray-300 rounded-md text-sm"
                  name="Description"
                  placeholder="Enter Product Description"
                  rows={4}
                  maxLength={150}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/150 characters
                </p>

                <label className="mt-3 text-xs font-medium text-gray-700">
                  Upload Highlight Image <span className="text-red-700">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  className="p-2 mt-1 border border-gray-300 rounded-md text-sm"
                  name="highlightimage"
                  placeholder="Upload Highlight Image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setHighlightImage(e.target.files?.[0] || null)
                  }
                />
              </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-2 mt-3">
              <button
                className="px-4 py-2 border border-gray-400 rounded-md text-sm"
                type="button"
                onClick={() => {
                  resetProductForm
                  setAddProductModal(false);
                }
                }
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-md text-sm disabled:opacity-60"
                onClick={handleSubmitProduct}
                type="button"
                disabled={
                  submitting ||
                  !productid ||
                  !productName ||
                  (!editingProductId && !highlightimage)
                }
              >
                {editingProductId ? "Save changes" : "+ Add this product"}
              </button>



            </div>
          </Modal.Footer>
        </Modal>}

      {showDeleteModal && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete product</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              No
            </Button>
            <Button variant="danger" onClick={() => {
              setShowDeleteModal(false);
              handleDeleteProduct();
            }}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}

    </div>
  );
}

