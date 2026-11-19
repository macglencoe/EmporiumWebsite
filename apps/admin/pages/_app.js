import "./style.css";
import React from "react";
import { useRouter } from "next/router";
import AuthControls from "../components/authControls";

export default function MyApp({ Component, pageProps, commitSha, commitMessage }) {
  const { pathname } = useRouter();
  const isToolsPage = pathname === "/tools" || pathname.startsWith("/tools/");

  return (
    <>
    <AuthControls />
    <Component {...pageProps} />
    {isToolsPage && <style jsx global>{`
      #content,
      #content * {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          "Liberation Mono", "Courier New", monospace;
      }
    `}</style>}
    </>
  );
}
