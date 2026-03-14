"use client";

import { useEffect, useState } from "react";
import Card from "../components/ui/card";
import { LuShoppingCart } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { useGetProductsQuery } from "@/hooks/useProductMutation";

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

export default function ProductList() {
    
    const { user } = useAuth();
    const { data: products = [], isLoading: loadingProducts, error } = useGetProductsQuery(user?.shopid);
    
    // const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cartCount, setCartCount] = useState(0);
    const itemsPerPage = 20; // show 5 items per page

    useEffect(() => {
        handleCart()
    })

    // useEffect(() => {
    //     console.log("PRODUCTLIST page")
    //     // Fetch products from the backend API
    //     fetch(`http://localhost:3000/api/products?shopid=${user?.shopid}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log('Fetched products:', data);
    //             // show newest products first
    //             const list = (data.data || []).slice().reverse();
    //             setProducts(list);
    //             // always start from first page when data changes
    //             setCurrentPage(1);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching products:', error);
    //         });

    //         setCartCount(JSON.parse(localStorage.getItem("cart") || "[]").length);
    // }, []);

    // Calculate pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

    // const handlePageChange = (page: number) => {
    //     if (page < 1 || page > totalPages) return;
    //     setCurrentPage(page);
    // };

    const openCart = () => {
        alert("This is a placeholder for the cart! You have " + cartCount + " items in your cart.");
        // In a real app, you would navigate to the cart page or open a cart modal here.
    }

    const handleCart = () => {
        setCartCount(JSON.parse(localStorage.getItem("cart") || "[]").length)
    }

    return (
        <div className="flex flex-col my-10 border-t-2 border-gray-300 m-2 px-4 w-[80%] mx-auto">
            <header className="flex flex-row justify-between items-center m-4">
                <div className="text-2xl m-2">Gallery</div>

                <button className="px-4 py-2 bg-black text-white rounded-md" onClick={openCart}>
                    <span><LuShoppingCart /> </span><span className="m-2">{cartCount}</span>
                </button>
            </header>
            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {paginatedProducts.map((product:any) => (
                            <Card
                              key={product.productid}
                              product={product}
                              mode="public"
                              cartUpdated={handleCart}
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
        </div>
    );
}