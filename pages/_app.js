import "./style.css";
import { useState, useEffect } from "react";
import App from "next/app";

import React from "react";
import DataUpdate from "../components/dataUpdate";

export default function MyApp({ Component, pageProps, commitSha, commitMessage }) {
  return (
    <>
    <DataUpdate serverCommitSha = {commitSha} serverCommitMessage = {commitMessage}></DataUpdate>
    <Component {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  // Call page-level getInitialProps if it exists
  const appProps = await App.getInitialProps(appContext);
  
  return { ...appProps, commitSha: process.env.VERCEL_GIT_COMMIT_SHA || 'Unknown', commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || 'Unknown' };

};

