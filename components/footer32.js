import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

const Footer32 = (props) => {
  return (
    <>
      <footer
        className={`footer32-footer4 thq-section-padding ${props.rootClassName} `}
      >
        <div className="footer32-max-width thq-section-max-width">
          <div className="footer32-content">
            <div className="footer32-logo">
              <img
                alt={props.logoAlt}
                src={props.logoSrc}
                className="footer32-image1"
              />
            </div>
            <div className="footer32-links">
              <a
                href="https://example.com"
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
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link2 ?? (
                  <Fragment>
                    <span className="footer32-text8">Shop</span>
                  </Fragment>
                )}
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link3 ?? (
                  <Fragment>
                    <span className="footer32-text5">Events</span>
                  </Fragment>
                )}
              </a>
              <a
                href="https://example.com"
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
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link5 ?? (
                  <Fragment>
                    <span className="footer32-text6">Visit Us</span>
                  </Fragment>
                )}
              </a>
            </div>
            <div className="footer32-social-links">
              <svg
                viewBox="0 0 877.7142857142857 1024"
                className="thq-icon-small"
              >
                <path d="M713.143 73.143c90.857 0 164.571 73.714 164.571 164.571v548.571c0 90.857-73.714 164.571-164.571 164.571h-107.429v-340h113.714l17.143-132.571h-130.857v-84.571c0-38.286 10.286-64 65.714-64l69.714-0.571v-118.286c-12-1.714-53.714-5.143-101.714-5.143-101.143 0-170.857 61.714-170.857 174.857v97.714h-114.286v132.571h114.286v340h-304c-90.857 0-164.571-73.714-164.571-164.571v-548.571c0-90.857 73.714-164.571 164.571-164.571h548.571z"></path>
              </svg>
              <svg
                viewBox="0 0 877.7142857142857 1024"
                className="thq-icon-small"
              >
                <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path>
              </svg>
              <svg
                viewBox="0 0 950.8571428571428 1024"
                className="thq-icon-small"
              >
                <path d="M925.714 233.143c-25.143 36.571-56.571 69.143-92.571 95.429 0.571 8 0.571 16 0.571 24 0 244-185.714 525.143-525.143 525.143-104.571 0-201.714-30.286-283.429-82.857 14.857 1.714 29.143 2.286 44.571 2.286 86.286 0 165.714-29.143 229.143-78.857-81.143-1.714-149.143-54.857-172.571-128 11.429 1.714 22.857 2.857 34.857 2.857 16.571 0 33.143-2.286 48.571-6.286-84.571-17.143-148-91.429-148-181.143v-2.286c24.571 13.714 53.143 22.286 83.429 23.429-49.714-33.143-82.286-89.714-82.286-153.714 0-34.286 9.143-65.714 25.143-93.143 90.857 112 227.429 185.143 380.571 193.143-2.857-13.714-4.571-28-4.571-42.286 0-101.714 82.286-184.571 184.571-184.571 53.143 0 101.143 22.286 134.857 58.286 41.714-8 81.714-23.429 117.143-44.571-13.714 42.857-42.857 78.857-81.143 101.714 37.143-4 73.143-14.286 106.286-28.571z"></path>
              </svg>
              <svg
                viewBox="0 0 877.7142857142857 1024"
                className="thq-icon-small"
              >
                <path d="M135.429 808h132v-396.571h-132v396.571zM276 289.143c-0.571-38.857-28.571-68.571-73.714-68.571s-74.857 29.714-74.857 68.571c0 37.714 28.571 68.571 73.143 68.571h0.571c46.286 0 74.857-30.857 74.857-68.571zM610.286 808h132v-227.429c0-121.714-65.143-178.286-152-178.286-70.857 0-102.286 39.429-119.429 66.857h1.143v-57.714h-132s1.714 37.143 0 396.571v0h132v-221.714c0-11.429 0.571-23.429 4-32 9.714-23.429 31.429-48 68-48 47.429 0 66.286 36 66.286 89.714v212zM877.714 237.714v548.571c0 90.857-73.714 164.571-164.571 164.571h-548.571c-90.857 0-164.571-73.714-164.571-164.571v-548.571c0-90.857 73.714-164.571 164.571-164.571h548.571c90.857 0 164.571 73.714 164.571 164.571z"></path>
              </svg>
              <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                <path d="M406.286 644.571l276.571-142.857-276.571-144.571v287.429zM512 152c215.429 0 358.286 10.286 358.286 10.286 20 2.286 64 2.286 102.857 43.429 0 0 31.429 30.857 40.571 101.714 10.857 82.857 10.286 165.714 10.286 165.714v77.714s0.571 82.857-10.286 165.714c-9.143 70.286-40.571 101.714-40.571 101.714-38.857 40.571-82.857 40.571-102.857 42.857 0 0-142.857 10.857-358.286 10.857v0c-266.286-2.286-348-10.286-348-10.286-22.857-4-74.286-2.857-113.143-43.429 0 0-31.429-31.429-40.571-101.714-10.857-82.857-10.286-165.714-10.286-165.714v-77.714s-0.571-82.857 10.286-165.714c9.143-70.857 40.571-101.714 40.571-101.714 38.857-41.143 82.857-41.143 102.857-43.429 0 0 142.857-10.286 358.286-10.286v0z"></path>
              </svg>
            </div>
          </div>
          <div className="footer32-credits">
            <div className="thq-divider-horizontal"></div>
            <div className="footer32-row">
              <div className="footer32-footer-links">
                <span className="thq-body-small">© 2024 TeleportHQ</span>
                <span className="thq-body-small">
                  {props.privacyLink ?? (
                    <Fragment>
                      <span className="footer32-text3">Privacy Policy</span>
                    </Fragment>
                  )}
                </span>
                <span className="thq-body-small">
                  {props.termsLink ?? (
                    <Fragment>
                      <span className="footer32-text2">
                        Terms and Conditions
                      </span>
                    </Fragment>
                  )}
                </span>
                <span className="thq-body-small">
                  {props.cookiesLink ?? (
                    <Fragment>
                      <span className="footer32-text7">Cookies Policy</span>
                    </Fragment>
                  )}
                </span>
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
