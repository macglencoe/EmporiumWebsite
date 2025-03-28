import Link from "next/link"


const ShopSuggestions = (props) => {
  return (
    <>
      <region className='shop-suggestions-container'>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          flexWrap: 'wrap',
          flexDirection: 'row'
        }}>
          <h1>Search&nbsp;
          <b>{props.title}</b>
          &nbsp;by:</h1>
        </div>

        <div className='shop-suggestions' >
          {
            props.items.map((item, index) => (
              <Link href={item.href} key={index} >
                <a tabIndex={0} aria-label={'Search' + props.title + 'By' + item.label}>
                  <button className="shop-suggestions-card">
                    <span>{item.label}</span>
                  </button>
                </a>
              </Link>
            ))
          }
        </div>
      </region>
      <style jsx>
        {`

        h1 {
          font-size: 2em;
          font-weight: normal;
          font-style: italic;
        }
        h1 b {
          font-variant: small-caps;
          font-weight: bold;
          color: var(--dl-color-theme-secondary1);
        }
                .shop-suggestions-container {
          display: flex;
          flex-direction: column;
          gap: 1em;
          padding: 10px;
          align-items: start;;
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
          transition: all 0.3s ease-out;
        }
        .shop-suggestions-card > span {
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          transition: all 0.3s ease-out;
            color: var(--dl-color-theme-secondary2);
        }
        a:hover .shop-suggestions-card,
        a:focus .shop-suggestions-card{
            outline: none;
          transform: translateY(-10px);
          box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.3);
        }
        a:hover .shop-suggestions-card > span,
        a:focus .shop-suggestions-card > span {
          color: var(--dl-color-theme-secondary1);
        }
        @media (max-width: 1200px) {
          .shop-suggestions {
            flex-direction: column;
            }
        }
        @media (max-width: 680px) {
          .shop-suggestions-card > span {
            color: var(--dl-color-theme-secondary1);
          }
        }
                `}
      </style>
    </>
  )
}

export default ShopSuggestions