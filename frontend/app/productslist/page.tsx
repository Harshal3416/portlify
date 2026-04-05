"use client";

import { useEffect, useState } from "react";
import Card from "../components/ui/card";
import { LuShoppingCart } from "react-icons/lu";
import { useGetProductsQuery } from "@/hooks/useProductMutation";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { renderImage } from "../lib/renderImage";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { useSiteDetails } from "../context/siteContext";
import { CartData, Product } from "../interfaces/interface";

export default function ProductList() {

    const searchParams = useSearchParams();
    const tenantidFromUrl = searchParams.get('tenantid');

    const { data: products = [], isLoading: loadingProducts, error } = useGetProductsQuery(tenantidFromUrl);

    // const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cartCount, setCartCount] = useState(1);
    const itemsPerPage = 20; // show 5 items per page

    const [isCartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartData[]>([])

    const siteDetails = useSiteDetails();
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
    if (siteDetails?.contactphone) {
        setPhoneNumber(siteDetails.contactphone);
    }
    }, [siteDetails]);

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
        if (!phoneNumber) {
            alert("Phone number not available");
            return;
        }
        let itemDetails = ''
        cartItems.map((item) => {
            itemDetails += `\n Product Name: ${item.name} - Product ID: ${item.productid} - Count: ${item.count}`
        })
        console.log("itemDetails", itemDetails)
        const message = "Hello, I would like to buy these products." + itemDetails + "\n";
        const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)} Thank You!`;
        window.open(url, "_blank");
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
        <div>
            <div className="gallery-header">
                <span className="section-title">Our Products</span>
                          <button className="cart-btn" onClick={openCart}>
            <span>🛒</span> Cart <span className="cart-badge">{cartCount}</span>
          </button>
                {/* <span className="section-count">{cartCount} item</span> */}
            </div>
            <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search products by name or ID…"
                />
            </div>
            <div className="gallery-grid">
                {paginatedProducts.map((product: any) => (
                    <Card
                        key={product.productid}
                        product={product}
                        mode="public"
                        cartUpdated={(count: number) => handleCart(count)}
                    />
                ))}
            </div>
            {/* <ProductList search={search} /> */}
            {isCartOpen && cartItems && cartItems.length > 0 && (
                <Modal show={isCartOpen} onHide={() => setCartOpen(false)} centered scrollable={true}>
                    <Modal.Header>
                        <Modal.Title>Cart</Modal.Title>
                                    <button className="modal-close" onClick={() => setCartOpen(false)}>✕</button>
                    </Modal.Header>
                    <Modal.Body>
                        {cartItems.map((item: CartData, index) => {
                            return (
                                <div key={index} className="flex flex-row items-center p-4">
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
                        <button className="btn-enquire" onClick={() => setCartOpen(false)}>
                            Save and Close
                        </button>
                        <button className="btn-add" onClick={() => {
                            setCartOpen(false);
                            contactOverWhatsapp();
                        }}>
                            Buy Now
                        </button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
        // <div className="flex flex-col my-10 border-t-2 border-gray-300 m-2 px-4 w-[80%] mx-auto">
        //     <header className="flex flex-row justify-between items-center my-4">
        //         <div className="text-2xl m-2">Gallery</div>

        //         <button className="flex flex-row items-center p-2 bg-black text-white rounded-md" onClick={openCart}>
        //             <span><LuShoppingCart /> </span><span className="m-2">{cartCount}</span>
        //         </button>
        //     </header>
        //     {products.length > 0 ? (
        //         <>
        //             <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
        //                 {paginatedProducts.map((product: any) => (
        //                     <Card
        //                         key={product.productid}
        //                         product={product}
        //                         mode="public"
        //                         cartUpdated={(count: number) => handleCart(count)}
        //                     />
        //                 ))}
        //             </div>
        //             {/* Pagination Controls */}
        //             {/* <div className="flex justify-center items-center mt-8 space-x-2">
        //                 <button
        //                     onClick={() => handlePageChange(currentPage - 1)}
        //                     disabled={currentPage === 1}
        //                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        //                 >
        //                     Previous
        //                 </button>
        //                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        //                     <button
        //                         key={page}
        //                         onClick={() => handlePageChange(page)}
        //                         className={`px-4 py-2 rounded-md ${page === currentPage
        //                                 ? 'bg-blue-500 text-white'
        //                                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        //                             }`}
        //                     >
        //                         {page}
        //                     </button>
        //                 ))}
        //                 <button
        //                     onClick={() => handlePageChange(currentPage + 1)}
        //                     disabled={currentPage === totalPages}
        //                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        //                 >
        //                     Next
        //                 </button>
        //             </div> */}
        //         </>
        //     ) : (
        //         <p>No products available.</p>
        //     )}

            
        // </div>
    );
}