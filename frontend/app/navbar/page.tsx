"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {

    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // compute options based on login state
    const navbarOptions = user
      ? [
          { name: "Add Product", href: "/addproduct" },
          { name: "Products", href: "/productslist" },
          { name: "Logout", href: "/login", onClick: () => { logout(); router.push("/login"); } },
        ]
      : [
          { name: "About Us", href: "/about" },
          { name: "Contact Details", href: "/contact" },
          { name: "Opening Hours", href: "/openinghours" },
          { name: "Products", href: "/productslist" },
          { name: "Register as new client", href: "/register" },
          { name: "Admin", href: "/admin" },
        ];


    return(
        <nav className="flex flex-col md:flex-row items-center justify-center p-4 border-b-2 border-gray-300 shadow-lg mb-10 fixed top-0 left-0 w-full bg-white z-50">
            {navbarOptions.map((option) => {
                const isActive = pathname === option.href;
                return (
                    <Link
                        key={option.name}
                        href={option.href}
                        onClick={option.onClick}
                        className={`p-4 text-black rounded-md m-3 hover:shadow-lg ${isActive ? 'shadow-lg' : ''} transition-all duration-300`}
                    >
                        <button>
                            {option.name}
                        </button>
                    </Link>
                );
            })}
        </nav>
    );
}