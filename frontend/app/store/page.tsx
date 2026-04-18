"use client";

import About from "@/app/about/page";
import ProductList from "@/app/productslist/page";
import { useState } from "react";
import { Hero } from "../components/ui/Hero";
import Contact from "../components/ui/Contact";
import OpeningHours from "../components/ui/Openinghours";

export default function Store() {

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
