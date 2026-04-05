export interface SiteDetail {
    ownertitle: string;
    aboutowner: string;
    tenantid: string;
    tenantdomain: string;
    sitesubtitle: string;
    trustedtagline: string;
    shoptype: string;
    shortdescription: string;
    yearsofexperience: string;
    productssold: string;
    happyclients: string;
    sitetitle: string;
    sitelogourl?: { filename: string; size: number; url?: string } | string | null;
    ownername?: string;
    sitedescription?: string;
    contactemail?: string;
    contactphone?: string;
    alternatecontactphone?: string;
    address?: string;
    instagramurl?: string;
    googlemapurl?: string;
    justdialurl?: string;
    gmapLink?: string;
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
}

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

export type CardMode = "public" | "admin" | "preview";

export interface CardProps {
    product: Product;
    mode?: CardMode;
    onDelete?: (productid: string) => void;
    onEdit?: (product: Product) => void;
    whatsappNumber?: string;
    cartUpdated?: (count: number) => void;
}

export interface CartData {
    productid: string,
    name: string,
    image: Blob | string | { filename: string; size: number; url?: string } | null,
    count: number
}