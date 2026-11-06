import "./style.css";
import React from "react";
import AuthControls from "../components/authControls";

export default function MyApp({ Component, pageProps, commitSha, commitMessage }) {
  return (
    <>
    <AuthControls />
    <Component {...pageProps} />
    </>
  );
}
