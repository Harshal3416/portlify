"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/context/ToastContext";
import Modal from 'react-bootstrap/Modal';
import { renderImage } from "@/app/lib/renderImage";
import { useSiteDetails } from "@/app/context/siteContext";
import { CardProps, CartData } from "@/app/interfaces/interface";

export default function Card({
    product,
    mode = "preview",
    onDelete,
    onEdit,
    whatsappNumber,
    cartUpdated
}: CardProps) {

    const canDelete = mode === "admin" && !!onDelete;
    const canEdit = mode === "admin" && !!onEdit;
    const showEnquire = mode === "public";

    const [availableInCart, setAvailableInCart] = useState(false)
    const [showProductDetails, setShowProductDetails] = useState(false);
    const { showToast } = useToast();

      const siteDetails = useSiteDetails();
      const [phoneNumber, setPhoneNumber] = useState("");
    
      useEffect(() => {
        if (siteDetails?.contactphone) {
          setPhoneNumber(siteDetails.contactphone);
        }
      }, [siteDetails]);

    const openWhatsappForProduct = () => {
        const message = `Hello, I would like to enquire about "${product.name || "-"}" (ID: ${product.productid || "-"}). Description: ${product.description || "-"}`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    useEffect(() => {
        setAvailableInCart(isProductExistInCart);
    })

    const getCartFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem("cart") || "[]");
    }

    const addToCart = () => {
        const existingCartLS = getCartFromLocalStorage();
        existingCartLS.push({
            productid: product.productid,
            name: product.name,
            image: product.highlightimage,
            count: 1
        });
        localStorage.setItem("cart", JSON.stringify(existingCartLS));
        setAvailableInCart(true)
        showToast(`${product.name || 'Product'} added to cart!`, "success")
        cartUpdated && cartUpdated(existingCartLS.length)
    }

    const isProductExistInCart = () => {
        const x = getCartFromLocalStorage().find((el: CartData) => el.productid === product.productid);
        return x ? true : false
    }

    const removeFromCart = () => {
        const remainingProducts = getCartFromLocalStorage().filter((el: CartData) => {
            return el.productid !== product.productid
        })
        setAvailableInCart(false)
        localStorage.setItem('cart', JSON.stringify(remainingProducts))
        showToast(`${product.name || 'Product'} removed from cart!`, "success")
        cartUpdated && cartUpdated(remainingProducts.length)
    }

    return (
        <div className="product-card">
            <div className="product-img" onClick={() => setShowProductDetails(true)}>
                {renderImage(product.highlightimage, false)}<span className="product-badge">{availableInCart ? 'In Cart' : 'Available'}</span></div>
            <div className="product-info">
                <div className="product-name">{product.name || "-"}</div>
                <div className="product-id">ID: {product.productid || "-"}</div>
                <div className="product-desc">{product.description || "-"}</div>
                <div className="product-actions">
                    {canEdit ? (
                        <>
                            <button className="btn-enquire" onClick={() => onEdit && onEdit(product)}>✏️ Edit</button>
                            <button className="btn-remove" onClick={() => onDelete && onDelete(product.productid)}>🗑 Delete</button>
                        </>
                    ) : (
                        <>
                            <button className="btn-enquire" onClick={openWhatsappForProduct}>💬 Enquire</button>
                            {availableInCart ?
                                <button className="btn-remove" onClick={removeFromCart}>🗑 Remove</button> :
                                <button className="btn-add" onClick={addToCart}>🛒 Add</button>
                            }
                        </>
                    )}
                </div>
            </div>

            {showProductDetails && (
                <Modal show={showProductDetails} centered>
                    <Modal.Header>
                        <Modal.Title>{product.name}</Modal.Title>
                        <button className="modal-close" onClick={(e) => {
                            e.stopPropagation();
                            setShowProductDetails(false);
                        }
                        }>✕</button>
                    </Modal.Header>
                    <Modal.Body>
                        {product.description}
                        {renderImage(product.highlightimage, false)}
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn-save"
                            disabled={canDelete || canEdit}
                            onClick={() => availableInCart ? removeFromCart() : addToCart()}>
                            {availableInCart ? 'Remove From cart' : 'Add to cart'}
                        </button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
