"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { useToast } from "@/app/context/ToastContext";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { renderImage } from "@/app/lib/renderImage";
import { MdDeleteOutline } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { useSiteDetails } from "@/app/context/siteContext";

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
    cartUpdated?: (count: number) => void;
}

interface CartData {
    productid: string,
    name: string,
    image: Blob | string | { filename: string; size: number; url?: string } | null,
    count: number
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
            <div className="product-img">
                {renderImage(product.highlightimage, false)}<span className="product-badge">{availableInCart ? 'In Cart' : 'In Stock'}</span></div>
            <div className="product-info">
                <div className="product-name">{product.name || "-"}</div>
                <div className="product-id">ID: {product.productid || "-"}</div>
                <div className="product-desc">{product.description || "-"}</div>
                <div className="product-actions">
                    {canEdit ? (
                        <>
                            <button className="btn-enquire" onClick={() => onEdit && onEdit(product)}>💬 Edit</button>
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
        </div>
    );
}
{/* <div className="product-card">
            <div className="p-2 flex-1 flex flex-col" onClick={() => setShowProductDetails(true)}>
                <h4 className="text-xl font-bold mb-1">{product.name || "-"}</h4>
                <span className="inline-block text-gray-600 bg-gray-200 text-xs p-2 rounded-full mb-2">
                    Product ID: {product.productid || "-"}
                </span>
                <p className="text-gray-600 mb-2 text-sm line-clamp-3 min-h-[3.5rem]">
                    Product Description: {product.description || "-"}
                </p>
                <div className="mt-auto">
                    {renderImage(product.highlightimage, false)}
                </div>
            </div>
            {(canDelete || canEdit || showEnquire) && (
                <div className="mt-3 ">
                    {showEnquire && (
                            <ButtonGroup aria-label="Basic example" size="sm" className="w-full">
                                <Button className="d-flex flex-row flex-1 items-center justify-evenly" variant="outline-secondary" onClick={openWhatsappForProduct}><FaWhatsapp />Enquire
                                </Button>
                                <Button className="d-flex flex-row flex-1 items-center justify-evenly" variant="outline-secondary" onClick={() => availableInCart ? removeFromCart() : addToCart()}><LuShoppingCart />
                                {availableInCart ? 'Remove' : 'Add'}</Button>
                            </ButtonGroup>
                    )}
                    {canEdit && (
                        <ButtonGroup aria-label="Basic example" size="sm" className="w-full">
                            <Button className="d-flex flex-row flex-1 items-center justify-evenly" variant="outline-danger" onClick={() => onDelete && onDelete(product.productid)}><MdDeleteOutline />
                                Delete</Button>
                            <Button className="d-flex flex-row flex-1 items-center justify-evenly" variant="outline-secondary" onClick={() => onEdit && onEdit(product)}><TbEdit />Edit
                            </Button>
                        </ButtonGroup>
                    )}
                </div>
            )}

            {showProductDetails && (
                <Modal show={showProductDetails} onHide={() => setShowProductDetails(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{product.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {product.description}
                        {renderImage(product.highlightimage, false)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info"
                            disabled={canDelete || canEdit}
                            onClick={() => availableInCart ? removeFromCart() : addToCart()}>
                            {availableInCart ? 'Remove From cart' : 'Add to cart'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div> */}
