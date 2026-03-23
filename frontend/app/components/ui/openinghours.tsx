'use client';

import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useSiteDetails } from "../../context/siteContext";

export default function OpeningHours() {

  const siteDetails = useSiteDetails();

  const [open, setOpen] = useState(false);

  const [monday, setMondayTime] = useState('');
  const [tuesday, setTuesdayTime] = useState('');
  const [wednesday, setWednesdayTime] = useState('');
  const [thursday, setThursdayTime] = useState('');
  const [friday, setFridayTime] = useState('');
  const [saturday, setSaturdayTime] = useState('');
  const [sunday, setSundayTime] = useState('');

  useEffect(() => {
    if (siteDetails) {
      setMondayTime(siteDetails?.monday || '');
      setTuesdayTime(siteDetails?.tuesday || '');
      setWednesdayTime(siteDetails?.wednesday || '');
      setThursdayTime(siteDetails?.thursday || '');
      setFridayTime(siteDetails?.friday || '');
      setSaturdayTime(siteDetails?.saturday || '');
      setSundayTime(siteDetails?.sunday || '');
    }
  }, [siteDetails]);

  return (
  (monday || tuesday || wednesday || thursday || friday || saturday || sunday) && (
    <div className="w-[80%] mx-auto border border-gray-300 rounded-md my-2">
      <div
        className="flex flex-row justify-between p-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span>Opening Hours</span>
        <span>{open ? <FaArrowUp /> : <FaArrowDown />}</span>
      </div>

      {open && (
        <div className="flex flex-col justify-between border-t border-gray-300 p-2">
          <p className="text-lg mt-2 flex flex-row justify-between w-[70%]">
            <span>Monday:</span>
            <span>{monday}</span>
          </p>
          <p className="text-lg mt-2 flex flex-row justify-between w-[70%]">
            <span>Tuesday:</span>
            <span>{tuesday}</span>
          </p>
          <p className="text-lg mt-2 flex flex-row justify-between w-[70%]">
            <span>Wednesday:</span>
            <span>{wednesday}</span>
          </p>
          <p className="text-lg mt-2 flex flex-row justify-between w-[70%]">
            <span>Thursday:</span>
            <span>{thursday}</span>
          </p>
          <p className="text-lg mt-2 flex flex-row justify-between w-[70%]">
            <span>Friday:</span>
            <span>{friday}</span>
          </p>
          <p className="text-lg mt-2 flex flex-row justify-between w-[70%]">
            <span>Saturday:</span>
            <span>{saturday}</span>
          </p>
          <p className="text-lg mt-2 flex flex-row justify-between w-[70%]">
            <span>Sunday:</span>
            <span>{sunday}</span>
          </p>
        </div>
      )}
    </div>
  )
);
}