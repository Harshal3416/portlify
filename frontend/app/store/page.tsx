import About from "@/app/about/page";
import Contact from "@/app/components/ui/contact";
import OpeningHours from "@/app/components/ui/openinghours";
import ProductList from "@/app/productslist/page";
import React from "react";

export default function Store() {

    return (
        <React.Fragment>
            <About />
            <Contact />
            <OpeningHours />
            <ProductList />
        </React.Fragment>
    )
}