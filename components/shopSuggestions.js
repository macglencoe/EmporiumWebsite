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
                    <h1 style={{ 
                        fontSize: '2.5em', 
                        textTransform: 'uppercase' 
                        
                        }}>Search&nbsp;</h1>
                    <h1 style={{ fontSize: '3em', textTransform: 'uppercase', fontWeight: '900'}}>{props.title}</h1>
                    <h1 style={{ fontSize: '2.5em', textTransform: 'uppercase' }}>&nbsp;By:</h1>
                </div>

                <div className='shop-suggestions' >
                    {
                        props.items.map((item, index) => (
                            <Link href={item.href} key={index} >
                                <a tabIndex={0} aria-label={'Search' + props.title + 'By' + item.label}>
                                    <div className="shop-suggestions-card">
                                        <span>{item.label}</span>
                                    </div>
                                </a>
                            </Link>
                        ))
                    }
                </div>
            </region>
            <style jsx>
                {`
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
        }
        .shop-suggestions-card > span {
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
        }
        @media (max-width: 1200px) {
          .shop-suggestions {
            flex-direction: column;
            }
        }
                `}
            </style>
        </>
    )
}

export default ShopSuggestions