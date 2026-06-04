"use client";

import { useEffect, useState, Suspense } from "react";
import { useGetProductsQuery } from "@/hooks/useProductMutation";
import { renderImage } from "../lib/renderImage";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { useSiteDetails } from "../context/siteContext";
import { CartData, Collections } from "../interfaces/interface";
import Card from "../components/ui/Card";

function ProductListContent() {
    const searchParams = useSearchParams();
    const tenantidFromUrl = searchParams.get('tenantid');

    let { data: products = [], isLoading: loadingProducts, error } = useGetProductsQuery(tenantidFromUrl);

    const [currentPage, setCurrentPage] = useState(1);
    const [cartCount, setCartCount] = useState(1);
    const itemsPerPage = 20; // show 5 items per page

    const [isCartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartData[]>([])

    const siteDetails = useSiteDetails().siteDetails;
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        // get product details and filter from local storage
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        const productids = products.map((item: Collections) => item.itemid);
        console.log("Product ids", productids, products, products.itemassets?.images[0])
        const x = items.filter((item: CartData) => {
            productids.includes(item.itemid)
        })
        console.log("items", items, x)
        handleCart(items.length);
    })

    // Calculate pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    // const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

    // const handlePageChange = (page: number) => {
    //     if (page < 1 || page > totalPages) return;
    //     setCurrentPage(page);
    // };

    useEffect(() => {
        console.log("Products in ProductList", products);
        const filtered = products.filter((product: Collections) => {
            const searchLower = searchText.toLowerCase();
            return (
                product.itemname?.toLowerCase().includes(searchLower) ||
                product.itemid.toLowerCase().includes(searchLower)
            );
        });
        products = [...filtered];
        console.log("Filtered products", filtered, products);
    }, [searchText]);

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
        if (!siteDetails?.contactphone) {
            alert("Phone number not available");
            return;
        }
        let itemDetails = ''
        cartItems.map((item) => {
            itemDetails += `\n Product Name: ${item.itemname} - Product ID: ${item.itemid} - Count: ${item.count}`
        })
        console.log("itemDetails", itemDetails)
        const message = "Hello, I would like to buy these products." + itemDetails + "\n";
        const url = `https://wa.me/${siteDetails?.contactphone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)} Thank You!`;
        window.open(url, "_blank");
    }

    const handleItemCount = (id: string, action: string) => {
        if (!isCartOpen) return;

        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        const index = items.findIndex((item: CartData) => item.itemid === id);
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

    useEffect(() => {
        if (!isCartOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    return (
        <div>
            <div className="gallery-header">
                <span className="section-title">Our Gallery</span>
                <button className="cart-btn" onClick={openCart}>
                    <span>🛒</span> Cart <span className="cart-badge">{cartCount}</span>
                </button>
            </div>
            <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search products by name or ID…"
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                {products.map((colection: any) => (
                    <Card
                        key={colection.itemid}
                        collection={colection}
                        mode="public"
                        cartUpdated={(count: number) => handleCart(count)}
                    />
                ))}
            </div>
            {/* <ProductList search={search} /> */}
            {isCartOpen && cartItems && cartItems.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-auto p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setCartOpen(false)}
                        aria-label="Close cart modal"
                    />
                    <div className="relative z-10 mt-[32%] sm:mt-0 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-[0_35px_80px_rgba(0,0,0,0.12)] ring-1 ring-black/10">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Cart</h2>
                            <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                                onClick={() => setCartOpen(false)}
                                aria-label="Close cart modal"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto">
                            {cartItems.map((item: CartData, index) => (
                                <div key={index} className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="min-w-[140px] text-sm font-medium text-slate-900">{item.itemname}</div>
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                            {renderImage(item.image, true)}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleItemCount(item.itemid, 'add')}
                                            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
                                        >
                                            <IoMdAddCircleOutline />
                                        </button>
                                        <span className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900">
                                            {item.count}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleItemCount(item.itemid, 'remove')}
                                            disabled={item.count === 1}
                                            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <IoRemoveCircleOutline />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleItemCount(item.itemid, 'delete')}
                                            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-rose-600"
                                        >
                                            <MdDeleteOutline />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end sm:items-center">
                            <button
                                type="button"
                                className="btn-enquire w-full rounded-full py-3 text-sm font-medium sm:w-auto"
                                onClick={() => setCartOpen(false)}
                            >
                                Save and Close
                            </button>
                            <button
                                type="button"
                                className="btn-add w-full rounded-full py-3 text-sm font-medium sm:w-auto"
                                onClick={() => {
                                    setCartOpen(false);
                                    contactOverWhatsapp();
                                }}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ProductList() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductListContent />
        </Suspense>
    );
}