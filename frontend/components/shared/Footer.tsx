"use client";

import { useEffect, useState } from "react";

const Footer = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    const year = new Date().getFullYear();
    setYear(year.toString());
  }, []);

  return (
    <footer className="w-full flex justify-center items-center py-6 bg-color2">
      <p className="text-sm text-gray-300">
        &copy;{year} Web3bridge. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

