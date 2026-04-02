"use client";

import About from "@/app/about/page";
import Contact from "@/app/components/ui/contact";
import OpeningHours from "@/app/components/ui/openinghours";
import ProductList from "@/app/productslist/page";
import { useState } from "react";
import { Hero } from "../components/Hero";

export default function Store() {
  const [search, setSearch] = useState("");

  return (
    <>
      <Hero />
      <main>
        <ProductList />
        <aside className="sidebar">
          <About />
          <Contact />
          <OpeningHours />
        </aside>
      </main>
    </>
  );
}
