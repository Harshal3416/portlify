export const getSiteDetails = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/site-details');
        if (!response.ok) {
            throw new Error('Failed to fetch site details');
        }
        const data: SiteDetails = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching site details:', error);
        return null;
    }
};

interface SiteDetails {
    siteTitle: string;
    siteLogoUrl?: { filename: string; size: number; url?: string } | string;
    ownerName?: string;
    siteDescription?: string;
    contactEmail?: string;
    contactPhone?: string;
    alternateContactPhone?: string;
    address?: string;
    instagramUrl: string;
    googleUrl: string,
    justDialUrl: string;
    gmapLink: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
}
