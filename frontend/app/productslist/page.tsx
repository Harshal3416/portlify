"use client";

import { useEffect, useState } from "react";
import Card from "../components/ui/card";
import { LuShoppingCart } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { useGetProductsQuery } from "@/hooks/useProductMutation";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { renderImage } from "../lib/renderImage";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

interface Product {
    productid: string;
    name?: string;
    description?: string;
    // highlightimage may be:
    // - a File/Blob client‑side (used when previewing before upload)
    // - a string URL returned by the server
    // - a metadata object returned by your API (e.g. { filename, size, url })
    highlightimage?: Blob | string | { filename: string; size: number; url?: string } | null;
}

interface CartData {
    productid: string,
    name: string,
    image: Blob | string | { filename: string; size: number; url?: string } | null,
    count: number
}

export default function ProductList() {

    const { user } = useAuth();
    const { data: products = [], isLoading: loadingProducts, error } = useGetProductsQuery(user?.shopid);

    // const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cartCount, setCartCount] = useState(1);
    const itemsPerPage = 20; // show 5 items per page

    const [isCartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartData[]>([])

    useEffect(() => {
        // get product details and filter from local storage
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        const productids = products.map((item: Product) => item.productid);
        console.log("Product ids", productids, products)
        const x = items.filter((item: CartData) => {
            productids.includes(item.productid)
        })
        console.log("items", items, x)
        handleCart(items.length);
    })

    // Calculate pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

    // const handlePageChange = (page: number) => {
    //     if (page < 1 || page > totalPages) return;
    //     setCurrentPage(page);
    // };

    const openCart = () => {
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems([...items]);  // Fresh copy
        setCartOpen(true);
    }

    const handleCart = (count: number) => {
        console.log("handleCart", count)
        setCartCount(count)
    }

    const contactOverWhatsapp = () => {
        console.log("Whatsapp")
    }

    const handleItemCount = (id: string, action: string) => {
        if (!isCartOpen) return;
        
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        const index = items.findIndex((item: CartData) => item.productid === id);
        if (index !== -1) {
            if (action === 'delete') {
                items.splice(index, 1);
            } else {
                items[index].count = action === 'add' ? items[index].count + 1 : Math.max(0, items[index].count - 1);
            }
        }
        const totalCount = items.reduce((sum: number, item: CartData) => sum + item.count, 0);
        localStorage.setItem('cart', JSON.stringify(items));
        setCartItems([...items]);  // Update modal display immediately
        handleCart(totalCount);
        setCartCount([...items].length)
        console.log("Updated cart total:", totalCount, items);
    }

    return (
        <div className="flex flex-col my-10 border-t-2 border-gray-300 m-2 px-4 w-[80%] mx-auto">
            <header className="flex flex-row justify-between items-center my-4">
                <div className="text-2xl m-2">Gallery</div>

                <button className="flex flex-row items-center p-2 bg-black text-white rounded-md" onClick={openCart}>
                    <span><LuShoppingCart /> </span><span className="m-2">{cartCount}</span>
                </button>
            </header>
            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {paginatedProducts.map((product: any) => (
                            <Card
                                key={product.productid}
                                product={product}
                                mode="public"
                                cartUpdated={(count: number) => handleCart(count)}
                            />
                        ))}
                    </div>
                    {/* Pagination Controls */}
                    {/* <div className="flex justify-center items-center mt-8 space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-md ${page === currentPage
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                        >
                            Next
                        </button>
                    </div> */}
                </>
            ) : (
                <p>No products available.</p>
            )}

            {isCartOpen && cartItems && cartItems.length > 0 && (
                <Modal show={isCartOpen} onHide={() => setCartOpen(false)} centered scrollable={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {cartItems.map((item: CartData, index) => {
                            return (
                                <div key={index} className="flex flex-row items-center border-1 border-gray-200 p-4">
                                    <span className="w-50">{item.name}:</span> <span> {renderImage(item.image, true)}</span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleItemCount(item.productid, 'add')}
                                            className="px-3 py-1 rounded-md hover:text-green-600"
                                        >
                                            <IoMdAddCircleOutline />
                                        </button>

                                        <span className="px-4 py-1 mr-0 border border-gray-300 rounded-md bg-white">
                                            {item.count}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleItemCount(item.productid, 'remove')}
                                            disabled={item.count === 1}
                                            className="px-3 py-1 rounded-md hover:text-red-600"
                                        >
                                            <IoRemoveCircleOutline />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleItemCount(item.productid, 'delete')}
                                            className="py-1 rounded-md hover:text-red-600"
                                        >
                                            <MdDeleteOutline />
                                        </button>
                                    </div>

                                </div>
                            )
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setCartOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => {
                            setCartOpen(false);
                            contactOverWhatsapp();
                        }}>
                            Buy Now
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}