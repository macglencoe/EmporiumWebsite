import JsBarcode from "jsbarcode"
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
                    .CatalogCardField {
  flex: 0 0 auto;
  width: 100%;
  height: auto;
  display: flex;
  padding: var(--dl-space-space-unit);
  align-self: center;
  align-items: flex-start;
  justify-content: space-between;
}
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
            .CatalogCardField {
                padding-left: 0px;
                padding-right: 0px;
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
                        <div className="CatalogCardImage">
                            {props.image && (
                                <img src={props.image} alt={props.title} onError={(e) => { e.target.style.display = "none" }} />
                            )}

                        </div>

                        <div className="catalog-container47 CatalogCardName">

                            <span className="card-name-text"><i>{props.secondaryTitle}</i> <b>{props.name} {props.title}</b></span>

                        </div>
                    </div>
                    <div className="card-content">

                        {props.data &&
                            props.data.map((field) => {

                                if (field == null || field[1] == null) {
                                    return null
                                }
                                return (
                                    <CatalogCardField
                                        label={field[0]}
                                        value={field[1]}
                                    />)
                            })}

                        {props.barcode && (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <canvas ref={(canvas) => {
                                    if (canvas) {
                                        JsBarcode(canvas, props.barcode, {
                                            format: "CODE128",
                                            width: 2,
                                            height: 30,
                                            fontSize: 18,
                                        });
                                    }
                                }} />
                            </div>
                        )}



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
        .CatalogCardImage img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .CatalogCardImage {
            width: var(--dl-size-size-xlarge);
            height: auto;
            margin: var(--dl-space-space-unit);
            display: flex;
            align-self: center;
            align-items: flex-start;
            aspect-ratio: 1/1;
            overflow: hidden;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
            }
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
            text-transform: uppercase;
          }
        card-name-text b {
            font-weight: 800;
        }
        card-name-text i {
            font-weight: 200;
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