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
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    isMobile = window.innerWidth < 680;
  })


  useEffect(() => {
    // Add cursor pointer for better UX
    const element = document.querySelector('.our-store-button');
    if (element) {
      element.style.cursor = 'pointer';
    }
  }, []);

  const adminConsoleVersion = process.env.ADMIN_CONSOLE_VERSION ?? "1.0";

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
        <div className='admin-console-dashboard'>
          <header>
            <h1>Admin Console</h1>
            <b>Dashboard</b>
            <p>Version: <b>{adminConsoleVersion}</b></p>
            {console.log(process.env)}
          </header>
          <div className='vercel-container'>
            
            <h2>Hosting Dashboard</h2>
            <p>This website is hosted with <b>Vercel</b>.<br></br> Click here to manage the site, view analytics, and more:</p>
            <button onClick={() => window.open('https://vercel.com/king-street-emporium/emporium-website/deployments', '_blank')}><img src='https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg' alt='Vercel'></img></button>
          </div>
          <details className='accordion'>
            <summary>How to use</summary>
            <div>
              <p>The admin console is a work in progress. As such, right now it only supports adding, editing, and deleting cigars.</p>
              <ul>
                <li>
                  <h2>Adding a cigar</h2>
                  <ol>
                    <li>Click "Add New Cigar" anytime on the top-right of the page.</li>
                    <li>Fill out the form. There are 2 required fields: Cigar Name and Brand</li>
                    <li>Click "Submit" at the bottom of the form</li>
                  </ol>
                </li>
                <li>
                  <h2>Editing a cigar</h2>
                  <ol>
                    <li>In the cigar catalog, search for the cigar you want to edit</li>
                    <li>Click on the cigar. <br></br>
                      If this is a cigar that you added in this session, it will take you directly to the edit form. In this case, skip step 3</li>
                    <li>Click "Edit" in the top-right</li>
                    <li>Fill out the form</li>
                    <li>Click "Submit" at the bottom of the form</li>
                  </ol>
                </li>
                <li>
                  <h2>Deleting a cigar</h2>
                  <ol>
                    <li>In the cigar catalog, search for the cigar you want to delete</li>
                    <li>Click on the cigar.</li>
                    <li>Click "Delete" in the top-right</li>
                    <li>Read the confirmation page. If you are sure you want to delete the data, click "Delete Cigar" at the bottom.</li>
                  </ol>
                </li>
                <li>
                  <h2>Submitting your changes</h2>
                  <p>Your changes are not immediately sent to the website. They are cached on your browser until you are ready to submit them all together.</p>
                  <ol>
                    <li>Click "Submit all Changes" at the top of the page, next to the "Add New Cigar" button</li>
                    <li>Read the confirmation page carefully. If there looks to be anything out of place, amend them or contact the developer.</li>
                    <li>If you are satisfied with the changes, click "Commit" at the bottom of the page.</li>
                  </ol>
                </li>
              </ul>
            </div>
          </details>
          <details>
            <summary>Current Features ({adminConsoleVersion})</summary>
            <div>
              <ul>
                <li>Vercel Authentication <a href='https://github.com/macglencoe/EmporiumWebsite/issues/47'>Issue #47</a></li>
                <li>CRUD (Create, Read, Update, Delete) Form <a href='https://github.com/macglencoe/EmporiumWebsite/issues/29'>Issue #29</a></li>
                <li>Real-time Validation <a href='https://github.com/macglencoe/EmporiumWebsite/issues/30'>Issue #30</a></li>
                <li>Load Original Data <a href='https://github.com/macglencoe/EmporiumWebsite/issues/32'>Issue #32</a></li>
                <li>Edit Cigar <a href='https://github.com/macglencoe/EmporiumWebsite/issues/28'>Issue #28</a></li>
                <li>Delete Cigar <a href='https://github.com/macglencoe/EmporiumWebsite/issues/53'>Issue #53</a></li>
                <li>Add Cigar <a href='https://github.com/macglencoe/EmporiumWebsite/issues/51'>Issue #51</a></li>
                <li>Delete New Cigar <a href='https://github.com/macglencoe/EmporiumWebsite/issues/54'>Issue #54</a></li>
                <li>Slug Generation & Validation <a href='https://github.com/macglencoe/EmporiumWebsite/issues/34'>Issue #34</a></li>
                <li>Submit All Changes <a>Pending Issue</a></li>
                <li>Link to Vercel Dashboard <a href='https://github.com/macglencoe/EmporiumWebsite/issues/40'>Issue #40</a></li>
              </ul>
              <a href='https://github.com/users/macglencoe/projects/2/views/3'>Check out the Roadmap!</a>
            </div>
          </details>
        </div>

        <div className='welcome-container-b' >
          <div className='welcome-container'>

            <div className='welcome-text-container'>
              <h1>The Eastern Panhandle's only cigar lounge</h1>
              <p>
                The King Street Emporium is the <b>perfect third space!</b> For over 30 years, we've been serving Martinsburg, WV, with a <b>friendly, laid-back spot</b> to relax, chat, and unwind
              </p>
              <p>
                Whether you're looking for fine cigars, pipes, a nice cup of coffee, or some good conversation, <b>we're here to share our expertise</b>!
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
              <div className='kschairs' style={{
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
          <h1 style={{ fontSize: '2em' }}>We are proud to carry your favorite brands</h1>
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

        <section className='podcast'>
          <h1 id='podcast'>The Stick Figures</h1>
          <b>Our very own podcast</b>
          <p>What does a former 1%er biker, a modern farmer/ tobacconist, redneck battle rapper, and a submarine vet have in common? Nothing except that they are all brothers of the leaf. Tune in with the Stick Figures to hear about cigars, tobacco and life on this comedy cigar podcast.</p>
          <iframe src="https://open.spotify.com/embed/show/0xpAdXeTXnnh30J0HEVmoz?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

          <div className='podcast-links'>
            <b>Find us on:</b>
            <ul>
              <li>
                <Link href={'https://open.spotify.com/show/0xpAdXeTXnnh30J0HEVmoz'}><a>
                  <img alt='Spotify' src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png'></img>
                </a></Link>
              </li>
              <li>
                <Link href={'https://jacobjpyle.podbean.com/'}><a>
                  <img src="//pbcdn1.podbean.com/fs1/site/images/badges/b600_1.png" alt="App download" data-categories="essential"></img>
                </a></Link>
              </li>
              <li>
                <Link href={'https://www.iheart.com/podcast/1323-the-stick-figures-podcast-260145382/'}><a>
                  <img alt='I Heart Radio' src='https://upload.wikimedia.org/wikipedia/commons/8/8f/IHeartRadio_logo.svg'></img>
                </a></Link>
              </li>
              <li>
                <Link href={'https://www.facebook.com/people/The-Stick-Figures-Podcast/61563815072152/?_rdr'}><a>
                  <img alt='Facebook' src='/Facebook_Logo_Primary.png'></img>
                </a></Link>
              </li>
            </ul>

          </div>
        </section>

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
          <h1 id='staff' style={{
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

        div.admin-console-dashboard {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1em;
        }

        div.admin-console-dashboard details {
          width: 100%;
          display: flex;
          flex-direction: column;
          background-color: var(--dl-color-theme-primary2);
          border-radius: 10px;
        }

        div.admin-console-dashboard details summary {
          cursor: pointer;
          gap: 1em;
          color: var(--dl-color-theme-secondary2);
          font-weight: bold;
          font-size: 1.3em;
          padding: 0.5em;
        }
        div.admin-console-dashboard details > div {
          display: flex;
          flex-direction: column;
          gap: 1em;
          padding: 0.5em;
        }
        div.admin-console-dashboard details ul {
          padding-left: 1em;
          font-family: Inter;
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
        
        div.admin-console-dashboard details ul ol {
          display: flex;
          flex-direction: column;
          gap: 0.3em;
        }

        div.admin-console-dashboard details a {
          color: var(--dl-color-theme-primary1);
          font-weight: bold;
        }

        div.admin-console-dashboard details ul a::before {
          content: '( ';
          font-weight: normal;
          color: var(--dl-color-theme-secondary1);
        }

        div.admin-console-dashboard details ul a::after {
          content: ' )';
          font-weight: normal;
          color: var(--dl-color-theme-secondary1);
        }

        div.vercel-container {
          display: flex;
          flex-direction: column;
          background-color: var(--dl-color-theme-primary2);
          padding: 0.5em;
          gap: 1em;
          border-radius: 10px;
        }

        div.vercel-container h2 {
          font-size: 1.5em;
          color: var(--dl-color-theme-secondary2);
        }

        div.vercel-container button {
          cursor: pointer;
          padding: 0.7em;
          border-radius: 10px;
          border: none;
          color: var(--dl-color-theme-primary1);
          font-weight: bold;
          width: min-content;
          display: inline-block;
          align-self: center;
          background-position: 0px 0px;
          background-size: 100% 100%;
          transition: all 0.3s ease-out;
          position: relative;
          overflow: hidden;
        }
        div.vercel-container button img {
          height: 2em;
          z-index: 1;
          position: relative;
        }

        div.vercel-container button::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 400%;
          top: -50%;
          left: -50%;
          z-index: 0;
          background-image: radial-gradient(circle at left, var(--dl-color-theme-primary1) -190%, var(--dl-color-theme-primary2) 100%);
          transition: all 1s ease-out;
        }

        div.vercel-container button:hover::before {
          transform: rotate(-180deg);
          background-position-x: 300px;
        }




        section.podcast {
          background-color: var(--dl-color-theme-primary2);
          padding: 10px;
          border: solid var(--dl-color-theme-secondary2);
          border-width: 3px 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1em;
        }

        section.podcast h1 {
          text-align: center;
          font-size: 2em;
        }

        section.podcast b {
          color: var(--dl-color-theme-secondary2);
          font-family: Inter;
        }

        section.podcast p {
          color: var(--dl-color-theme-secondary2);
          text-indent: 2em;
          padding: 10px;
        }

        div.podcast-links {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
        }

        div.podcast-links ul {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
        }

        div.podcast-links li {
        }

        div.podcast-links a {
          display: flex;
          border-radius: 10px;
          margin: 6px;

        }

        div.podcast-links a img {
          height: 40px;
        }

        

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
          font-style: italic;
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
        .kschairs h1 {
          filter: drop-shadow(0px 0px 10px  var(--dl-color-theme-primary1));
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
