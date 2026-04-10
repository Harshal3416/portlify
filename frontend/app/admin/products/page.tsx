"use client";

import { useEffect, useState, useRef } from "react";
import Card from "@/app/components/ui/Card";
import { useCreateProduct, useDeleteProduct, useGetProductsQuery, useUpdateProduct } from "@/hooks/useProductMutation";
import { useToast } from "@/app/context/ToastContext";
import Modal from 'react-bootstrap/Modal';
import { renderImage } from "@/app/lib/renderImage";
import { Collections } from "@/app/interfaces/interface";
import { useSiteDetails } from "@/app/context/siteContext";

export default function Products() {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const { showToast } = useToast();
  const { siteDetails } = useSiteDetails();
  
  const [tenantid, setTenantId] = useState('');

  // Use React Query for fetching items - simplifies data fetching with caching
  // Returns data, loading state, error, and refetch function
  const { data: items = [], isLoading: loadingProducts } = useGetProductsQuery(tenantid);

  // shared state for add / edit form
  const [itemname, setItemName] = useState("");
  const [itemid, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [highlightFiles, setHighlightFiles] = useState<File[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [addItemsModal, setAddProductModal] = useState(false);

  const generateProductId = () => {
    // Simple unique ID generator (for demo purposes only)
    const id = Math.floor(100000 + Math.random() * 900000) + '';
    if (items.find((p: any) => p.productId === id)) {
      return generateProductId(); // ensure uniqueness
    }
    return id;
  };

  useEffect(() => {
    setTenantId(siteDetails?.tenantid || '');
  }, [siteDetails])

  useEffect(() => {
    setProductId(generateProductId());
  }, []);

  useEffect(() => {
            console.log("ITEMS data", items)
  }, [items])

  const resetProductForm = () => {
    setItemName("");
    setProductId(generateProductId());
    setDescription("");
    setHighlightFiles([]);
    // Clear file input visually
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setEditingItemId(null);
  };

  const handleSubmitProduct = async () => {
    // Validate required fields
    if (!itemid || !itemname || !tenantid) {
      showToast("Item ID, name and tenantid are required", "danger");
      return;
    }

    console.log("Images", highlightFiles)

    const imageCount = highlightFiles.filter(f => f.type.startsWith('image/')).length;
    const videoCount = highlightFiles.filter(f => f.type.startsWith('video/')).length;

    if (imageCount === 0) {
      showToast("At least one image is required.", "warning");
      return;
    }

    if (imageCount > 5) {
      showToast("Maximum 5 images allowed.", "warning");
      return;
    }

    if (videoCount > 1) {
      showToast("Maximum 1 video allowed.", "warning");
      return;
    }

    highlightFiles.some(file => {
      if (file.size > 50 * 1024 * 1024) {
        showToast(`File ${file.name} is too large. Max size is 50MB.`, "warning");
        return true; // ✅ stop here
      }

      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        showToast(`File ${file.name} has invalid type. Only images and videos are allowed.`, "warning");
        return true;
      }

      if (file.type.startsWith('image/') &&
        highlightFiles.filter(f => f.type.startsWith('image/')).length > 5) {
        showToast("Maximum 5 images allowed.", "warning");
        return true;
      }

      if (file.type.startsWith('video/') &&
        highlightFiles.filter(f => f.type.startsWith('video/')).length > 1) {
        showToast("Maximum 1 video allowed.", "warning");
        return true;
      }

      if (file.type.startsWith('image/') &&
        !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        showToast(`File ${file.name} has invalid image format.`, "warning");
        return true;
      }

      if (file.type.startsWith('video/') && file.type !== 'video/mp4') {
        showToast(`File ${file.name} has invalid video format.`, "warning");
        return true;
      }

      return false;
    });

    const form = new FormData();

    // ✅ Updated field names
    form.append("itemid", itemid);
    form.append("itemname", itemname);
    form.append("description", description || "");
    form.append("tenantid", tenantid);

    // ✅ Files remain same (backend expects itemassets)
    highlightFiles.forEach((file) => {
      form.append("itemassets", file);
    });

    try {
      if (editingItemId) {
        await updateMutation.mutateAsync({
          id: editingItemId,
          formData: form,
        });
      } else {
        await createMutation.mutateAsync(form);
      }

      showToast(`Item saved successfully!`, "success");
      resetProductForm();

    } catch (err: any) {
      setSubmitError(err?.message || "Failed to save item");
    }
  };

  const handleDeleteProduct = async () => {
    const itemid = deleteId;
    deleteMutation.mutate(
      {
        itemid
      },
      {
        onSuccess: (data) => {
          // remove from cart
          const remainingProducts = JSON.parse(localStorage.getItem("cart") || "[]").filter((el: any) => {
            return el.productId !== itemid
          })
          showToast(`${data.name || 'Item'} Deleted!`, "success")
          setShowDeleteModal(false)
          localStorage.setItem('cart', JSON.stringify(remainingProducts))
        },
        onError: (err) => {
          showToast(err.message, "danger");
        }
      }
    )
  }

  const startEditingProduct = (items: Collections) => {
    setEditingItemId(items.itemid || null);
    setItemName(items.itemname || "");
    setProductId(items.itemid || "");
    setDescription(items.description || "");
    setHighlightFiles([]);
  };

  return (
    <div className="m-4 w-[80%] mx-auto">
      <div className="page-header">
        <div>
          <div className="page-title">Collection</div>
          <div className="page-subtitle">Manage your collection here</div>
        </div>
        <button className="add-btn"
          onClick={() => {
            setAddProductModal(true);
            resetProductForm()
            console.log("addItemsModal", addItemsModal)
          }}>+ Add New Item</button>
      </div>

      {/* <!-- Stats --> */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue">📦</div>
          <div><div className="stat-num">{items.length}</div><div className="stat-label">Total Products</div></div>
        </div>
      </div>

      {submitError && (
        <p className="text-red-600 mb-2 text-sm max-w-md">
          {submitError}
        </p>
      )}

      {loadingProducts && (
        <p>Loading items...</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
        {/* Existing product cards */}
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 self-center">
            No items added yet. Use the first card to add one.
          </p>
        ) : (
          items.map((items: any) => (
            <Card
              key={items.itemid}
              collection={items}
              mode="admin"
              onDelete={() => { setDeleteId(items.itemid); setShowDeleteModal(true) }}
              onEdit={() => { startEditingProduct(items); setAddProductModal(true) }}
            />
          ))
        )}
      </div>

      {addItemsModal &&
        <Modal show={addItemsModal} centered>
          <Modal.Header>
            <Modal.Title>{editingItemId ? "Edit product" : "Add a product"}
            </Modal.Title>
            <button className="modal-close" onClick={() => {
              resetProductForm
              setAddProductModal(false);
            }
            }>✕</button>
          </Modal.Header>
          <Modal.Body>
            <div className="field-group">
              <label className="field-label">Item Name <span className="text-red-500">*</span></label>
              <input className="field-input" type="text" id="itemname" placeholder="e.g. Prestige Pressure Cooker" value={itemname}
                onChange={(e) => setItemName(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Item ID</label>
              <input className="field-input" type="text" value={itemid} disabled />
              <span className="field-hint">Auto-generated — cannot be changed</span>
            </div>
            <div className="field-group">
              <label className="field-label">Description <span className="text-red-500">*</span></label>
              <textarea className="field-input" id="productDesc" placeholder="Describe the product..." value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea>
              <div className="char-count" id="charCount">18/150 characters</div>
            </div>
            <div className="field-group">
              <label className="field-label">Item Image</label>
              <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                <div className="upload-area-icon">
                  {highlightFiles.length > 0 ? (
                    highlightFiles.map((file, i) => (
                      file.type.startsWith('image/') ? (
                        <img key={i} src={URL.createObjectURL(file)} alt="" className="w-10 h-10 inline mr-1" />
                      ) : (
                        <span key={i} className="inline mr-1">🎥</span>
                      )
                    ))
                  ) : '📁'}
                </div>
                <p>Click to upload or drag & drop</p>
                <span>PNG, JPG, WEBP, MP4 · Max 5 images, 1 video</span>
                <input type="file" id="imgUpload" className="hidden"
                  ref={fileInputRef} name="itemassets"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const images = files.filter(f => f.type.startsWith('image/'));
                    const videos = files.filter(f => f.type.startsWith('video/'));
                    if (images.length > 5) {
                      setSubmitError("Maximum 5 images allowed");
                      return;
                    }
                    if (videos.length > 1) {
                      setSubmitError("Maximum 1 video allowed");
                      return;
                    }
                    setSubmitError(null);
                    setHighlightFiles(files);
                  }} />
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
              !itemid ||
              !itemname ||
              (!editingItemId && highlightFiles.length === 0)
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

