import React, { useEffect, useState } from 'react'

const AttributeSpan = ({ item }) => {
    return (
        <>
            <div className='attributes'>
                {[
                    item['Strength_Profile'],
                    '•',
                    item['Wrapper'],
                    '•',
                    item['Sizes'].length > 1 ? item['Sizes'].length + ' Sizes' : item['Sizes'][0].Size
                ].filter(Boolean).map((item, index) => (
                    <span key={index}>{item}</span>
                ))}
            </div>
            <style jsx>
                {`
                .attributes {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5em;
                    align-items: center;
                    justify-content: center;
                }
                `}
            </style>
        </>
    )
}

const FlavorList = ({ flavorString }) => {
    return (
        <>
            <div className='flavor-list'>
                {flavorString.split(',').map((item, index) => (
                    <span key={index}>{item}</span>
                ))}
            </div>
            <style jsx>
                {`
                .flavor-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5em;
                    justify-content: center;
                    align-items: center;
                }
                .flavor-list span {
                    font-style: italic;
                    font-weight: bold;
                    background-color: var(--dl-color-theme-secondary2);
                    padding: 0.5em;
                    color: var(--dl-color-theme-primary2);
                    border-radius: 5px;
                    margin: 0.5em;
                }
                `}
            </style>
        </>
    )
}

export const Featured = ({ cigars }) => {
    const [feature_Week, setFeature_Week] = useState([]);
    const [feature_Eds_Pick, setFeature_Eds_Pick] = useState([]);
    const [feature_Teds_Pick, setFeature_Teds_Pick] = useState([]);
    const [feature_StickFigures, setFeature_StickFigures] = useState([]);

    useEffect(() => {
        setFeature_Eds_Pick(cigars.filter(cigar => cigar['featured_Eds_Pick']).sort((a, b) => new Date(b['featured_Eds_Pick']) - new Date(a['featured_Eds_Pick'])));
        setFeature_Teds_Pick(cigars.filter(cigar => cigar['featured_Teds_Pick']).sort((a, b) => new Date(b['featured_Teds_Pick']) - new Date(a['featured_Teds_Pick'])));
        setFeature_StickFigures(cigars.filter(cigar => cigar['featured_StickFigures']).sort((a, b) => new Date(b['featured_StickFigures']) - new Date(a['featured_StickFigures'])));
    }, [cigars])

    return (
        <>
            <div className='featured'>
                    <div className='background'></div>
                <h1>Featured Cigars</h1>
                <div className="spread">
                    {feature_Eds_Pick.length > 0 &&
                        <div className='feature eds-Pick'>
                            <h2>Ed's Pick</h2>
                            <p className='date'><b>{feature_Eds_Pick[0]['featured_Eds_Pick']}</b></p>
                            <p className='cigarTitle'><a href={'/cigars/' + feature_Eds_Pick[0]['slug']}><i>{feature_Eds_Pick[0]['Cigar Brand']} </i>{feature_Eds_Pick[0]['Cigar Name']}</a></p>
                            <AttributeSpan item={feature_Eds_Pick[0]} />
                            <FlavorList flavorString={feature_Eds_Pick[0]['Flavor_Profile']} />
                        </div>}
                    {feature_Teds_Pick.length > 0 &&
                        <div className='feature teds-Pick'>
                            <h2>Ted's Pick</h2>
                            <p className='date'><b>{feature_Teds_Pick[0]['featured_Teds_Pick']}</b></p>
                            <p className='cigarTitle'><a href={'/cigars/' + feature_Teds_Pick[0]['slug']}><i>{feature_Teds_Pick[0]['Cigar Brand']} </i>{feature_Teds_Pick[0]['Cigar Name']}</a></p>
                            <AttributeSpan item={feature_Teds_Pick[0]} />
                            <FlavorList flavorString={feature_Teds_Pick[0]['Flavor_Profile']} />

                        </div>}
                    {feature_StickFigures.length > 0 &&
                        <div className='feature stickFigures'>
                            <h2>On <a href='https://open.spotify.com/show/0xpAdXeTXnnh30J0HEVmoz'>The Stick Figures Podcast</a></h2>
                            <p className='date'><b>{feature_StickFigures[0]['featured_StickFigures']}</b></p>
                            <p className='cigarTitle'><a href={'/cigars/' + feature_StickFigures[0]['slug']}><i>{feature_StickFigures[0]['Cigar Brand']} </i>{feature_StickFigures[0]['Cigar Name']}</a></p>
                            <AttributeSpan item={feature_StickFigures[0]} />
                            <FlavorList flavorString={feature_StickFigures[0]['Flavor_Profile']} />
                        </div>}

                </div>
            </div>
            <style jsx>
                {`
        .feature {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            padding: 20px;
            border-radius: 10px;
            flex: 0.5 1 min-content;
            min-width: 300px;
            margin: 5px;
            gap: 0.5em;
            overflow: hidden;
            z-index: 1;
            background-color: var(--dl-color-theme-primary2);
            transition: all 0.3s ease-in-out;
            background-image: radial-gradient(circle at center, transparent 20%, var(--dl-color-theme-primary1) 500%);
            flex: 1;
        }
        .feature::before, .feature::after {
            content: '';
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: var(--dl-color-theme-primary1);
            z-index: 1;
            transform: scaleX(0);
            transition: transform 0.3s ease-in-out;
        }
        .feature:hover::before, .feature:hover::after {
            transform: scaleX(1);

        }
        .feature:hover {
            scale: 1.05;
        }
        .feature:hover a {
            text-decoration-color: var(--dl-color-theme-secondary2);
        }
            
        
        .feature > * {
            text-align: center;
        }
        .feature a {
            text-decoration: underline;
            text-decoration-color: var(--dl-color-theme-primary1);
        }
        .feature .date {
            font-family: Inter;
            color: var(--dl-color-theme-secondary2);
        }
        .feature .cigarTitle {
            margin: 10px;
            font-size: 1.6em;
            font-weight: bold;
            font-family: Playfair;

        }


        .spread {
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            flex-wrap: wrap;
            width: 100%;
            gap: 1em;
        }
        .featured {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            gap: 1em;
            position: relative;;
            background-color: var(--dl-color-theme-primary2);
            overflow: hidden;
        }
        .featured .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
            background-size: cover;
            opacity: 0.3;
            transition: all 0.3s ease-in-out;

        }
        .featured h1 {
            text-align: center;
            z-index: 1;
        }


            `}
            </style>
        </>
    )
}

export default Featured