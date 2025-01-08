import Script from "next/script"
import Contact from "./contact"

const RightSidebar = () => {
    return (


        <div className="container1 sidebar">
            <div id="fb-root"></div>
            <Script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0"></Script>

            <div className="catalog-container74">
                <span className="catalog-text235">The King Street Emporium</span>
                <button
                    id="closer"
                    type="button"
                    className="catalog-button7 button"
                >
                    Button
                </button>
            </div>
            <Contact></Contact>
            <div className="catalog-container94">
                <div className="catalog-container95">
                    <div className="directoryCard">
                        <span className="catalog-text259">Cigar Catalogue</span>
                    </div>
                </div>
                <div className="catalog-container97">
                    <div className="directoryCard catalog-container98">
                        <span className="catalog-text260">Pipes &amp; Tobacco</span>
                    </div>
                </div>
                <div className="catalog-container99">
                    <div className="directoryCard">
                        <span className="catalog-text261">Coffee &amp; Tea</span>
                    </div>
                </div>
                <div className="catalog-container101">
                    <div className="directoryCard">
                        <span className="catalog-text262">Accessories</span>
                    </div>
                </div>
            </div>
            <div className="fb-container">
                <div class="fb-page" data-href="https://www.facebook.com/p/King-Street-Coffee-Tobacco-Emporium-100063496593967/" data-tabs="timeline" data-width="280" data-height="" data-small-header="false" data-adapt-container-width="true" data-hide-cover="true" data-show-facepile="true"><blockquote cite="https://www.facebook.com/p/King-Street-Coffee-Tobacco-Emporium-100063496593967/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/p/King-Street-Coffee-Tobacco-Emporium-100063496593967/">King Street Coffee &amp; Tobacco Emporium</a></blockquote></div>
            </div>
            <style jsx>
                {`

                .fb-container {
                    background-color: var(--dl-color-theme-secondary2);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                }
                .sidebar {
                    gap: 3px;
                    flex: 0 0 auto;
                    width: 300px;
                    border: 2px dashed rgba(120, 120, 120, 0.4);
                    height: 100%;
                    display: flex;
                    align-items: flex-start;
                    border-color: var(--dl-color-theme-secondary1);
                    border-width: 0px;
                    flex-direction: column;
                    background-color: var(--dl-color-theme-secondary1);
                }
                .container1 {
                    flex: 1;
                    width: 100%;
                    height: 100px;
                    display: none;
                    align-items: flex-start;
                    justify-content: center;
                }
                .catalog-container74 {
                    flex: 1;
                    width: 100%;
                    height: 100px;
                    display: none;
                    align-items: flex-start;
                    justify-content: center;
                }
                .directoryCard {
                    flex: 0 0 auto;
                    width: 100%;
                    border: 2px dashed rgba(120, 120, 120, 0.4);
                    height: auto;
                    display: flex;
                    padding: var(--dl-space-space-unit);
                    align-items: flex-end;
                    border-width: 0px;
                    border-radius: var(--dl-radius-radius-radius8);
                    flex-direction: column;
                    justify-content: flex-end;
                    background-color: transparent;
                    background-image: var(--dl-gradient-gradients-secondary2gradient);
                }
                .catalog-button7 {
                    float: right;
                    width: 30px;
                    height: 30px;
                    display: block;
                    padding: 0px;
                    font-size: 1px;
                    font-style: normal;
                    font-weight: 300;
                    border-width: 0px;
                    border-radius: 50%;
                    background-color: var(--dl-color-theme-primary2);
                }
                
                
                @media(max-width: 479px) {
                    .container1 { 
                        width: 100%;
                        overflow: auto;
                        margin-right: var(--dl-space-space-halfunit);
                    }
                    .catalog-container74 {
                        height: 75px;
                        display: flex;
                        padding: var(--dl-space-space-unit);
                        align-items: center;
                        justify-content: space-between;
                    }
                    .catalog-text235 {
                        fill: var(--dl-color-theme-primary2);
                        color: var(--dl-color-theme-primary2);
                        font-size: 25px;
                        font-style: normal;
                        font-weight: 700;
                    }
                }
                
              
            `}
            </style>
        </div>

    )
}

export default RightSidebar