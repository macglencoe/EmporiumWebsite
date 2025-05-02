import React, { useEffect, useState } from 'react'

export const Featured = ({cigars}) => {
    const [feature_Week, setFeature_Week] = useState([]);
    const [feature_Eds_Pick, setFeature_Eds_Pick] = useState([]);
    const [feature_Teds_Pick, setFeature_Teds_Pick] = useState([]);
    const [feature_StickFigures, setFeature_StickFigures] = useState([]);

    useEffect(() => {
        setFeature_Week(cigars.filter(cigar => cigar['featured_Week']).sort((a, b) => new Date(b['featured_Week']) - new Date(a['featured_Week'])));
        setFeature_Eds_Pick(cigars.filter(cigar => cigar['featured_Eds_Pick']).sort((a, b) => new Date(b['featured_Eds_Pick']) - new Date(a['featured_Eds_Pick'])));
        setFeature_Teds_Pick(cigars.filter(cigar => cigar['featured_Teds_Pick']).sort((a, b) => new Date(b['featured_Teds_Pick']) - new Date(a['featured_Teds_Pick'])));
        setFeature_StickFigures(cigars.filter(cigar => cigar['featured_StickFigures']).sort((a, b) => new Date(b['featured_StickFigures']) - new Date(a['featured_StickFigures'])));
    }, [cigars])

    return (
        <>
            <div className='featured'>
            <h1>Featured Cigars</h1>
            <div className="spread">
                { feature_Week.length > 0 &&
                    <div className='feature week'>
                    <h2>Cigar of the Week</h2>
                    <b>{feature_Week[0]['featured_Week']}</b>
                    <p><a href={ '/cigars/' +feature_Week[0]['slug']}><i>{feature_Week[0]['Cigar Brand']} </i>{feature_Week[0]['Cigar Name']}</a></p>
                </div>}
                { feature_Eds_Pick.length > 0 &&
                    <div className='feature eds-Pick'>
                    <h2>Ed's Pick</h2>
                    <b>{feature_Eds_Pick[0]['featured_Eds_Pick']}</b>
                    <p><a href={ '/cigars/' +feature_Eds_Pick[0]['slug']}><i>{feature_Eds_Pick[0]['Cigar Brand']} </i>{feature_Eds_Pick[0]['Cigar Name']}</a></p>
                </div>}
                { feature_Teds_Pick.length > 0 &&
                    <div className='feature teds-Pick'>
                    <h2>Ted's Pick</h2>
                    <b>{feature_Teds_Pick[0]['featured_Teds_Pick']}</b>
                    <p><a href={ '/cigars/' +feature_Teds_Pick[0]['slug']}><i>{feature_Teds_Pick[0]['Cigar Brand']} </i>{feature_Teds_Pick[0]['Cigar Name']}</a></p>

                </div>}
                { feature_StickFigures.length > 0 &&
                    <div className='feature stickFigures'>
                    <h2>On The Stick Figures Podcast</h2>
                    <b>{feature_StickFigures[0]['featured_StickFigures']}</b>
                    <p><a href={ '/cigars/' +feature_StickFigures[0]['slug']}><i>{feature_StickFigures[0]['Cigar Brand']} </i>{feature_StickFigures[0]['Cigar Name']}</a></p>
                </div>}
                
            </div>
        </div>
        <style jsx>
            {`
        .feature {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            border-radius: 5px;
            flex: 1 1;
            min-width: 200px;
            margin: 5px;
            border: 2px solid var(--dl-color-theme-secondary2);
            gap: 0.5em;
        }
            
        
        .feature > * {
            text-align: center;
        }
        .feature a {
            text-decoration: underline;
            text-decoration-color: var(--dl-color-theme-primary1);
        }


        .spread {
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            flex-wrap: wrap;
        }
        .featured {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            background-color: var(--dl-color-theme-primary2);
            border-radius: 5px;
            gap: 1em;
        }
        .featured h1 {
            text-align: center;
        }


            `}
        </style>
        </>
    )
}

export default Featured