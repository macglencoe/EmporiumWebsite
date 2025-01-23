import { use } from "react";
import { useRouter } from "next/router";

import Data from "../public/data/consolidated_cigars.json"



const SearchBy = (props) => {

    const router = useRouter();

    let data = Data


    let uniqueBrands = [];
    if (props.flatmap) {
        uniqueBrands = [
            ...new Set(Data.flatMap(item => item[props.flatmap].map(size => size.trim())))
        ].sort((a, b) => a.localeCompare(b))
    } else {
        uniqueBrands = [...new Set(data.map(item => item[props.field].trim()))].sort((a, b) => a.localeCompare(b));
    }




    return (
        <>
            <div className='divider'></div>

            <h1 style={{
                width: '100%',
                textAlign: 'center',
                padding: '20px',
            }}>{props.title}</h1>

            <div style={
                {
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gridAutoRows: '40px',
                    gridGap: '20px',
                    padding: '20px',
                }
            }>
                {uniqueBrands.sort().map((brand, index, arr) => {
                    if (brand === '') {
                        return null;
                    }

                    const firstLetter = brand.charAt(0);
                    const prevFirstLetter = index > 0 ? arr[index - 1].charAt(0) : null;
                    const showLetter = index === 0 || firstLetter !== prevFirstLetter;

                    return (
                        <div key={index} className='brand-container' tabIndex={0}>
                            {showLetter && <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{firstLetter}</span>}

                            <div className='brand-label-container' onClick={() => router.push({
                                pathname: '/cigars',
                                query: { [props.field]: brand },
                            })}>
                                <span>{brand}</span>
                            </div>
                        </div>
                    );
                })}
            </div>


        
            <style jsx>{`
                .brand-container {
            display: flex;
            flex-direction: row;
            gap: 10px;
            
          }
          .brand-label-container {
            border-bottom: 2px solid var(--dl-color-theme-secondary2);
            cursor: pointer;
            width: 100%;
            
          }
          
          .brand-label-container:hover {
              border-bottom: 5px solid var(--dl-color-theme-secondary2);
          }
          .brand-label-container > span {
            font-size: 15px;
            font-weight: 500;
          }
          .brand-label-container:hover > span {
              color: var(--dl-color-theme-secondary2);
              font-weight: 900;
          }
          


          .divider {
            background-color: var(--dl-color-theme-secondary2);
            width: 100%;
            height: 10px;
            min-height: 10px;
          }
                
            `}</style>
        </>
    )
}

export default SearchBy