import "./style.css";
import { useState, useEffect } from "react";
import AgeVerificationModal from "../components/ageVerificationModal";

import React from "react";
export default function MyApp({
  Component: Component,
  pageProps: pageProps
}) {
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  useEffect(() => {
    const ageVerified = localStorage.getItem("ageVerified");
    if (ageVerified) {
      setIsAgeVerified(true);
    }
  }, []);

  const handleAgeVerification = () => {
    // Set age verification status in local storage
    localStorage.setItem('ageVerified', 'true');
    setIsAgeVerified(true);
  };

  if (!isAgeVerified) {
    return <AgeVerificationModal onConfirm={handleAgeVerification} />;
  }


  return <Component {...pageProps} />;
}
