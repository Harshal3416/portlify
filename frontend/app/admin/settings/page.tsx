'use client';

import { useEffect, useState } from "react";

// export interface SiteDetails {
//     siteTitle: string;
//     siteLogoUrl: Blob | string | { filename: string; size: number; url?: string } | null;
//     ownerName: string;
//     siteDescription: string;
//     contactEmail: string;
//     phoneNumber: string;
//     alternatePhoneNumber: string;
//     address: string;
//     instagramUrl: string;
//     googleUrl: string;
//     justDialUrl: string;
//     openingHours: string;
// }

export default function Settings() {

    const [siteTitle, setSiteTitle] = useState("");
    const [siteLogoUrl, setSiteLogoUrl] = useState<File | null>(null);
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("");
    const [ownerName, setOwnerName] = useState("");
    const [siteDescription, setSiteDescription] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(""); 
    const [alternatePhoneNumber, setAlternatePhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [googleUrl, setGoogleUrl] = useState("");
    const [justDialUrl, setJustDialUrl] = useState("");
    const [openingHours, setOpeningHours] = useState({
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: ""
    });

    useEffect(() => {
        fetch('http://localhost:3000/api/site-details')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched site details:', data);
                setSiteTitle(data.siteTitle || "");
                // Set the current logo URL for display - backend returns object with url property
                if (data.siteLogoUrl && typeof data.siteLogoUrl === 'object' && data.siteLogoUrl.url) {
                    setCurrentLogoUrl(data.siteLogoUrl.url);
                } else {
                    setCurrentLogoUrl("");
                }
                setSiteLogoUrl(null);
                setOwnerName(data.ownerName || "");
                setSiteDescription(data.siteDescription || "");
                setContactEmail(data.contactEmail || "");
                setPhoneNumber(data.contactPhone || "");
                setAlternatePhoneNumber(data.alternateContactPhone || "");
                setAddress(data.address || "");
                setInstagramUrl(data.instagramUrl || "");
                setGoogleUrl(data.googleUrl || "");
                setJustDialUrl(data.justDialUrl || "");
                // Opening hours is now an object with individual days
                if (data.openingHours && typeof data.openingHours === 'object') {
                    setOpeningHours({
                        monday: data.openingHours.monday || "",
                        tuesday: data.openingHours.tuesday || "",
                        wednesday: data.openingHours.wednesday || "",
                        thursday: data.openingHours.thursday || "",
                        friday: data.openingHours.friday || "",
                        saturday: data.openingHours.saturday || "",
                        sunday: data.openingHours.sunday || ""
                    });
                } else {
                    setOpeningHours({
                        monday: "",
                        tuesday: "",
                        wednesday: "",
                        thursday: "",
                        friday: "",
                        saturday: "",
                        sunday: ""
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching site details:', error);
            });
    }, []);

    const updateSettings = () => {

        const file = siteLogoUrl;
        console.log("FILE", file);
        const form = new FormData();
        form.append('siteTitle', siteTitle);
        form.append('ownerName', ownerName);
        form.append('siteDescription', siteDescription);
        form.append('contactEmail', contactEmail);
        // Backend expects 'contactPhone' and 'alternateContactPhone'
        form.append('contactPhone', phoneNumber);
        form.append('alternateContactPhone', alternatePhoneNumber);
        form.append('address', address);
        form.append('instagramUrl', instagramUrl);
        form.append('googleUrl', googleUrl);
        form.append('justDialUrl', justDialUrl);
        
        // Append opening hours for each day
        form.append('monday', openingHours.monday);
        form.append('tuesday', openingHours.tuesday);
        form.append('wednesday', openingHours.wednesday);
        form.append('thursday', openingHours.thursday);
        form.append('friday', openingHours.friday);
        form.append('saturday', openingHours.saturday);
        form.append('sunday', openingHours.sunday);

        // Only append the logo file if a new file was selected
        if (file && file instanceof File) {
            form.append('siteLogoUrl', file);
        }

        console.log("Sending this", form, openingHours)

        fetch('http://localhost:3000/api/site-details', {
            method: 'POST',
            body: form,
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Server error: ${response.status} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Settings updated:', data);
            alert("Settings saved!");
            // Update the current logo if a new file was uploaded
            if (siteLogoUrl && data.data && data.data.siteLogoUrl) {
                setCurrentLogoUrl(data.data.siteLogoUrl.url);
            }
            // Clear the file input after successful save
            if (siteLogoUrl) {
                setSiteLogoUrl(null);
            }
        })
        .catch(error => {
            console.error('Error updating settings:', error);
            alert("Failed to save settings: " + error.message);
        });
    }

    // Render logo preview - shows current logo or newly selected file
    const renderLogoPreview = () => {
        // If a new file is selected, show preview of the new file
        if (siteLogoUrl && siteLogoUrl instanceof File) {
            return (
                <div className="mt-2">
                    <p className="text-sm text-gray-600">New logo preview:</p>
                    <img 
                        src={URL.createObjectURL(siteLogoUrl)} 
                        alt="New logo preview" 
                        className="w-32 h-32 object-contain rounded-md mt-1"
                    />
                </div>
            );
        }

        // If there's an existing logo URL, show it
        if (currentLogoUrl) {
            return (
                <div className="mt-2">
                    <p className="text-sm text-gray-600">Current logo:</p>
                    <img 
                        src={"http://localhost:3000" + currentLogoUrl} 
                        alt="Current logo" 
                        className="w-32 h-32 object-contain rounded-md mt-1"
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center w-[60%] mt-2 px-4 mx-auto">
            <h6 className="text-2xl mb-4">Site Settings</h6>
            
            {/* Site Title */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Site Title</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Site Title"
                    type="text"
                    placeholder="Enter Site Title"
                    maxLength={50}
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                />
            </div>

            {/* Site Logo URL */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Site Logo</label>
                <div className="w-2/3">
                    <input
                        className="p-2 border border-gray-300 rounded-md w-full"
                        name="Site Logo URL"
                        type="file"
                        placeholder="Enter Site Logo URL"
                        accept="image/*"
                        onChange={(e) => setSiteLogoUrl(e.target.files?.[0] || null)}
                    />
                    {/* Logo Preview - shows current logo or newly selected file */}
                    {renderLogoPreview()}
                </div>
            </div>

            {/* Owner Name */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Owner Name</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Owner Name"
                    type="text"
                    placeholder="Enter Owner Name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                />
            </div>

            {/* Site Description */}
            <div className="flex flex-row items-start w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium pt-2">Site Description</label>
                <textarea
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Site Description"
                    placeholder="Enter Site Description"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                />
            </div>

            {/* Contact Email */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Contact Email</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Contact Email"
                    type="email"
                    placeholder="Enter Contact Email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                />
            </div>

            {/* Phone Number */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Phone Number</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Phone Number"
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>

            {/* Alternate Phone Number */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Alternate Phone</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Alternate Phone Number"
                    type="tel"
                    placeholder="Enter Alternate Phone Number"
                    value={alternatePhoneNumber}
                    onChange={(e) => setAlternatePhoneNumber(e.target.value)}
                />
            </div>

            {/* Address */}
            <div className="flex flex-row items-start w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium pt-2">Address</label>
                <textarea
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Address"
                    placeholder="Enter Address"
                    maxLength={200}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>

            {/* Instagram URL */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Instagram URL</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Instagram URL"
                    type="url"
                    placeholder="Enter Instagram URL"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                />
            </div>

            {/* Google URL */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Google URL</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Google URL"
                    type="url"
                    placeholder="Enter Google URL"
                    value={googleUrl}
                    onChange={(e) => setGoogleUrl(e.target.value)}
                />
            </div>

            {/* Just Dial URL */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Just Dial URL</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Just Dial URL"
                    type="url"
                    placeholder="Enter Just Dial URL"
                    value={justDialUrl}
                    onChange={(e) => setJustDialUrl(e.target.value)}
                />
            </div>

            {/* Opening Hours - Each Day */}
            <div className="flex flex-row items-start w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium pt-2">Opening Hours</label>
                <div className="w-2/3 space-y-2">
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Monday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={openingHours.monday}
                            onChange={(e) => setOpeningHours({...openingHours, monday: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Tuesday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={openingHours.tuesday}
                            onChange={(e) => setOpeningHours({...openingHours, tuesday: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Wednesday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={openingHours.wednesday}
                            onChange={(e) => setOpeningHours({...openingHours, wednesday: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Thursday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={openingHours.thursday}
                            onChange={(e) => setOpeningHours({...openingHours, thursday: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Friday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={openingHours.friday}
                            onChange={(e) => setOpeningHours({...openingHours, friday: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Saturday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={openingHours.saturday}
                            onChange={(e) => setOpeningHours({...openingHours, saturday: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Sunday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., Closed"
                            value={openingHours.sunday}
                            onChange={(e) => setOpeningHours({...openingHours, sunday: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <button className="px-4 py-2 bg-black text-white rounded-md mt-3" onClick={() => updateSettings()}>
                Save Settings
            </button>
        </div>
    );
}
