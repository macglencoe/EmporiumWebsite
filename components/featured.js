import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import CigarCard from './cigarCard';



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
            <CigarCard
              title={"Ed's Pick"}
              cigar={featureEdsPick[0]}
              date={featureEdsPick[0]['featured_Eds_Pick']}
              href={`/cigars/${featureEdsPick[0].slug}`}
            />
          )}
          {featureTedsPick.length > 0 && (
            <CigarCard
              title={"Ted's Pick"}
              cigar={featureTedsPick[0]}
              date={featureTedsPick[0]['featured_Teds_Pick']}
              href={`/cigars/${featureTedsPick[0].slug}`}
            />
          )}
          {featureStickFigures.length > 0 && (
            <CigarCard
              title={"Stick Figures"}
              cigar={featureStickFigures[0]}
              date={featureStickFigures[0]['featured_StickFigures']}
              href={`/cigars/${featureStickFigures[0].slug}`}
            />
          )}
        </div>
      </div>
    </section>
  );
};


export default Featured