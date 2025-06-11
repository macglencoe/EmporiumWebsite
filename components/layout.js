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
import { Analytics } from '@vercel/analytics/react'
import Toolbar from './toolbar'
import setLocalData from '../utils/setLocalData'
import DataUpdate from './dataUpdate'
import { Footer } from './footer'
import { PiBarcodeBold, PiGitCommitBold, PiPlusCircleBold, PiTableBold } from 'react-icons/pi'

const Layout = (props) => {
  const router = useRouter();

  const isHome = router.pathname === "/";



  const [isActive, setIsActive] = useState(true);
  const handleButtonClick = () => {
    setIsActive((prev) => !prev)
    window.scrollTo(0, 0);
  }

  return (
    <>


      <div id="fb-root"></div>

      <div className="catalog-container10">
        <header className='layout-header'>
          <div className='header-title' role='banner'>

            <div className='ksman'><Ksman className="ksman"></Ksman></div>
            <a href='#content' aria-label='Skip to content' tabIndex={0} className='sr-skip' id='header-content-skip'>
              <div>Skip to Content</div>
            </a>


            <div className='layout-title-container'>
              <Link href="/" aria-label='Go to homepage'>
                <a>
                  <h1 className="catalog-text109">The King Street Emporium</h1><span>Content Management System</span>
                </a>
              </Link>
              <Fragment>
                {props.headerChildren}
              </Fragment>

            </div>
          </div>


          <div className="directoryBar">
            <button onClick={handleButtonClick} className={`sidebarToggle ${isActive ? 'open' : 'closed'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M368.57-81.87 352.09-209.5q-11.59-4.28-23.04-10.58-11.44-6.29-21.01-13.09l-117.89 49.19L77.98-378.89l102.91-77.94q-.76-5.51-.76-10.57V-480q0-5.04.25-11.09.25-6.04 1.01-14.08L77.98-582.11l112.17-193.43 119.87 49.95q8.57-6.8 18.9-12.73 10.34-5.92 23.17-11.2l16.48-129.61h222.86l16.48 128.11q12.09 4.78 22.29 10.95 10.19 6.18 19.76 14.48l119.89-49.95 112.17 193.43-106.15 78.98q.76 6 .76 10.79V-480q0 7.54-.12 12.76t-1.14 10.91l105.15 77.44-112.41 194.91-118.63-50.19q-8.07 6.3-17.4 11.84-9.34 5.55-24.17 12.83L591.43-81.87H368.57Zm74.35-86h72.21l14.74-106.02q30.24-8 55.84-22.87 25.59-14.87 47.09-37.83l99.27 42 35.63-62.69-86.29-64.52q4.5-14.48 6.74-29.56 2.24-15.08 2.24-30.64 0-15.74-1.99-30.23t-6.99-29.97l86.76-65.52-35.1-62.69-100.53 43q-19.5-21.72-46.59-37.58-27.1-15.86-56.08-23.12l-12.93-107.02h-73.55l-13.02 106.28q-32.72 8.26-57.44 22.37-24.71 14.11-48.45 38.07l-97.78-42-35.87 62.69 84.54 62.79q-5 16.47-7.24 31.33t-2.24 31.07q0 15.27 1.99 30.25t6.99 31.95l-84.04 63.05 35.94 62.69 97.21-41.76q23.74 23.98 49.82 38.84 26.09 14.86 56.57 22.36l12.55 105.28ZM479.01-345q55.77 0 95.27-39.55 39.5-39.55 39.5-95.5t-39.53-95.45Q534.71-615 478.78-615q-56.26 0-95.63 39.55t-39.37 95.5q0 55.95 39.37 95.45t95.86 39.5Zm.49-135.5Z"/></svg>
            </button>
            <Directory></Directory>
          </div>
        </header>


        <div className="catalog-container11 container">
          <div className={`catalog-container73 sidebar${isActive ? ' collapsed' : ''}`}>

            <Fragment>
              <DataUpdate></DataUpdate>
              <Toolbar
                type='sidebar'
                links={[
                  {
                    href: '/submit', label: 'Manage Changes',
                    icon: <PiGitCommitBold size={26}/>
                  },
                  {
                    href: '/cigars/add', label: 'Add New Cigar',
                    icon: <PiPlusCircleBold size={26}/>
                  },
                  {
                    href: '/cigars/barcodeSearch', label: 'Point of Sale',
                    icon: <PiBarcodeBold size={26}/>,
                  },
                  {
                    href: '/cigars/dense', label: 'Dense Catalog',
                    icon: <PiTableBold size={26}/>,
                    newExpiration: new Date("2025-06-21T00:00:00")
                  }
                ]}
                style={{ backgroundColor: 'var(--dl-color-theme-secondary1)' }}
              >

              </Toolbar>
              {props.sidebarChildren}
            </Fragment>

            <div className='contact-container'>
              <Contact></Contact>
            </div>




          </div>
          <main className="catalog-content1" id='content'>
            <Analytics />
            {props.children}



            <Footer></Footer>
        </main>


        </div>
      </div >
      <style jsx>
        {`

.directoryBar {
  background-color: var(--dl-color-theme-secondary1);
  display: flex;
  flex-direction: row;
}
.sidebarToggle {
  display: none;
}
.sidebarToggle:active {
  transform: scale(0.8);
}
.sidebarToggle svg {
  height: 100%;
  width: 23px;
  fill: var(--dl-color-theme-primary1);
  transition: rotate 0.6s ease;
}
.sidebarToggle.open svg {
  rotate: 180deg;
}

        .sr-skip {
          position: absolute;
          left: 50%;
          height: 30px;
          transition: transform 0.3s;
          transform: translateY(-1100%);
        }
        .sr-skip div {
          color: black;
          background-color: white;
          display: flex;
          padding: 1em;
          font-weight: 700;
        }

        .sr-skip:focus {
          transform: translateY(0);
          display: block;
        }

        .layout-header {
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 999;
          border-bottom: 6px solid var(--dl-color-theme-secondary2);
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
          border-bottom: 6px double var(--dl-color-theme-primary1);
        }
        .header-title h1 {
          font-variant: small-caps;
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
        .layout-title-container span {
          color: var(--dl-color-theme-primary2);
          align-self: center;
          text-align: center;
          font-variant: small-caps;
          font-family: Inter;
        }
        
        
        
  .sidebar {
        flex: 0 0 300px;
        width: 300px;
        border: 2px dashed rgba(120, 120, 120, 0.4);
        display: flex;
        border-color: var(--dl-color-theme-secondary1);
        border-width: 0px;
        flex-direction: column;
        background-color: var(--dl-color-theme-secondary1);
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
        
    .sidebarToggle {
        display: block;
    }
    .sidebar{
        position: absolute;
        z-index: 998;
        transition: transform .5s;
        background-color: var(--dl-color-theme-secondary1);
        height: 100vh;
    }
    .sidebar.collapsed {
        transform: translateX(-300px);
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
    
    
    
    .layout-title-container h1 {
    
          font-size: 1.5em;}
            

          }

          
        `}
      </style>
    </>

  )
}

export default Layout
