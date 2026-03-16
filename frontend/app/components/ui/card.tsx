"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";

export interface Product {
    productid: string;
    name?: string;
    description?: string;
    // highlightimage can be:
    // - a Blob/File (while previewing before upload)
    // - a string path
    // - an object with a `url` field from the backend
    highlightimage?: Blob | string | { filename: string; size: number; url?: string } | null;
}

type CardMode = "public" | "admin" | "preview";

interface CardProps {
    product: Product;
    mode?: CardMode;
    onDelete?: (productid: string) => void;
    onEdit?: (product: Product) => void;
    whatsappNumber?: string;
    cartUpdated?: () => void;
}

interface CartData {
    productid: string,
    name: string
}

const DEFAULT_WHATSAPP_NUMBER = "9164735164"; // change to your business number

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

    const openWhatsappForProduct = () => {
        const number = whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
        const message = `Hello, I would like to enquire about "${product.name || "-"}" (ID: ${product.productid || "-"}). Description: ${product.description || "-"}`;
        const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    useEffect(() => {
        setAvailableInCart(isProductExistInCart);
    }, [])

    const getCartFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem("cart") || "[]");
    }

    // Todo: If the product is already in the cart, we can show "Remove from cart" instead of "Add to cart"
    // Add a cart option with items in cart count badge, and a simple popup to show items in cart with a order now option that leads to whatsapp with the list of products in the message.

    const addToCart = () => {
        const existingCartLS = getCartFromLocalStorage();
        existingCartLS.push({
            productid: product.productid,
            name: product.name,
        });
        localStorage.setItem("cart", JSON.stringify(existingCartLS));
        setAvailableInCart(true)
        cartUpdated && cartUpdated()
    }

    const renderImage = () => {
        if (!product.highlightimage) return null;

        const baseProps = {
            alt: product.name || "Product image",
            className: "w-full h-32 sm:h-36 md:h-40 object-contain rounded-md",
        };

        if (typeof product.highlightimage === "string") {
            return (
                <img
                    src={"http://localhost:3000" + product.highlightimage}
                    {...baseProps}
                />
            );
        }

        if (typeof product.highlightimage === "object" && "url" in product.highlightimage && product.highlightimage.url) {
            return (
                <img
                    src={"http://localhost:3000" + product.highlightimage.url}
                    {...baseProps}
                />
            );
        }

        return (
            <img
                src={URL.createObjectURL(product.highlightimage as Blob)}
                {...baseProps}
            />
        );
    };

    const isProductExistInCart = () => {
        const x = getCartFromLocalStorage().find((el:CartData) => el.productid === product.productid);
        return x ? true : false
    }

    const removeFromCart = () => {
        const remainingProducts = getCartFromLocalStorage().filter((el:CartData) => {
            return el.productid !== product.productid
        })
        setAvailableInCart(false)
        localStorage.setItem('cart', JSON.stringify(remainingProducts))
        cartUpdated && cartUpdated()
    }

    return (
        <span className="border border-gray-300 rounded-md pb-0 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div className="p-4 flex flex-col flex-1">
                <div className="flex-1 flex flex-col">
                    <h4 className="text-xl font-bold mb-1">{product.name || "-"}</h4>
                    <span className="inline-block text-gray-600 bg-gray-200 text-xs p-2 rounded-full mb-2">
                        Product ID: {product.productid || "-"}
                    </span>
                    <p className="text-gray-600 mb-2 text-sm line-clamp-3 min-h-[3.5rem]">
                        Product Description: {product.description || "-"}
                    </p>
                    <div className="mt-auto">
                        {renderImage()}
                    </div>
                </div>


            </div>
            {(canDelete || canEdit || showEnquire) && (
                <div className="mt-3 ">
                    {showEnquire && (
                        <div className="flex flec-row gap-0 px-1 mb-3 w-full">
                        <button
                            type="button"
                            onClick={openWhatsappForProduct}
                            className="px-1 py-1 w-full border-1   text-sm mt-3 hover:bg-green-500 hover:text-white transition-colors duration-300"
                        > <FaWhatsapp className="inline-block mr-2" />
                            Enquire now
                        </button>
                        <button
                            type="button"
                            onClick={ availableInCart ? removeFromCart : addToCart }
                            className="px-1 py-1 w-full border-1 border-l-0 text-sm mt-3 hover:bg-green-500 hover:text-white transition-colors duration-300"
                        ><LuShoppingCart /> 
                        {availableInCart ? 'Remove From cart' : 'Add to cart' }
                            
                        </button>
                        </div>
                    )}
                    {canEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit && onEdit(product)}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Edit
                        </button>
                    )}
                    {canDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete && onDelete(product.productid)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}
        </span>
    );
}
