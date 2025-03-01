import "./style.css";
import { useState, useEffect } from "react";
import AgeVerificationModal from "../components/ageVerificationModal";

import React from "react";

export default function MyApp({ Component, pageProps }) {
  const [isAgeVerified, setIsAgeVerified] = useState(null); // Start as null to prevent SSR issues

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ageVerified = localStorage.getItem("ageVerified");
      setIsAgeVerified(ageVerified === "true");
    }
  }, []);

  if (isAgeVerified === null) {
    return null; // Prevent rendering on SSR until state is determined
  }

  return <Component {...pageProps} />;
}

