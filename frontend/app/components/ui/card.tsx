"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/context/ToastContext";
import Modal from 'react-bootstrap/Modal';
import { renderImage } from "@/app/lib/renderImage";
import { useSiteDetails } from "@/app/context/siteContext";
import { CardProps, CartData } from "@/app/interfaces/interface";

export default function Card({
    collection,
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
        const message = `Hello, I would like to enquire about "${collection.itemname || "-"}" (ID: ${collection.itemid || "-"}). Description: ${collection.description || "-"}`;
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
            productId: collection.itemid,
            name: collection.itemname,
            image: collection.imageassets,
            count: 1
        });
        localStorage.setItem("cart", JSON.stringify(existingCartLS));
        setAvailableInCart(true)
        showToast(`${collection.itemname || 'Product'} added to cart!`, "success")
        cartUpdated && cartUpdated(existingCartLS.length)
    }

    const isProductExistInCart = () => {
        const x = getCartFromLocalStorage().find((el: CartData) => el.itemid === collection.itemid);
        return x ? true : false
    }

    const removeFromCart = () => {
        const remainingProducts = getCartFromLocalStorage().filter((el: CartData) => {
            return el.itemid !== collection.itemid
        })
        setAvailableInCart(false)
        localStorage.setItem('cart', JSON.stringify(remainingProducts))
        showToast(`${collection.itemname || 'Product'} removed from cart!`, "success")
        cartUpdated && cartUpdated(remainingProducts.length)
    }

    return (
        <div className="product-card">
            <div className="product-img" onClick={() => setShowProductDetails(true)}>
                {collection.imageassets && renderImage(collection.imageassets.images[0], false)}
                <span className="product-badge">{availableInCart ? 'In Cart' : 'Available'}</span></div>
            <div className="product-info">
                <div className="product-name">{collection.itemname || "-"}</div>
                <div className="product-id">ID: {collection.itemid || "-"}</div>
                <div className="product-desc">{collection.description || "-"}</div>
                <div className="product-actions">
                    {canEdit ? (
                        <>
                            <button className="btn-enquire" onClick={() => onEdit && onEdit(collection)}>✏️ Edit</button>
                            <button className="btn-remove" onClick={() => onDelete && onDelete(collection.itemid)}>🗑 Delete</button>
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
                        <Modal.Title>{collection.itemname}</Modal.Title>
                        <button className="modal-close" onClick={(e) => {
                            e.stopPropagation();
                            setShowProductDetails(false);
                        }
                        }>✕</button>
                    </Modal.Header>
                    <Modal.Body>
                        {collection.description}
                        {renderImage(collection.imageassets, false)}
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
