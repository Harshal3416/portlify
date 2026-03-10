export const getSiteDetails = async (shopid: string) => {
    try {
        const response = await fetch(`http://localhost:3000/api/site-details/${shopid}`);
        if (!response.ok) {
            throw new Error('Failed to fetch site details');
        }
        const data: SiteDetails = await response.json();
        console.log("FETCHED SITE DETAILS", data)
        return data.data[0];
    } catch (error) {
        console.error('Error fetching site details:', error);
        return null;
    }
};

interface SiteDetails {
    data: [{
    sitetitle: string;
    sitelogourl?: { filename: string; size: number; url?: string } | string;
    ownername?: string;
    sitedescription?: string;
    contactemail?: string;
    contactphone?: string;
    alternatecontactphone?: string;
    address?: string;
    instagramurl: string;
    googleurl: string,
    justdialurl: string;
    gmapLink: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    }]
}
