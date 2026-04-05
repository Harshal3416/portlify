"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/components/ui/Card";
import { useCreateProduct, useDeleteProduct, useGetProductsQuery, useUpdateProduct } from "@/hooks/useProductMutation";
import { useToast } from "@/app/context/ToastContext";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getAdminDetails } from "@/services/settingsService";
import { renderImage } from "@/app/lib/renderImage";
import { Product } from "@/app/interfaces/interface";

export default function Products() {
  const router = useRouter();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const { showToast } = useToast();
  const [tenantid, setTenantid] = useState('');

  // Use React Query for fetching products - simplifies data fetching with caching
  // Returns data, loading state, error, and refetch function
  const { data: products = [], isLoading: loadingProducts, error } = useGetProductsQuery(tenantid);

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
    fetchAdminDetails()
    setProductId(generateProductId());
  }, []);

  async function fetchAdminDetails() {
    try {
      const data = await getAdminDetails();
      setTenantid(data.tenantid)
    } catch (err: any) {
      showToast(err.message, "danger");
    }
  }

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
    form.append("tenantid", tenantid);

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
          // remove from cart
          const remainingProducts = JSON.parse(localStorage.getItem("cart") || "[]").filter((el: any) => {
            return el.productid !== productid
          })
          showToast(`${data.name || 'Product'} Deleted!`, "success")
          setShowDeleteModal(false)
          localStorage.setItem('cart', JSON.stringify(remainingProducts))
        },
        onError: (err) => {
          showToast(err.message, "danger");
        }
      }
    )
  }

  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.productid);
    setProductName(product.name || "");
    setProductId(product.productid || "");
    setDescription(product.description || "");
    setHighlightImage(null);
  };

  return (
    <div className="m-4 w-[80%] mx-auto">
      <div className="page-header">
        <div>
          <div className="page-title">Products</div>
          <div className="page-subtitle">Manage your product catalog</div>
        </div>
        <button className="add-btn"
          onClick={() => {
            setAddProductModal(true);
            resetProductForm()
            console.log("addProductsModal", addProductsModal)
          }}>+ Add New Product</button>
      </div>

      {/* <!-- Stats --> */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue">📦</div>
          <div><div className="stat-num">{products.length}</div><div className="stat-label">Total Products</div></div>
        </div>
      </div>

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
              onEdit={() => { startEditingProduct(product); setAddProductModal(true) }}
            />
          ))
        )}
      </div>

      {addProductsModal &&
        <Modal show={addProductsModal} centered>
          <Modal.Header>
            <Modal.Title>{editingProductId ? "Edit product" : "Add a product"}
            </Modal.Title>
            <button className="modal-close" onClick={() => {
              resetProductForm
              setAddProductModal(false);
            }
            }>✕</button>
          </Modal.Header>
          <Modal.Body>
            <div className="field-group">
              <label className="field-label">Product Name <span className="text-red-500">*</span></label>
              <input className="field-input" type="text" id="productName" placeholder="e.g. Prestige Pressure Cooker" value={productName}
                onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Product ID</label>
              <input className="field-input" type="text" value={productid} disabled />
              <span className="field-hint">Auto-generated — cannot be changed</span>
            </div>
            <div className="field-group">
              <label className="field-label">Description <span className="text-red-500">*</span></label>
              <textarea className="field-input" id="productDesc" placeholder="Describe the product..." value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea>
              <div className="char-count" id="charCount">18/150 characters</div>
            </div>
            <div className="field-group">
              <label className="field-label">Product Image</label>
              <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                {/* If image is selected, use renderImage method which will render the image or else show the default image 🖼️ */}
                <div className="upload-area-icon">{renderImage(highlightimage, true)}</div>
                <p>Click to upload or drag & drop</p>
                <span>PNG, JPG, WEBP · Max 5MB</span>
                <input type="file" id="imgUpload" className="hidden"
                  ref={fileInputRef} name="highlightimage"
                  accept="image/*"
                  onChange={(e) =>
                    setHighlightImage(e.target.files?.[0] || null)
                  } />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {/* <div className="modal-footer"> */}
            <button className="btn-cancel" onClick={() => {
              resetProductForm
              setAddProductModal(false);
            }
            }>Cancel</button>
            <button className="btn-save" onClick={handleSubmitProduct} disabled={
              submitting ||
              !productid ||
              !productName ||
              (!editingProductId && !highlightimage)
            }
            >💾 Save Changes</button>
          </Modal.Footer>
        </Modal>}

      {showDeleteModal && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header>
            <Modal.Title>Delete product</Modal.Title>
            <button className="modal-close" onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(false);
            }
            }>✕</button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
          <Modal.Footer>
            <button className="btn-enquire" onClick={() => setShowDeleteModal(false)}>
              No
            </button>
            <button className="btn-remove" onClick={() => {
              setShowDeleteModal(false);
              handleDeleteProduct();
            }}>
              Yes, Delete
            </button>
          </Modal.Footer>
        </Modal>
      )}

    </div>
  );
}

