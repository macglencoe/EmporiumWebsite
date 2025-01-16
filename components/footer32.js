import React, { Fragment } from 'react'

import PropTypes from 'prop-types'
import Link from 'next/link'

const Footer32 = (props) => {
  // Location

  let address = "320 W King Street";
  let city = "Martinsburg";
  let state = "West Virginia";

  const handleLocationClick = () => {
    const encodedAddress = encodeURIComponent(`${address}, ${city}, ${state}`);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let mapUrl;
    if (isMobile) {
      // Use platform-specific maps app links
      if (navigator.userAgent.match(/Android/i)) {
        mapUrl = `geo:0,0?q=${encodedAddress}`; // Android
      } else if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i)) {
        mapUrl = `http://maps.apple.com/?q=${encodedAddress}`; // iOS
      } else {
        mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
      }
    } else {
      mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }

    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };
  return (
    <>
      <footer
        className={`footer32-footer4 thq-section-padding ${props.rootClassName} `}
      >
        <div className="footer32-max-width thq-section-max-width">
          <div className="footer32-content">

            <div className="footer32-links">
              <a
                href="/about"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link1 ?? (
                  <Fragment>
                    <span className="footer32-text4">About Us</span>
                  </Fragment>
                )}
              </a>

              <a
                href="/contact"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link4 ?? (
                  <Fragment>
                    <span className="footer32-text1">Contact Us</span>
                  </Fragment>
                )}
              </a>
              <a
                href="https://www.google.com/maps/place/320+W+King+St,+Martinsburg,+WV+25401"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link5 ?? (
                  <Fragment>
                    <span className="footer32-text6" >Visit Us</span>
                  </Fragment>
                )}
              </a>
            </div>
            <div className="footer32-social-links">
              <svg
                viewBox="0 0 877.7142857142857 1024"
                className="thq-icon-small"
              >
                <Link href="https://www.facebook.com/p/King-Street-Coffee-Tobacco-Emporium-100063496593967/">
                  <a>
                    <path d="M713.143 73.143c90.857 0 164.571 73.714 164.571 164.571v548.571c0 90.857-73.714 164.571-164.571 164.571h-107.429v-340h113.714l17.143-132.571h-130.857v-84.571c0-38.286 10.286-64 65.714-64l69.714-0.571v-118.286c-12-1.714-53.714-5.143-101.714-5.143-101.143 0-170.857 61.714-170.857 174.857v97.714h-114.286v132.571h114.286v340h-304c-90.857 0-164.571-73.714-164.571-164.571v-548.571c0-90.857 73.714-164.571 164.571-164.571h548.571z"></path>

                  </a>
                </Link>              </svg>
              <svg
                viewBox="0 0 877.7142857142857 1024"
                className="thq-icon-small"
              >
                <Link href="https://www.instagram.com/kingstreetcigarwv/">
                  <a>
                    <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path>

                  </a>
                </Link>              </svg>

            </div>
          </div>
          <div className="footer32-credits">
            <div className="thq-divider-horizontal"></div>
            <div className="footer32-row">
              <div className="footer32-footer-links">
                
                
              </div>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>
        {`
          .footer32-footer4 {
            gap: 80px;
            width: 100%;
            height: auto;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: center;
            flex-shrink: 0;
            flex-direction: column;
            justify-content: center;
          }
          .footer32-max-width {
            gap: var(--dl-space-space-threeunits);
            display: flex;
            align-items: center;
            flex-direction: column;
          }
          .footer32-content {
            gap: 32px;
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-shrink: 0;
            justify-content: center;
          }
          .footer32-logo {
            gap: 24px;
            width: auto;
            display: flex;
            overflow: hidden;
            flex-grow: 1;
            align-items: flex-start;
            flex-shrink: 0;
            flex-direction: column;
          }
          .footer32-image1 {
            height: 2rem;
          }
          .footer32-links {
            gap: var(--dl-space-space-twounits);
            display: flex;
            align-items: flex-start;
          }
          .footer32-social-links {
            gap: var(--dl-space-space-unit);
            display: flex;
            flex-grow: 1;
            align-items: center;
            justify-content: flex-end;
          }
          .footer32-credits {
            gap: var(--dl-space-space-twounits);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .footer32-row {
            gap: 24px;
            display: flex;
            align-items: flex-start;
          }
          .footer32-footer-links {
            gap: var(--dl-space-space-oneandhalfunits);
            display: flex;
            align-items: flex-start;
          }
          .footer32-text1 {
            display: inline-block;
          }
          .footer32-text2 {
            display: inline-block;
          }
          .footer32-text3 {
            display: inline-block;
          }
          .footer32-text4 {
            display: inline-block;
          }
          .footer32-text5 {
            display: inline-block;
          }
          .footer32-text6 {
            display: inline-block;
          }
          .footer32-text7 {
            display: inline-block;
          }
          .footer32-text8 {
            display: inline-block;
          }
          .footer32root-class-name {
            height: 100%;
          }
          .footer32root-class-name1 {
            height: 100%;
          }
          .footer32root-class-name2 {
            height: 100%;
          }
          @media (max-width: 1600px) {
            .footer32-content {
              flex-direction: column;
            }
          }
          @media (max-width: 1200px) {
            .footer32-content {
              align-items: flex-start;
            }
            .footer32-links {
              flex-direction: column;
            }
            .footer32-credits {
              align-items: flex-start;
            }
            .footer32-row {
              flex-direction: column;
            }
            .footer32-footer-links {
              flex-direction: column;
            }
          }
          @media (max-width: 991px) {
            .footer32-footer4 {
              height: auto;
            }
            .footer32-logo {
              width: auto;
            }
          }
          @media (max-width: 767px) {
            .footer32-content {
              width: 100%;
            }
            .footer32-links {
              width: 100%;
            }
            .footer32-row {
              flex-direction: column;
            }
            .footer32-footer-links {
              align-items: center;
              flex-direction: column;
              justify-content: center;
            }
          }
          @media (max-width: 479px) {
            .footer32-footer4 {
              overflow: auto;
            }
            .footer32-max-width {
              gap: var(--dl-space-space-oneandhalfunits);
            }
            .footer32-content {
              width: 100%;
            }
            .footer32-links {
              width: 100%;
              align-items: center;
              flex-direction: column;
              justify-content: center;
            }
          }
        `}
      </style>
    </>
  )
}

Footer32.defaultProps = {
  link4: undefined,
  termsLink: undefined,
  logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
  privacyLink: undefined,
  rootClassName: '',
  link1: undefined,
  link3: undefined,
  link5: undefined,
  cookiesLink: undefined,
  logoAlt: 'King Street Emporium Logo',
  link2: undefined,
}

Footer32.propTypes = {
  link4: PropTypes.element,
  termsLink: PropTypes.element,
  logoSrc: PropTypes.string,
  privacyLink: PropTypes.element,
  rootClassName: PropTypes.string,
  link1: PropTypes.element,
  link3: PropTypes.element,
  link5: PropTypes.element,
  cookiesLink: PropTypes.element,
  logoAlt: PropTypes.string,
  link2: PropTypes.element,
}

export default Footer32
