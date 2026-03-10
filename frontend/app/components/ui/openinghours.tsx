'use client';

import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { getSiteDetails } from "../../lib/siteDetails";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function OpeningHours() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const shopidFromUrl = searchParams.get('shop');
  
  const [open, setOpen] = useState(false);
  
  const [monday, setMondayTime] = useState('');
  const [tuesday, setTuesdayTime] = useState('');
  const [wednesday, setWednesdayTime] = useState('');
  const [thursday, setThursdayTime] = useState('');
  const [friday, setFridayTime] = useState('');
  const [saturday, setSaturdayTime] = useState('');
  const [sunday, setSundayTime] = useState('');

  // Get shopid: from URL params first, then from auth context, then fallback
  const shopid = shopidFromUrl || user?.shopid || '';

  useEffect(() => {
    if (!shopid) return;
    
    getSiteDetails(shopid).then((details) => {
      console.log("Site details--->>:", details);
      setMondayTime(details?.monday || '');
      setTuesdayTime(details?.tuesday || '');
      setWednesdayTime(details?.wednesday || '');
      setThursdayTime(details?.thursday || '');
      setFridayTime(details?.friday || '');
      setSaturdayTime(details?.saturday || '');
      setSundayTime(details?.sunday || '');
    }).catch((error:any) => {
      console.error("Error fetching site details:", error);
    });
  }, []);

  return (
    <div className="w-[80%] mx-auto border-1 border-gray-300 rounded-md my-2">
      <div className="flex flex-row justify-between p-4" onClick={() => setOpen(!open)}>
        <span>
          Opening Hours
        </span>
        <span>
          {open ? <FaArrowUp /> : <FaArrowDown />}
        </span>
      </div>
      {open && (
        <div className="flex flex-col justify-between border-t border-gray-300 p-2">
          <p className="text-lg mt-2 flex flex-row justify-between w-70">
            <span>Monday: </span>
            <span>{monday}</span>
          </p>
          <p className="text-lg mt-2 flex flex-row justify-between  w-70">
            <span>Tuesday: </span>
            {tuesday}
            </p>
          <p className="text-lg mt-2 flex flex-row justify-between  w-70">
            <span>Wednesday: </span>
            {wednesday}
            </p>
          <p className="text-lg mt-2 flex flex-row justify-between  w-70">
            <span>Thursday: </span>
            {thursday}
            </p>
          <p className="text-lg mt-2 flex flex-row justify-between  w-70">
            <span>Friday: </span>
            {friday}
            </p>
          <p className="text-lg mt-2 flex flex-row justify-between  w-70">
            <span>Saturday: </span>
            {saturday}
            </p>
          <p className="text-lg mt-2 flex flex-row justify-between  w-70">
            <span>Sunday: </span>
            {sunday}
            </p>
        </div>
      )}
    </div>
  );
}