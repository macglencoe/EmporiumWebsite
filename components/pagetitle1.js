

const PageTitle1 = (props) => {
    return (
        <>
            <div className="page-title-container">
              <div className="cigar-page-container31">
                  <span className="cigar-page-text116">{props.children}</span>
                  <div className="cigar-page-container32"></div>
              </div>
              {props.subtitle && <span>{props.subtitle}</span>}
            </div>
            <style jsx>
            {`
        .page-title-container {
          background-color: var(--dl-color-theme-secondary2);
          padding: var(--dl-space-space-unit);
          display: flex;
          flex-direction: column;
          gap: 0.7em;
        }
        .page-title-container > span {
          color: var(--dl-color-theme-primary1);
          font-weight: 600;
        }
        .cigar-page-container31 {
            gap: var(--dl-space-space-unit);
            width: 100%;
            display: flex;
            align-items: center;
          }
        .cigar-page-text116 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
          }
        .cigar-page-container32 {
            flex: 1;
            width: 100%;
            height: 10px;
            display: flex;
            align-items: center;
            background-color: var(--dl-color-theme-primary1);
          }
            
            `}
            </style>
        </>
    )
}

export default PageTitle1;