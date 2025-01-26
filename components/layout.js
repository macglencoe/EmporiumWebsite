import React, { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import Data from "../public/data/consolidated_cigars.json"

import Footer32 from '../components/footer32'
import Contact from '../components/contact'
import Directory from '../components/directory'
import Ksman from '../components/ksman'

const Layout = (props) => {
  const [isActive, setIsActive] = useState(true);
  const handleButtonClick = () => {
    setIsActive((prev) => !prev)
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
      <div className="catalog-container10">
        <Head>
          <title>King Street Emporium</title>
          <meta property="og:title" content="King Street Emporium" />
          <Script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></Script>
          <Script src="https://cdn.rawgit.com/harvesthq/chosen/gh-pages/chosen.jquery.min.js"></Script>
          <link rel="icon" href="/public/favicon.ico" sizes="any" />
        </Head>

        <div id="fb-root"></div>
        <Script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0"></Script>
        

        <div className="catalog-container11 container">
          <div className={`catalog-container73 sidebar${isActive ? ' collapsed' : ''}`}>

            <Ksman></Ksman>

            <Contact></Contact>

            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FKing-Street-Coffee-Tobacco-Emporium-100063496593967%2F&tabs=timeline&width=300&height=1000&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="340" height="1000" style={{border:"none"}} scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </div>
          <div className="catalog-content1">
            <header className="catalog-title">
              <Link href="/">
                <a>
                  <h1 className="catalog-text109">
                    <span>The King Street Emporium</span>
                    <br></br>
                  </h1>
                </a>
              </Link>
              <button
                id="closer"
                type="button"
                className="catalog-button7 button"
                onClick={handleButtonClick}
              >
                Button
              </button>
            </header>
            <div className="catalog-container21">
              <Directory></Directory>
              <div className="catalog-container31">

                {props.children}

              </div>

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

        </div>
      </div >
      <style jsx>
        {`
  .sidebar {
        gap: 3px;
        flex: 0 0 auto;
        width: 300px;
        border: 2px dashed rgba(120, 120, 120, 0.4);
        height: 100%;
        display: flex;
        align-items: flex-start;
        border-color: var(--dl-color-theme-secondary1);
        border-width: 0px;
        flex-direction: column;
        background-color: var(--dl-color-theme-secondary1);
        }
  .catalog-button7 {
      float: right;
      min-width: 30px;
      aspect-ratio: 1/1;
      display: block;
      padding: 0px;
      font-size: 1px;
      font-style: normal;
      font-weight: 300;
      border-width: 0px;
      border-radius: 50%;
      background-color: var(--dl-color-theme-primary2);
    }

          

  .catalog-container10 {
    width: 100%;
    display: flex;
    min-height: 100vh;
    align-items: center;
    flex-direction: column;
  }
  .catalog-container11 {
    top: 0px;
    flex: 1;
    left: 0px;
    height: 100%;
    overflow: scroll;
    position: absolute;
    background-color: var(--dl-color-theme-primary1);
  }
     
  .catalog-content1 {
    flex: 1;
    height: 100%;
    width: 100%;
    position: relative;
    align-self: flex-start;
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
  .catalog-text109 {
    fill: var(--dl-color-theme-primary2);
    color: var(--dl-color-theme-primary2);
    align-self: center;
    text-align: center;
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
    height: 1500px;
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
    .sidebar, collapsed {
        position: fixed;
        z-index: 1;
        transition: transform .5s;
    }
    
    .collapsed {
        transform: translateX(-300px);
    }
            

          }

          
        `}
      </style>
    </>

  )
}

export default Layout
