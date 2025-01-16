import Link from "next/link"

const CatalogCardField = (props) => {
    return (
        <>
            <div className="CatalogCardField">
                <span className="catalog-text174">
                    {props.label}
                    <br></br>
                </span>
                <span className="catalog-text177">
                    {props.value}
                    <br></br>
                </span>
            </div>
            <style jsx>
                {
                    `
        .catalog-text174 {
            font-size: 20px;
            font-style: normal;
            text-align: left;
            font-weight: 600;
        }
        .catalog-text177 {
            font-size: 25px;
            align-self: flex-start;
            font-style: normal;
            text-align: right;
            font-weight: 400;
        }
        @media (max-width: 680px) {
            .catalog-text174 {
                font-size: 18px;
            }
            .catalog-text177 {
                font-size: 18px;
            }
        }
        
                    `
                }
            </style>
        </>
    )
}


const CatalogCard = (props) => {

    return (
        <>
            <Link href={props.href}><a className="catalog-card-parent">
                <div className="catalog-catalog-card catalogCard">

                    <div className="card-head">
                        <div className="CatalogCardImage"></div>
    
                        <div className="catalog-container47 CatalogCardName">
    
                            <span className="card-name-text">{props.title}</span>
    
                        </div>
                    </div>
                    <div className="card-content">

                        {props.data &&
                            props.data.map((field) => {
                                return (
                                    <CatalogCardField
                                        label={field[0]}
                                        value={field[1]}
                                    />)
                            })}


                        <div className="catalog-container50">
                            {props.buttonText &&
                                <button type="button" className="catalog-button2 button">
                                    {props.buttonText}
                                </button>}
                        </div>


                    </div>
                </div>
            </a></Link>
            <style jsx>
                {
                    `
        .card-head {
                    justify-items: center;
        }
        .catalog-catalog-card {
            justify-content: space-between;
            display: flex;
        }
        .catalog-container47 {
            align-self: center;
            display: flex
          }
        .card-name-text {
            transition: text-decoration 0.3s ease-in-out;
            font-size: 30px;
            font-style: normal;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
          }
        .catalog-container50 {
            gap: var(--dl-space-space-twounits);
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: center;
            align-items: flex-start;
            justify-content: center;
          }
        .catalog-button2 {
            fill: var(--dl-color-theme-neutral-light);
            color: var(--dl-color-theme-neutral-light);
            font-size: 25px;
            align-self: flex-end;
            font-style: normal;
            font-weight: 700;
            border-width: 0px;
            text-transform: uppercase;
            background-color: var(--dl-color-theme-secondary2);
            box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.25);
          }
        .card-content {
            width: 100%;
        }
        @media (max-width: 680px) {
            .catalog-catalog-card {
                max-width: 100%;
                flex-direction: row;
                
            }
            .CatalogCardImage {
                width: 100px;
            }
            .card-name-text {
                font-size: 18px;
            }
            .catalog-button2 {
                font-size: 15px;
            }
            .card-content {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding-right: 10px;
                width: 100%;
            }
            .card-head {
                width: auto;
            }
        }
                    `
                }
            </style>
        </>
    )
}

export default CatalogCard