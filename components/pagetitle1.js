

const PageTitle1 = (props) => {
    return (
        <>
            <div className="cigar-page-container31">
                <span className="cigar-page-text116">{props.children}</span>
                <div className="cigar-page-container32"></div>
            </div>
            <style jsx>
            {`
        .cigar-page-container31 {
            gap: var(--dl-space-space-unit);
            width: 100%;
            height: 64px;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: center;
            background-color: var(--dl-color-theme-secondary2);
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