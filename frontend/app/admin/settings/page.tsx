'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function Settings() {

    const router = useRouter();
    const { user, logout } = useAuth();
    
    const [sitetitle, setSiteTitle] = useState("");
    const [sitelogourl, setSiteLogoUrl] = useState<File | null>(null);
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("");
    const [ownername, setOwnerName] = useState("");
    const [sitedescription, setSiteDescription] = useState("");
    const [contactemail, setContactEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(""); 
    const [alternatePhoneNumber, setAlternatePhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [instagramurl, setInstagramUrl] = useState("");
    const [googleurl, setGoogleUrl] = useState("");
    const [justdialurl, setJustDialUrl] = useState("");
    const [openingHours, setOpeningHours] = useState({
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: ""
    });

    const shopid = user?.shopid || '';

    // Route protection - redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            router.push("/admin/login");
            return;
        }
    }, [user, router]);

    useEffect(() => {
        console.log("SHOP ID IN SETTING PAGE", shopid)
        if (!shopid) return;
        
        fetch(`http://localhost:3000/api/site-details/${shopid}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched site details:', data);
                data = data.data[0];
                if(!data || data.length == 0) {
                    throw new Error("Empty Data");
                    
                }
                setSiteTitle(data.sitetitle || "");
                // Set the current logo URL for display - backend returns object with url property
                if (data.sitelogourl && typeof data.sitelogourl === 'object' && data.sitelogourl.url) {
                    setCurrentLogoUrl(data.sitelogourl.url);
                } else {
                    setCurrentLogoUrl("");
                }
                setSiteLogoUrl(null);
                setOwnerName(data.ownername || "");
                setSiteDescription(data.sitedescription || "");
                setContactEmail(data.contactemail || "");
                setPhoneNumber(data.contactphone || "");
                setAlternatePhoneNumber(data.alternatecontactphone || "");
                setAddress(data.address || "");
                setInstagramUrl(data.instagramurl || "");
                setGoogleUrl(data.googleurl || "");
                setJustDialUrl(data.justdialurl || "");
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
    }, [shopid]);

    const updateSettings = () => {

        const file = sitelogourl;
        console.log("FILE", file);
        const form = new FormData();
        
        // Add shopid to form data
        form.append('shopid', shopid);
        
        form.append('sitetitle', sitetitle);
        form.append('ownername', ownername);
        form.append('sitedescription', sitedescription);
        form.append('contactemail', contactemail);
        // Backend expects 'contactphone' and 'alternatecontactphone'
        form.append('contactphone', phoneNumber);
        form.append('alternatecontactphone', alternatePhoneNumber);
        form.append('address', address);
        form.append('instagramurl', instagramurl);
        form.append('googleurl', googleurl);
        form.append('justdialurl', justdialurl);
        
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
            form.append('sitelogourl', file);
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
            if (sitelogourl && data.data && data.data.sitelogourl) {
                setCurrentLogoUrl(data.data.sitelogourl.url);
            }
            // Clear the file input after successful save
            if (sitelogourl) {
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
        if (sitelogourl && sitelogourl instanceof File) {
            return (
                <div className="mt-2">
                    <p className="text-sm text-gray-600">New logo preview:</p>
                    <img 
                        src={URL.createObjectURL(sitelogourl)} 
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
                    <div className="flex flex-row ml-auto">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100"
                      onClick={() => {
                        logout();
                        router.push("/admin/login");
                      }}
                    >
                      Logout
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100"
                      onClick={() => {
                        router.push(`/store?shop=${shopid}`);
                      }}
                    >
                      Customer Portal
                    </button>
                    </div>
                    
            {/* Site Title */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Site Title</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Site Title"
                    type="text"
                    placeholder="Enter Site Title"
                    maxLength={50}
                    value={sitetitle}
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
                    value={ownername}
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
                    value={sitedescription}
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
                    value={contactemail}
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
                    value={instagramurl}
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
                    value={googleurl}
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
                    value={justdialurl}
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
