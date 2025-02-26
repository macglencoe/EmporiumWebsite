import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

const DirectoryCard = (props) => {
  return (
    <>
      <div
        className={`directory-card-container1 directoryCard ${props.rootClassName} `}
      >
        <div className="directory-card-container2">
          <span className="directory-card-text1">
            {props.text ?? (
              <Fragment>
                <span className="directory-card-text2">
                  <span>Cigars</span>
                  <br></br>
                </span>
              </Fragment>
            )}
          </span>
        </div>
      </div>
      <style jsx>
        {`
          .directory-card-container1 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .directory-card-container2 {
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: center;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            justify-content: space-between;
            background-color: var(--dl-color-theme-secondary1);
          }
          .directory-card-text1 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
            font-style: normal;
            text-align: center;
            font-weight: 700;
          }
          .directory-card-text2 {
            display: inline-block;
          }
          @media (max-width: 1600px) {
            .directory-card-container1 {
              height: auto;
            }
          }
        `}
      </style>
    </>
  )
}

DirectoryCard.defaultProps = {
  rootClassName: '',
  text: undefined,
}

DirectoryCard.propTypes = {
  rootClassName: PropTypes.string,
  text: PropTypes.element,
}

export default DirectoryCard
