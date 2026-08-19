import "./style.css";
import { useState, useEffect } from "react";
import App from "next/app";

import React from "react";
import DataUpdate from "../components/dataUpdate";

export default function MyApp({ Component, pageProps, commitSha, commitMessage }) {
  return (
    <>
    <Component {...pageProps} />
    </>
  );
}

