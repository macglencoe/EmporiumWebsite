import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import CigarCard from './cigarCard';
import CatalogCard from './catalogCard';
import { PiCalendar, PiFire, PiLeaf, PiMicrophone, PiRuler } from 'react-icons/pi';
import Image from 'next/image';



export const Featured = ({ cigars }) => {
  const [featureEdsPick, setFeatureEdsPick] = useState()
  const [featureTedsPick, setFeatureTedsPick] = useState()
  const [featureStickFigures, setFeatureStickFigures] = useState()
  const [features, setFeatures] = useState([])

  useEffect(() => {
    setFeatureEdsPick(
      cigars
        .filter(cigar => cigar['featured_Eds_Pick'])
        .sort((a, b) => new Date(b['featured_Eds_Pick']) - new Date(a['featured_Eds_Pick']))[0]
    )
    setFeatureTedsPick(
      cigars
        .filter(cigar => cigar['featured_Teds_Pick'])
        .sort((a, b) => new Date(b['featured_Teds_Pick']) - new Date(a['featured_Teds_Pick']))[0]
    )
    setFeatureStickFigures(
      cigars
        .filter(cigar => cigar['featured_StickFigures'])
        .sort((a, b) => new Date(b['featured_StickFigures']) - new Date(a['featured_StickFigures']))[0]
    )
  }, [cigars])

  useEffect(() => {
    setFeatures([
      featureEdsPick &&
      {
        title: "Ed's Pick",
        cigar: featureEdsPick,
        date: featureEdsPick["featured_Eds_Pick"]
      },
      featureTedsPick &&
      {
        title: "Ted's Pick",
        cigar: featureTedsPick,
        date: featureTedsPick["featured_Teds_Pick"]
      },
      featureStickFigures &&
      {
        title: "Stick Figures Podcast",
        cigar: featureStickFigures,
        date: featureStickFigures["featured_StickFigures"]
      }
    ])
  }, [featureEdsPick, featureStickFigures, featureTedsPick])

  return (
    <section className="relative py-20 px-6 bg-gradient-to-r from-primary2/30 via-primary2/50 to-primary2/30 overflow-hidden">
      {/* Subtle Backdrop */}
      <div className="absolute inset-0">
        <Image layout='fill' className="object-cover opacity-15" src="https://images.unsplash.com/photo-1679419858200-25b16ce069aa?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        <div className='absolute inset-0' style={{
          boxShadow: "inset 0 0 400px -300px black"
        }} />
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
          {features?.map((item, index) => {
            if (item && item.cigar) return (
              <CatalogCard
                flag={item.title}
                title={item.cigar["Cigar Name"]}
                secondaryTitle={item.cigar["Cigar Brand"]}
                data={[
                  item.date &&
                  {
                    icon: PiCalendar,
                    value: item.date
                      ? new Date(item.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })
                      : undefined,
                    label: "Last Updated",
                    type: 'hidden-label'
                  },
                  item.cigar["Wrapper"] &&
                  {
                    icon: PiLeaf,
                    value: item.cigar['Wrapper'],
                    label: 'Wrapper',
                    type: 'hidden-label'
                  },
                  item.cigar['Strength_Profile'] &&
                  {
                    icon: PiFire,
                    value: item.cigar['Strength_Profile'],
                    label: 'Strength',
                    type: 'hidden-label strength-gauge'
                  },
                  item.cigar['Sizes'] && item.cigar['Sizes'].length > 0 &&
                  {
                    label: 'Sizes',
                    type: 'tags hidden-label',
                    icon: PiRuler,
                    value:
                      item.cigar['Sizes']
                        .slice(0, 3)
                        .map(sizeObj => sizeObj.Size)
                        .join(', ')
                      +
                      (item.cigar['Sizes'].length > 3 ? ', +' + (item.cigar['Sizes'].length - 3) : '')
                  },
                  item.cigar['Flavor_Profile'] &&
                  {
                    label: 'Flavor Notes',
                    value: item.cigar['Flavor_Profile'],
                    type: 'tags'
                  },
                ]}
                href={'/cigars/' + item.cigar?.slug}
                description={item.cigar?.description}
              />
            )
          })

          }
        </div>
      </div>
    </section>
  );
};


export default Featured