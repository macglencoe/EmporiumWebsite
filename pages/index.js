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
import NewArrivalList from '../components/newArrivalList'
import Featured from '../components/featured'
import BrandShowcase from '../components/brandShowcase'

export const getStaticProps = async () => {
  const data = await import('../public/data/consolidated_cigars.json');
  return {
    props: {
      data: data.default
    },
  };
};

const Catalog = (props) => {


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

      <Layout>
        <div id='hero-container' className='flex flex-col md:flex-row relative' style={{
          backgroundImage: "url(/kschairs.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
          <div className='absolute top-0 left-0 right-0 bottom-0 z-0' style={{
            backgroundImage: "linear-gradient(to bottom, var(--dl-color-theme-secondary2) 10%, transparent 150%)",
          }}></div>
          <div className='flex flex-col md:flex-row max-w-5xl mx-auto'>
            <div className='
            flex-3 z-10 
            '>

              <div className='
              flex flex-col gap-6
              max-w-[675px] mx-auto
              p-8
              justify-evenly h-[100%]
              '>
                <h1 className='text-3xl md:text-5xl font-bold text-primary2 text-center mt-10 mb-5'>The Eastern Panhandle's <em>only</em> cigar lounge</h1>
                <p className='text-lg md:text-2xl text-primary2'>
                  The King Street Emporium is the perfect third space! For over 30 years, we've been serving Martinsburg, WV, with a friendly, laid-back spot to relax, chat, and unwind
                </p>
                <p className='text-lg md:text-2xl text-primary2 font-bold'>
                  Whether you're looking for fine cigars, pipes, a nice cup of coffee, or some good conversation, <b>we're here to share our expertise</b>!
                </p>

              </div>
            </div>
            <div className='flex flex-col flex-1 m-6 z-10 gap-8 justify-around'>
              <div className='p-2 bg-primary1'>
                <img className='object-cover h-50 w-full md:h-auto' alt="image" src="/ks-storefront.jpg" />
              </div>
              <button className='w-full bg-primary1 p-3 text-secondary1 text-lg font-bold hover:bg-secondary1 hover:text-primary1' onClick={() => handleLocationClick()}>Visit Our Store</button>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <Contact ></Contact>
        </div>


        <div className='divider'></div>

        <div className='facebook-container' >
          <div>
            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FKing-Street-Coffee-Tobacco-Emporium-100063496593967%2F&tabs=timeline&width=200&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="200" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </div>
        </div>


        <div className='divider'></div>

        <Featured cigars={props.data} />

        <div className='divider'></div>


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


        <NewArrivalList cigars={props.data} />





        <div className='divider'></div>
        <BrandShowcase />

        <div className='divider'></div>

        <section className='flex flex-col gap-4 p-6 bg-primary2/75'>
          <h1 id='podcast' className='text-center text-3xl md:text-5xl font-bold text-secondary2 uppercase my-8'>The Stick Figures</h1>
          <div className='h-1 w-full max-w-[4rem] mx-auto bg-secondary2'></div>
          <p className='
            text-lg md:text-xl text-secondary2
            mx-3 my-3
          '>What does a former 1%er biker, a modern farmer/ tobacconist, redneck battle rapper, and a submarine vet have in common? Nothing except that they are all brothers of the leaf. Tune in with the Stick Figures to hear about cigars, tobacco and life on this comedy cigar podcast.</p>
          <iframe className='px-3 mx-auto max-w-3xl' src="https://open.spotify.com/embed/show/0xpAdXeTXnnh30J0HEVmoz?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

          <div className='podcast-links self-center'>
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




        <section className='staff-section bg-primary2/10 py-16 px-6'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
              <h1 id='staff' className='text-4xl md:text-5xl font-bold text-secondary2 uppercase mb-4'>Meet Our Staff</h1>
              <div className='h-1 w-16 bg-secondary2 mx-auto mb-6'></div>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
              <div className='staff-card group'>
                <div className='staff-card-inner'>
                  <div className='staff-image-wrapper'>
                    <div className='staff-image-container'>
                      <img alt="Edward Trout" src='/edtrout.jpg' className='staff-photo' />
                      <div className='staff-overlay'></div>
                    </div>
                  </div>
                  <div className='staff-content'>
                    <h2 className='staff-name'>Edward Trout</h2>
                    <p className='staff-title'>Sole Proprietor</p>
                    <div className='staff-divider'></div>
                  </div>
                </div>
              </div>
              
              <div className='staff-card group'>
                <div className='staff-card-inner'>
                  <div className='staff-image-wrapper'>
                    <div className='staff-image-container'>
                      <img alt="Ted McDonald" src='/tedmcdonald.jpg' className='staff-photo' />
                    </div>
                  </div>
                  <div className='staff-content'>
                    <h2 className='staff-name'>Ted McDonald</h2>
                    <p className='staff-title'>Master Tobacconist</p>
                    <div className='staff-divider'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



      </Layout>

      <style jsx>
        {`

         .staff-section {
            position: relative;
          }
          
          .staff-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('/kschairs.jpg');
            background-size: cover;
            background-position: center;
            opacity: 0.05;
            z-index: 0;
          }
          
          .staff-section > div {
            position: relative;
            z-index: 1;
          }
          
          .staff-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .staff-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          
          .staff-card-inner {
            background: var(--dl-color-theme-primary2);
            overflow: hidden;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 3px solid var(--dl-color-theme-secondary2);
            position: relative;
          }
          .staff-card-inner::after {
            content: '';
            position: absolute;
            inset: 5px;
            border: 1px solid var(--dl-color-theme-primary1);
            border-radius: 5px;
          }
          
          .staff-card:hover .staff-card-inner::before {
            opacity: 1;
          }
          
          .staff-image-wrapper {
            position: relative;
            overflow: hidden;
          }
          
          .staff-image-container {
            position: relative;
            aspect-ratio: 1;
            width: 100%;
            background: linear-gradient(135deg, var(--dl-color-theme-secondary2), var(--dl-color-theme-primary2));
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          
          .staff-photo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .staff-card:hover .staff-photo {
            transform: scale(1.05);
          }
          
          .staff-card:hover .staff-overlay {
            opacity: 1;
          }
          
          .staff-content {
            padding: 2rem;
            text-align: center;
          }
          
          .staff-name {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--dl-color-theme-secondary2);
            margin-bottom: 0.5rem;
            font-style: italic;
          }
          
          .staff-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--dl-color-theme-primary1);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 1rem;
          }
          
          .staff-divider {
            width: 60px;
            height: 2px;
            background: var(--dl-color-theme-secondary2);
            margin: 1rem auto;
            border-radius: 1px;
          }
          
          .staff-description {
            font-size: 1rem;
            line-height: 1.6;
            color: var(--dl-color-theme-secondary2);
            opacity: 0.8;
          }
          
          @media (max-width: 768px) {
            .staff-section {
              padding: 3rem 1rem;
            }
            
            .staff-name {
              font-size: 1.5rem;
            }
            
            .staff-content {
              padding: 1.5rem;
            }
            
            .staff-image-container {
              height: 240px;
            }
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


        section#testimonials h2 {
          text-align: center;
          font-size: 2em;
          padding: 1em;
        }

        section#testimonials blockquote::before {
          content: '“';
          font-size: 7em;
          position: absolute;
          top: 0.3em;
          left: -0.1em;
          opacity: 0.2;
          font-style: normal;
        }
        section#testimonials blockquote::after {
          content: '”';
          font-size: 7em;
          position: absolute;
          bottom: -0.1em;
          right: -0.1em;
          opacity: 0.2;
          font-style: normal;
        }

        section#testimonials blockquote {
          font-size: 1.2em;
          text-align: center;
          padding: 1em;
          padding-bottom: 5px;
          line-height: 2em;
          position: relative;
          text-align: justify;
          font-style: italic;
        }

        section#testimonials li {
          padding: 20px;
          display: flex;
          flex-direction: column-reverse;
        }

        section#testimonials h3 {
          display: flex;
          flex-direction: column;
          text-align: center;
          gap: 2px;
          width: max-content;
          align-self: center;


          font-size: 1.3em;
          font-weight: 100;
        }

        

        section#testimonials h3 p {
          font-size: 0.7em;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--dl-color-theme-secondary2);
          border-top: 1px solid black;
          padding-top: 3px;
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

          section#testimonials blockquote {
            line-height: 1.5em;
          }
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
