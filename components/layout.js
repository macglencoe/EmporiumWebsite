import React, { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import Data from "../public/data/consolidated_cigars.json"

import Footer32 from '../components/footer32'
import Contact from '../components/contact'
import Directory from '../components/directory'
import Ksman from '../components/ksman'
import { Router, useRouter } from 'next/router'

const Layout = (props) => {
  const router = useRouter();

  const isHome = router.pathname === "/";
  
  const [isActive, setIsActive] = useState(true);
  const handleButtonClick = () => {
    setIsActive((prev) => !prev)
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.nonce = 'YOUR_NONCE_HERE';
    document.body.appendChild(script);

    /* window.fbAsyncInit = function() {
      FB.init({
        xfbml: true,
        version: 'v13.0',
      });
      console.log('Facebook SDK initialized');
    }; */

  }, []);

  return (
    <>

      <Head>
        <title>King Street Emporium</title>
        <meta property="og:title" content="King Street Emporium" />
        <link rel="icon" href="/public/favicon.ico" sizes="any" />
      </Head>
      <div id="fb-root"></div>
      <Script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0"></Script>

      <div className="catalog-container10">
        <header className='layout-header'>
          <div className='header-title'>
            <button
              id="closer"
              type="button"
              className="catalog-button7 button"
              onClick={handleButtonClick}
            >
              Button
            </button>
            <div className='ksman'><Ksman className="ksman"></Ksman></div>

            <div className='layout-title-container'>
              <Link href="/">
                <a>
                  <h1 className="catalog-text109">The King Street Emporium</h1>
                </a>
              </Link>
              <Fragment>
                {props.headerChildren}
              </Fragment>
            </div>
          </div>

          <Directory></Directory>
        </header>


        <div className="catalog-container11 container">
          <div className={`catalog-container73 sidebar${isActive ? ' collapsed' : ''}`}>

            <Fragment>
              {props.sidebarChildren}
            </Fragment>

            <div className='contact-container'>
              <Contact></Contact>
            </div>

            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FKing-Street-Coffee-Tobacco-Emporium-100063496593967%2F&tabs=timeline&width=300&height=1000&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="300" height="1000" style={{ border: "none" }} scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </div>
          <div className="catalog-content1">
            
            {props.children}
              
              

              <Footer32
                link1={
                  <Fragment>
                    <span className="catalog-text227">About Us</span>
                  </Fragment>
                }
                link2={
                  <Fragment>
                    <span className="catalog-text228">Shop</span>
                  </Fragment>
                }
                link3={
                  <Fragment>
                    <span className="catalog-text229">Events</span>
                  </Fragment>
                }
                link4={
                  <Fragment>
                    <span className="catalog-text230">Contact Us</span>
                  </Fragment>
                }
                link5={
                  <Fragment>
                    <span className="catalog-text231">Visit Us</span>
                  </Fragment>
                }
                termsLink={
                  <Fragment>
                    <span className="catalog-text232">
                      Terms and Conditions
                    </span>
                  </Fragment>
                }
                cookiesLink={
                  <Fragment>
                    <span className="catalog-text233">Cookies Policy</span>
                  </Fragment>
                }
                privacyLink={
                  <Fragment>
                    <span className="catalog-text234">Privacy Policy</span>
                  </Fragment>
                }
                rootClassName="footer32root-class-name1"
              ></Footer32>
            </div>
          

        </div>
      </div >
      <style jsx>
        {`

        .layout-header {
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 2;
          border-bottom: 3px solid var(--dl-color-theme-secondary2);
        }

        .header-title {
          width: 100%;
          display: flex;
          flex-direction: row;
          background-color: var(--dl-color-theme-secondary1);
          height: 100%;
          align-items: center;
          padding-left: 1em;
          gap: 1em;
        }
        
        .layout-title-container {
          display: flex;
          flex-direction: row;
          padding: 1em;
          width: 100%;
          background-color: var(--dl-color-theme-secondary1);
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .layout-title-container h1 {
          fill: var(--dl-color-theme-primary2);
          color: var(--dl-color-theme-primary2);
          align-self: center;
          text-align: center;
        }
        
        
  .sidebar {
        gap: 3px;
        flex: 0 0 300px;
        width: 300px;
        border: 2px dashed rgba(120, 120, 120, 0.4);
        display: flex;
        border-color: var(--dl-color-theme-secondary1);
        border-width: 0px;
        flex-direction: column;
        background-color: var(--dl-color-theme-secondary2);
        }
  .catalog-button7 {
      float: right;
      width: 30px;
      height: 30px;
      aspect-ratio: 1;
      display: block;
      padding: 0px;
      font-size: 1px;
      font-style: normal;
      font-weight: 300;
      border-width: 0px;
      border-radius: 50%;
      background-color: var(--dl-color-theme-primary2);
      display: none;
    }

          

  .catalog-container10 {
    width: 100%;
    display: flex;
    min-height: 100vh;
    align-items: center;
    flex-direction: column;
    background-color: var(--dl-color-theme-primary1);
  }
  .catalog-container11 {
    /* position: absolute; */
    background-color: var(--dl-color-theme-primary1);
  }
     
  .catalog-content1 {
    flex: 2;
    width: 100%;
    position: relative;
    align-self: flex-start;
    gap: 5px;
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    padding-top: 5px;
  
  }
  .catalog-title {
    flex: 0 0 auto;
    width: auto;
    height: auto;
    display: flex;
    padding: var(--dl-space-space-unit);
    align-items: center;
    justify-content: space-between;
    background-color: var(--dl-color-theme-secondary1);
    gap: 10px
  }
  
  .catalog-container21 {
    flex: 0 0 auto;
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    align-items: flex-start;
    flex-direction: column;
  }
        
  .catalog-container31 {
    gap: var(--dl-space-space-halfunit);
    flex: 0 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: var(--dl-space-space-halfunit);
    padding-right: var(--dl-space-space-halfunit);
  }
        
  .catalog-text227 {
    display: inline-block;
  }
  .catalog-text228 {
    display: inline-block;
  }
  .catalog-text229 {
    display: inline-block;
  }
  .catalog-text230 {
    display: inline-block;
  }
  .catalog-text231 {
    display: inline-block;
  }
  .catalog-text232 {
    display: inline-block;
  }
  .catalog-text233 {
    display: inline-block;
  }
  .catalog-text234 {
    display: inline-block;
  }
  .catalog-container73 {
    flex: 0 0 auto;
  }
       
  @media (max-width: 1200px) {
    .shop-suggestions {
      flex-direction: column;
      }
        
            
    .catalog-container11 {
      top: 0px;
      left: 0px;
      align-self: center;
    }
          
    .catalog-container31 {
      flex-direction: column;
    }
        
          }
     
            
  @media (max-width: 680px) {
            
    .catalog-content1 {
        transition: margin-left .5s;
        
    }
        .layout-title-container {
          white-space: normal;
        }
        
        
    .sidebar, collapsed {
        position: absolute;
        z-index: 1;
        transition: transform .5s;
    }
    
    .contact-container {
        display: none;
    }
    
    .collapsed {
        transform: translateX(-300px);
    }
    
    .catalog-button7 {
          display: block;
    }
    
    .header-title .ksman {
          display: none;
    }
    
    .layout-title-container h1 {
    
          font-size: 1.5em;}
            

          }

          
        `}
      </style>
    </>

  )
}

export default Layout
