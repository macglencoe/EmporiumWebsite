import React, { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import Data from "../public/data/consolidated_cigars.json"

import Footer32 from '../components/footer32'
import Contact from '../components/contact'
import Directory from '../components/directory'
import Ksman from '../components/ksman'
import Layout from '../components/layout'
import ShopSuggestions from '../components/shopSuggestions'
import { handleLocationClick } from '../utils/location'

const Catalog = (props) => {

  const isMobile = window.innerWidth < 680;


  useEffect(() => {
    // Add cursor pointer for better UX
    const element = document.querySelector('.our-store-button');
    if (element) {
      element.style.cursor = 'pointer';
    }
  }, []);

  return (
    <>
      <div id="fb-root"></div>
      <Head>
        <title>The King Street Emporium - Home</title>
      </Head>
      <Script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0"></Script>

      <Layout>
        <div className="mobile-home-contact">
          <Contact ></Contact>
        </div>

        <div className='welcome-container-b' >
          <div className='welcome-container'>

            <div className='welcome-text-container'>
              <h1>The Eastern Panhandle's only cigar lounge</h1>
              <p>
                The King Street Emporium is the <b>perfect third space!</b> For over 30 years, we've been serving Martinsburg, WV, with a <b>friendly, laid-back spot</b> to <b>relax, chat, and unwind</b>
              </p>
              <p>
                Whether you're looking for <b>fine cigars</b>, <b>pipes</b>, a nice cup of <b>coffee</b>, or some good <b>conversation</b>, <b>we're here to share our expertise</b>!
              </p>
              

              
            </div>
            <div className="divider"></div>
            <div style={{
              display: 'flex',
              position: 'relative',
              maxHeight: '200px',
              width: '100%',

            }}>
              <img id="kschairs-background" alt="image" src="/kschairs.jpg" style={{
                width: 'auto',
                height: 'auto',
                maxHeight: '100vh',
                objectFit: 'cover',
                opacity: '0.5',
                width: '100%',
              }} />
              <div style={{
                borderTop: '3px solid var(--dl-color-theme-secondary2)',
                width: '100%',
                height: '100%',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1em',
                padding: '10px',
                position: 'absolute',
              }}>

                <h1>Swing by, have a seat!</h1>
                <button className="our-store-button" onClick={handleLocationClick}>Visit Our Store</button>
              </div>
            </div>
          </div>
          <div id='kschairs-container'>
            <img alt="image" src="/ks-storefront.jpg" style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover'

            }} />
          </div>
        </div>


        <div className='divider'></div>

        <div className='facebook-container' >
          <div>
            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FKing-Street-Coffee-Tobacco-Emporium-100063496593967%2F&tabs=timeline&width=200&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="200" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </div>
        </div>


        <div className='divider'></div>

        { }

        <ShopSuggestions
          title="Cigars"
          items={[
            { href: "/cigars/brands", label: "Brand" },
            { href: "/cigars/strengths", label: "Strength" },
            { href: "/cigars/wrappers", label: "Wrapper" },
            { href: "/cigars/sizes", label: "Size" },
          ]}
        />
        <div className='divider'></div>
        <ShopSuggestions
          title="Pipe Tobacco"
          items={[
            { href: "/tobacco/brands", label: "Brand" },
            { href: "/tobacco/components", label: "Component" },
            { href: "/tobacco/families", label: "Family" },
          ]}
        />





        <div className='divider'></div>
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <h1>We are proud to carry your favorite brands</h1>
          <ul className='brand-logo-container'>
            <Link href="/cigars?Cigar+Brand=Arturo+Fuente.">
              <a tabIndex={0} aria-label='Arturo Fuente'>
                <img alt="Arturo Fuente" src='/af-logo.webp' /></a></Link>
            <Link href="/cigars?Cigar+Brand=J.C.+Newman">
              <a tabIndex={0} aria-label='J.C. Newman'>
                <img alt="J.C. Newman" src='/jcn-logo.png' /></a></Link>
            <Link href="/pipes#savinelli">
              <a tabIndex={0} aria-label='Savinelli'>
                <img alt="Savinelli" src='/savinelli-logo.webp' /></a></Link>
            <Link href="/pipes#peterson">
              <a tabIndex={0} aria-label='Peterson'>
                <img alt="Peterson" src='/peterson-logo.png' /></a></Link>
            <Link href="/tobacco?Tobacco+Brand=Cornell+%26+Diehl">
              <a tabIndex={0} aria-label='Cornell & Diehl'>
                <img alt="Cornell & Diehl" src='/cd-logo.jpg' /></a></Link>
          </ul>
        </nav>

        <div className='divider'></div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          width: '100%',
          gap: '2em'
        }}>
          <h1 style={{
            fontSize: '2.5em'
          }}>Meet our staff</h1>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'center',
            gap: '2em'

          }}>
            <div className='staff-container' >
              <div className='staff-image'>
                <img alt="Edward Trout" src='/edtrout.jpg' />
              </div>
              <div className='staff-info'>
                <h2>Edward Trout</h2>
                <p>Sole Proprietor</p>
              </div>
            </div>
            <div className='staff-container'>
              <div className='staff-image'>
                <img alt="Teddie" src='/tedmcdonald.jpg' />
              </div>
              <div className='staff-info'>
                <h2>Ted McDonald</h2>
                <p>Tobacconist</p>
              </div>
            </div>
          </div>
          </div>

      </Layout>

      <style jsx>
        {`
        .our-store-button:hover {
          background-color: var(--dl-color-theme-primary2);
        }
        .our-store-button {
          background-color: var(--dl-color-theme-secondary2);
          color: var(--dl-color-theme-primary1);
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
          font-weight: bold;
          font-size: 1.2em;
        }
        .facebook-container {
          justify-content: center;
          align-items: center;
          display: none;
        }
        .facebook-container div {
          padding: 10px;
          border-left: 10px double var(--dl-color-theme-secondary2);
          border-right: 10px double var(--dl-color-theme-secondary2);
        }
        .mobile-home-contact {
          display: none;
        }
        .staff-image {
          height: 250px;
          background-image: var(--dl-gradient-gradients-secondary2gradient);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .staff-container * {
          border-radius: 10px;
        }
        
        .staff-image img {
          height: 100%;
        }

        .staff-container {
          display: flex;
          flex-direction: column;
          gap: 1em;
          padding: 10px;
          align-items: center;
          background-color: var(--dl-color-theme-primary2);
          border-radius: 15px;
        }
        

        .staff-container h2 {
          font-size: 2.1em;
          text-align: center;
        }

        .staff-container p {
          font-size: 1.5em;
          text-align: center;
        }

        .brand-logo-container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 1em;
          padding: 10px;
          align-items: center;
          justify-content: center;
          width: 100%;
            
        }
        .brand-logo-container img {
          width: 300px;
          transition: transform 0.3s ease;
        }
        .brand-logo-container img:hover {
          transform: translate(-4px, -4px);
        }
        
        .shop-suggestions-container {
          display: flex;
          flex-direction: column;
          gap: 1em;
          padding: 10px;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        
        .shop-suggestions-container a {
          width: 100%;
        }

        .shop-suggestions {
          display: flex;
          flex-direction: row;
          gap: 1em;
          padding: 10px;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .shop-suggestions-card {
          border: 3px solid var(--dl-color-theme-secondary2);
          padding: 20px;
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .shop-suggestions-card > span {
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .welcome-text-container {
          border-bottom: 3px solid var(--dl-color-theme-secondary2);
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 10px;
          gap: 1em; 
        }

        .welcome-text-container h1 {
          font-size: 1.5em;
          font-weight: bold;
        }

        .welcome-text-container b {
          font-size: 1.2em;
        }

        .welcome-text-container p {
          font-size: 1.2em;
        }

        .welcome-container-b {
          display: flex;
          flex-direction: row;
          align-items: stretch;
        }
          
        #kschairs-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1em;
          border: 3px solid var(--dl-color-theme-secondary2);
          border-right: 5px solid var(--dl-color-theme-secondary2);
          border-top-right-radius: 10px;
          min-width: 300px;
          max-width: 400px;
        }
         

          
          

        .welcome-container {
          border-top: 3px solid var(--dl-color-theme-secondary2);
          border-left: 5px solid var(--dl-color-theme-secondary2);
          border-bottom: 3px solid var(--dl-color-theme-secondary2);
          border-top-left-radius: 10px;
          padding: 10px;  
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: start;
          height: 100%;
          gap: 5px;
        }

        .welcome-text {
          font-size: 20px;
          font-weight: 700;
        }

        .divider {
          background-color: var(--dl-color-theme-secondary2);
          width: 100%;
          height: 10px;
          min-height: 10px;
        }

        
        @media (max-width: 1200px) {
          .shop-suggestions {
            flex-direction: column;
            }
          .welcome-container-b {
            flex-direction: column;
          }
          #kschairs-container {
            display: none;
          }
          #kschairs-background {
            display: box;
          }
            
           
        }
          
         
        @media (max-width: 680px) {
          .mobile-home-contact {
            display: flex;
            width: 100%;
          }
          .brand-logo-container img {
            width: 130px;
          }
          .brand-logo-container {
            padding: 0;
          }
          .staff-container {
          }
          .staff-container h2 {
            font-size: 1.25em;
          }
          .staff-container p {
            font-size: 1em;
          }
          .staff-image {
            height: 150px;
          }
          .facebook-container {
            display: flex;
          }
      }
         
        `}
      </style>
    </>

  )
}

export default Catalog
