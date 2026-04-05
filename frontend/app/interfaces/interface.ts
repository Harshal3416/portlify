export interface SiteDetail {
    tenantid: string;
    tenantdomain: string;
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