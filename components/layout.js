import React, { Fragment, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import clsx from 'clsx';
import Data from '../public/data/consolidated_cigars.json';

import Footer32 from './footer32';
import Contact from './contact';
import Directory from './directory';
import Ksman from './ksman';
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/react';
import { Footer } from './footer';

export default function Layout(props) {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const [isActive, setIsActive] = useState(true);

  const handleButtonClick = () => {
    setIsActive(prev => !prev);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div id="fb-root" />

      <div className="w-full flex flex-col min-h-screen bg-primary1">
        <header className="sticky top-0 w-full z-20 border-b-[6px] border-secondary2">
          <div className="w-full flex items-center bg-secondary1 h-full pl-4 gap-4 border-double border-b-[6px] border-primary1">
            <div className="ksman"><Ksman /></div>
            <a
              href="#content"
              aria-label="Skip to content"
              tabIndex={0}
              className="absolute left-1/2 h-8 transform -translate-y-50 transition-transform duration-300 focus:translate-y-0"
            >
              <div className="flex p-4 font-bold bg-white text-black">
                Skip to Content
              </div>
            </a>

            <div className="flex flex-wrap justify-between items-center w-full p-4 bg-secondary1">
              <Link href="/" aria-label="Go to homepage">
                <a>
                  <h1 className="small-caps text-[1em] md:text-[2em] font-bold text-primary2 text-center">
                    The King Street Emporium
                  </h1>
                </a>
              </Link>
              <Fragment>{props.headerChildren}</Fragment>
            </div>
          </div>

          <Directory />
        </header>

        <div className="bg-primary1 flex w-full">
          <div
            className={clsx(
              'hidden md:flex flex-col gap-1 bg-secondary2 w-[300px] flex-none transition-transform duration-500',
              isActive ? 'translate-x-0' : '-translate-x-72'
            )}
          >
            <Fragment>{props.sidebarChildren}</Fragment>

            <div className="hidden md:block">
              <Contact />
            </div>

            <a
              href="#fb-skip"
              tabIndex={0}
              className="absolute left-0 top-full h-8 transform -translate-y-full transition-transform duration-300 focus:translate-y-0"
            >
              <div className="flex p-4 font-bold bg-white text-black">
                Skip Facebook Embed
              </div>
            </a>

            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FKing-Street-Coffee-Tobacco-Emporium-100063496593967%2F&tabs=timeline&width=300&height=1000&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
              width="300"
              height="1000"
              className="border-none"
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              id="fb-embed"
            />
            <div id="fb-skip" />
          </div>

          <main
            id="content"
            className="flex-1 flex flex-col gap-[5px] w-full relative self-start p-[5px]"
          >
            <Analytics />
            {props.children}
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
}