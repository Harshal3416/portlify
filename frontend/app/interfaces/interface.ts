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

export interface Collections {
    itemid: string;
    itemname?: string;
    description?: string;
    tenantid?: string;
    imageassets?: { images: {filename: string; size: number; url?: string }[], videos: {filename: string; size: number; url?: string }[] };
    otherImages?: { filename: string; size: number; url?: string }[];
    videos?: { filename: string; size: number; url?: string }[];
    createdAt?: string;
}

export type CardMode = "public" | "admin" | "preview";

export interface CardProps {
    collection: Collections;
    mode?: CardMode;
    onDelete?: (itemid: string) => void;
    onEdit?: (item: Collections) => void;
    whatsappNumber?: string;
    cartUpdated?: (count: number) => void;
}

export interface CartData {
    itemid: string,
    itemname: string,
    image: Blob | string | { filename: string; size: number; url?: string } | null,
    count: number
}