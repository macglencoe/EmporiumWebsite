// components/AgeVerificationModal.js
import { useEffect } from 'react';
import Head from 'next/head';

/**
 * AgeVerificationModal is a React component that displays a modal
 * to confirm if the user is over 21 years old. It prevents scrolling
 * on the body when the modal is open and restores it when closed.
 * 
 * Props:
 * - onConfirm: A function to be called when the user confirms their age.
 * 
 * Accessibility:
 * - The modal uses semantic HTML elements and aria attributes to improve accessibility.
 */

const AgeVerificationModal = ({ onConfirm }) => {
  useEffect(() => {
    // Prevent scrolling when the modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
        <Head>
          <title>Age Verification</title>
        </Head>
        <div className='overlay'>
          <div className='content' aria-label="Age Verification Modal">
            <p>Are you over 21 years old?</p>
            <button onClick={onConfirm} aria-label="Confirm Age">Yes</button>
          </div>
        </div>
        <style jsx>
            {`
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: url('/ks-storefront.jpg');
                background-size: cover;
                background-position: center;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .content {
                background-color: var(--dl-color-theme-primary1);
                gap: 20px;
                padding: 20px;
                text-align: center;
                align-items: center;
                filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.5));
                border: none;
                width: auto;
                height: auto;
            }
            p {
                color: var(--dl-color-theme-secondary2);
                font-size: 20px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
            }
            button {
                background-color: var(--dl-color-theme-secondary2);
                padding: 10px;
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                color: var(--dl-color-theme-primary2);
                border: none;
                cursor: pointer;
            }
            button:hover {
                background-color: var(--dl-color-theme-primary2);
                color: var(--dl-color-theme-primary1);
            }
            `}
        </style>
    </>
  );
};


export default AgeVerificationModal;
