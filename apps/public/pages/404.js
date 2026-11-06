import React from 'react'
import Head from 'next/head'
import Layout from '../components/layout.js'
import PageTitle1 from '../components/pagetitle1.js'
import { useRouter } from 'next/router.js'

const NotFound = (props) => {
  const router = useRouter();
  return (
    <>
      <Layout>
        <PageTitle1>Page Not Found</PageTitle1>
        <div className='container'>
          <div className='backdrop'></div>
          <div className='not-found-container'>
            <div className='backdrop'></div>
            <h2 className='not-found-text'>404</h2>
            <span className='not-found-text'>{router.asPath ? router.asPath : "This page"} doesn't exist</span>
            <p>Are you sure the URL is correct?</p>
            <a href='/'>Go Home</a>
            <button onClick={router.back}>Go Back</button>
          </div>
        </div>
      </Layout>

      <style jsx>
        {`
          .not-found-container {
            display: flex;
            gap: 2em;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            padding: 20px;
            margin: 20px;
            z-index: 1;
            position: relative;
          }
          .not-found-container *:not(.backdrop) {
            z-index: 2;
          }
          .not-found-container h2 {
            color: var(--dl-color-theme-secondary2);
            font-size: 4em;
            font-weight: 900;
            font-family: Inter;
          }
          .not-found-container span {
            color: var(--dl-color-theme-secondary2);
            font-size: 2em;
            text-align: center;
          }
          .not-found-container p {
            text-align: center;
          }
          .not-found-container button, .not-found-container a {
            padding: 0.5em 1em;
            background-color: var(--dl-color-theme-secondary2);
            color: var(--dl-color-theme-primary1);
            font-weight: bold;
            cursor: pointer;
            font-family: Inter;
            text-transform: uppercase;
            border: 3px solid transparent;
          }
          .not-found-container a:nth-child(odd), .not-found-container button:nth-child(odd) {
            background-color: transparent;
            border: 3px solid var(--dl-color-theme-secondary2);
            color: var(--dl-color-theme-secondary2);
          }
          .not-found-container::before, .not-found-container::after {
            content: "";
            width: 100%;
            height: 5px;
            background-color: var(--dl-color-theme-secondary2);
            z-index: 2;
          }
          .container {
            width: 100%;
            display: flex;
            position: relative;
          }
          .backdrop {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 0;
          }
          .container > .backdrop {
            background-image: url("/kschairs.jpg");
            background-size: cover;
            background-position: left;
            opacity: 0.65;
          }
          .not-found-container > .backdrop {
            background-color:rgba(255, 254, 218, 0.6);
            backdrop-filter: blur(10px);
          }
        `}
      </style>
    </>
  )
}

export default NotFound
