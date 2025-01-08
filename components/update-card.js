import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

const UpdateCard = (props) => {
  return (
    <>
      <div className={`update-card-update-card ${props.rootClassName} `}>
        <div className="update-card-update-header-container">
          <h1 className="update-card-text1">
            {props.heading ?? (
              <Fragment>
                <span className="update-card-text4">
                  <span>La Aroma de Cuba Event</span>
                  <br></br>
                </span>
              </Fragment>
            )}
          </h1>
          <span className="update-card-text2">
            {props.text1 ?? (
              <Fragment>
                <span className="update-card-text3">
                  Thursday, April 4, 2019 at 2 PM – 6 PM
                </span>
              </Fragment>
            )}
          </span>
        </div>
      </div>
      <style jsx>
        {`
          .update-card-update-card {
            width: 100%;
            height: 104px;
            display: flex;
            position: relative;
            align-self: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            justify-content: flex-start;
            background-color: var(--dl-color-theme-secondary1);
          }
          .update-card-update-header-container {
            flex: 0 0 auto;
            width: 100%;
            height: fit-content;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: flex-start;
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            justify-content: center;
            background-color: var(--dl-color-theme-secondary1);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          .update-card-text1 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            height: auto;
            font-size: 1.2em;
            line-height: 1;
          }
          .update-card-text2 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
          }
          .update-card-text3 {
            display: inline-block;
          }
          .update-card-text4 {
            display: inline-block;
          }
          @media (max-width: 991px) {
            .update-card-update-header-container {
              height: var(--dl-size-size-small);
            }
            .update-card-text1 {
              height: auto;
              text-align: left;
            }
          }
          @media (max-width: 767px) {
            .update-card-text1 {
              height: auto;
            }
          }
        `}
      </style>
    </>
  )
}

UpdateCard.defaultProps = {
  rootClassName: '',
  text1: undefined,
  heading: undefined,
}

UpdateCard.propTypes = {
  rootClassName: PropTypes.string,
  text1: PropTypes.element,
  heading: PropTypes.element,
}

export default UpdateCard
