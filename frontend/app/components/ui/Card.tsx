"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/app/context/ToastContext";
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
    const [mounted, setMounted] = useState(false);
    const { showToast } = useToast();

    const siteDetails = useSiteDetails().siteDetails;

    const openWhatsappForProduct = () => {
        console.log("Opening WhatsApp for product with contact", siteDetails?.contactphone);
        const message = `Hello, I would like to enquire about "${collection.itemname || "-"}" (ID: ${collection.itemid || "-"}). Description: ${collection.description || "-"}`;
        const url = `https://wa.me/${siteDetails?.contactphone}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    useEffect(() => {
        setAvailableInCart(isProductExistInCart);
    })

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!showProductDetails) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [showProductDetails]);

    const getCartFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem("cart") || "[]");
    }

    const addToCart = () => {
        const existingCartLS = getCartFromLocalStorage();
        existingCartLS.push({
            itemid: collection.itemid,
            itemname: collection.itemname,
            image: collection.itemassets?.images[0] || null,
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
                {collection.itemassets && renderImage(collection.itemassets?.images[0], false)}
                <span className="product-badge">{availableInCart ? 'In Cart' : 'Available'}</span></div>
            <div className="product-info">
                {collection.price !== "" && <span className="price-badge">₹ {collection.price} /-</span>}
                <div className="product-name">{collection.itemname || "-"}</div>
                <div className="product-id">ID: {collection.itemid || "-"}</div>
                <div className="product-desc line-clamp-2">{collection.description || "-"}</div>
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

            {mounted && showProductDetails && createPortal(
                <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-auto p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        onClick={() => setShowProductDetails(false)}
                        aria-label="Close product details"
                    />
                    <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-[0_35px_80px_rgba(0,0,0,0.12)] ring-1 ring-black/10">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">{collection.itemname}</h2>
                                {collection.itemid && <p className="mt-1 text-sm text-slate-500">ID: {collection.itemid}</p>}
                            </div>
                            <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                                onClick={() => setShowProductDetails(false)}
                                aria-label="Close product details"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-6 p-6 max-h-[80vh] overflow-y-auto">
                            <p className="text-slate-700">{collection.description}</p>
                            <div className="space-y-4">
                                {collection.itemassets?.images?.length ? (
                                    <div className="grid gap-4">
                                        {collection.itemassets.images.map((img, index) => (
                                            img.url ? (
                                                <div key={`img-${index}`} className="overflow-hidden rounded-3xl bg-slate-100">
                                                    <img
                                                        src={process.env.NEXT_PUBLIC_BACKEND_URL + img.url}
                                                        alt={img.filename}
                                                        className="w-full object-cover"
                                                    />
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                ) : null}
                                {collection.itemassets?.videos?.length ? (
                                    <div className="space-y-4">
                                        {collection.itemassets.videos.map((vid, index) => (
                                            vid.url ? (
                                                <video key={`vid-${index}`} controls className="w-full rounded-3xl bg-slate-100">
                                                    <source src={process.env.NEXT_PUBLIC_BACKEND_URL + vid.url} type="video/mp4" />
                                                </video>
                                            ) : null
                                        ))}
                                    </div>
                                ) : null}
                                {!collection.itemassets?.images?.length && !collection.itemassets?.videos?.length && (
                                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                                        No media available.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
                            <button
                                className="btn-save w-full rounded-full py-3 text-sm font-medium sm:w-auto"
                                disabled={canDelete || canEdit}
                                onClick={() => availableInCart ? removeFromCart() : addToCart()}
                            >
                                {availableInCart ? 'Remove From cart' : 'Add to cart'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
