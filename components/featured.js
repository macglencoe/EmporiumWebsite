import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const AttributePills = ({ cigar }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-4">
    {cigar['Strength_Profile'] && (
      <span className="bg-primary1/20 text-secondary2 px-3 py-1 rounded-full text-sm font-medium border border-primary1/40">
        {cigar['Strength_Profile']}
      </span>
    )}
    {cigar['Wrapper'] && (
      <span className="bg-primary2/60 text-secondary2 px-3 py-1 rounded-full text-sm font-medium border border-primary1/30">
        {cigar['Wrapper']}
      </span>
    )}
    {cigar['Sizes'] && (
      <span className="bg-secondary2/10 text-secondary2 px-3 py-1 rounded-full text-sm font-medium border border-secondary2/20">
        {cigar['Sizes'].length > 1 ? `${cigar['Sizes'].length} Sizes` : cigar['Sizes'][0]?.Size || 'Size Info'}
      </span>
    )}
  </div>
)

const FlavorList = ({ flavorString }) => (
  <div className="flex flex-wrap gap-1 justify-center items-center">
    {flavorString.split(',').map((item, index) => (
      <span key={index} className="font-bold italic bg-secondary2 py-1 px-2 rounded-md text-primary2 mx-1">
        {item}
      </span>
    ))}
  </div>
)

const FeatureCard = ({ title, date, cigar, href }) => (
  <div className="group relative bg-gradient-to-br from-primary2/80 via-primary2 to-primary2/90 border-2 border-primary1 rounded-xl p-8 flex flex-col justify-between text-center shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="absolute inset-3 border border-primary1/40 rounded-lg pointer-events-none"></div>
    <div className="absolute -top-3 left-6 bg-gradient-to-r from-secondary2/90 to-secondary2 text-primary2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg" style={{ fontFamily: 'serif' }}>
      {title}
    </div>
    <div className="absolute top-6 right-6 bg-primary2/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-primary1/30">
      <div className="text-xs text-secondary2 font-medium text-center leading-tight" style={{ fontFamily: 'serif' }}>
        {new Date(date).toLocaleString('default', { month: 'short' }).toUpperCase()}<br />
        <span className="text-lg font-bold text-secondary1">{new Date(date).getDate()}</span>
      </div>
    </div>
    <Link href={href}>
      <a className="mt-6">
        <h3 className="text-lg font-bold mb-2 text-secondary1 underline decoration-primary1 hover:decoration-secondary2" style={{ fontFamily: 'serif' }}>
          <i>{cigar['Cigar Brand']} </i>{cigar['Cigar Name']}
        </h3>
      </a>
    </Link>
    <AttributePills cigar={cigar} />
    <FlavorList flavorString={cigar['Flavor_Profile']} />
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary1/30 to-primary1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
  </div>
);

export const Featured = ({ cigars }) => {
  const [featureEdsPick, setFeatureEdsPick] = useState([])
  const [featureTedsPick, setFeatureTedsPick] = useState([])
  const [featureStickFigures, setFeatureStickFigures] = useState([])

  useEffect(() => {
    setFeatureEdsPick(
      cigars
        .filter(cigar => cigar['featured_Eds_Pick'])
        .sort((a, b) => new Date(b['featured_Eds_Pick']) - new Date(a['featured_Eds_Pick']))
    )
    setFeatureTedsPick(
      cigars
        .filter(cigar => cigar['featured_Teds_Pick'])
        .sort((a, b) => new Date(b['featured_Teds_Pick']) - new Date(a['featured_Teds_Pick']))
    )
    setFeatureStickFigures(
      cigars
        .filter(cigar => cigar['featured_StickFigures'])
        .sort((a, b) => new Date(b['featured_StickFigures']) - new Date(a['featured_StickFigures']))
    )
  }, [cigars])

  return (
    <section className="relative py-20 px-6 bg-gradient-to-r from-primary2/30 via-primary2/50 to-primary2/30 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)`, backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} />
      </div>
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block relative">
            <div className="flex items-center justify-center mb-4">
              <div className="hidden md:block w-8 h-px bg-secondary2/70"></div>
              <div className="mx-4 w-2 h-2 bg-secondary2/70 rounded-full"></div>
              <h1 className="text-5xl md:text-6xl font-bold text-secondary2 mx-6" style={{ fontFamily: 'serif', textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>
                Featured Cigars
              </h1>
              <div className="mx-4 w-2 h-2 bg-secondary2/70 rounded-full"></div>
              <div className="hidden md:block w-8 h-px bg-secondary2/70"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureEdsPick.length > 0 && (
            <FeatureCard
              title="Ed's Pick"
              date={featureEdsPick[0]['featured_Eds_Pick']}
              cigar={featureEdsPick[0]}
              href={`/cigars/${featureEdsPick[0].slug}`}
            />
          )}
          {featureTedsPick.length > 0 && (
            <FeatureCard
              title="Ted's Pick"
              date={featureTedsPick[0]['featured_Teds_Pick']}
              cigar={featureTedsPick[0]}
              href={`/cigars/${featureTedsPick[0].slug}`}
            />
          )}
          {featureStickFigures.length > 0 && (
            <FeatureCard
              title={<><span>The Stick Figures Podcast</span></>}
              date={featureStickFigures[0]['featured_StickFigures']}
              cigar={featureStickFigures[0]}
              href={`/cigars/${featureStickFigures[0].slug}`}
            />
          )}
        </div>
      </div>
    </section>
  );
};


export default Featured