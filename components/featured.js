import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const AttributeSpan = ({ item }) => {
    return (
        <>
            <div className="flex flex-wrap gap-2 items-center justify-center">
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
        </>
    )
}

const FlavorList = ({ flavorString }) => {
    return (
        <div className="flex flex-wrap gap-1 justify-center items-center">
            {flavorString.split(',').map((item, index) => (
                <span key={index} className="font-bold italic bg-secondary2 py-1 px-2 rounded-md text-primary2 mx-1">{item}</span>
            ))}
        </div>
    )
}

const FeatureCard = ({ title, date, cigar, href }) => (
    <>
        <div className="feature flex flex-col justify-around items-center p-5 rounded-lg min-w-[300px] gap-2 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-md flex-1 text-center" style={{
            backgroundImage: "radial-gradient(circle at center, transparent 20%, var(--dl-color-theme-primary1) 500%)"
        }}>
          <h2 className="text-xl font-semibold text-secondary2">{title}</h2>
          <p className="text-sm text-secondary2 font-inter"><b>{date}</b></p>
          <p className="text-lg font-bold font-playfair my-2">
            <Link
              href={href}
              className=""
            >
              <span className='underline underline-offset-4 decoration-primary1 hover:decoration-secondary2'>
                  <i>{cigar["Cigar Brand"]} </i>
                  {cigar["Cigar Name"]}
              </span>
            </Link>
          </p>
          <AttributeSpan item={cigar} />
          <FlavorList flavorString={cigar["Flavor_Profile"]} />
        </div>
        <style jsx>{`
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
        `}</style>
    </>
  );
  
  export const Featured = ({ cigars }) => {
    const [featureEdsPick, setFeatureEdsPick] = useState([]);
    const [featureTedsPick, setFeatureTedsPick] = useState([]);
    const [featureStickFigures, setFeatureStickFigures] = useState([]);
  
    useEffect(() => {
      setFeatureEdsPick(
        cigars
          .filter((cigar) => cigar["featured_Eds_Pick"])
          .sort(
            (a, b) =>
              new Date(b["featured_Eds_Pick"]) - new Date(a["featured_Eds_Pick"])
          )
      );
      setFeatureTedsPick(
        cigars
          .filter((cigar) => cigar["featured_Teds_Pick"])
          .sort(
            (a, b) =>
              new Date(b["featured_Teds_Pick"]) - new Date(a["featured_Teds_Pick"])
          )
      );
      setFeatureStickFigures(
        cigars
          .filter((cigar) => cigar["featured_StickFigures"])
          .sort(
            (a, b) =>
              new Date(b["featured_StickFigures"]) -
              new Date(a["featured_StickFigures"])
          )
      );
    }, [cigars]);
  
    return (
      <section className="flex flex-col items-center p-5 gap-6 relative bg-primary2 overflow-hidden">
        <div className="absolute inset-0 bg-cover opacity-30 z-0" />
        <h1 className="text-3xl font-bold z-10">Featured Cigars</h1>
        <div className="flex flex-wrap justify-evenly gap-4 w-full z-10">
          {featureEdsPick.length > 0 && (
            <FeatureCard
              title="Ed's Pick"
              date={featureEdsPick[0]["featured_Eds_Pick"]}
              cigar={featureEdsPick[0]}
              href={`/cigars/${featureEdsPick[0].slug}`}
            />
          )}
          {featureTedsPick.length > 0 && (
            <FeatureCard
              title="Ted's Pick"
              date={featureTedsPick[0]["featured_Teds_Pick"]}
              cigar={featureTedsPick[0]}
              href={`/cigars/${featureTedsPick[0].slug}`}
            />
          )}
          {featureStickFigures.length > 0 && (
            <FeatureCard
              title={
                <>
                  On <a className="underline" href="https://open.spotify.com/show/0xpAdXeTXnnh30J0HEVmoz">The Stick Figures Podcast</a>
                </>
              }
              date={featureStickFigures[0]["featured_StickFigures"]}
              cigar={featureStickFigures[0]}
              href={`/cigars/${featureStickFigures[0].slug}`}
            />
          )}
        </div>
      </section>
    );
  };
  

export default Featured