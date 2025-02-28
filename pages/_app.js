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


  return <>
    <div>
      <h1>Fair Use Disclaimer</h1>
      <p>This is a testing build and is not being used for commercial purposes.</p>
    </div>
    <Component {...pageProps} />
    <style jsx>
      {`
      div {
        background-color: var(--dl-color-theme-secondary1);
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        border-bottom: 6px double var(--dl-color-theme-primary1);
      }
      h1, p {
        color: var(--dl-color-theme-primary2);
      }
      `}
    </style>
  </>;
}
