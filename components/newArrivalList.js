import Link from 'next/link';
import { useState } from 'react';
import CigarCard from './cigarCard';

export const getStaticProps = async () => {
    const data = await import('../public/data/consolidated_cigars.json');
    return {
        props: {
            data: data.default
        },
    };
};

export const NewArrivalList = ({ cigars }) => {
    const [hoveredCigar, setHoveredCigar] = useState(null);
    
    const newCigars = (cigars || [])
        .filter(cigar => cigar["Date Added"])
        .sort((a, b) => new Date(b["Date Added"]) - new Date(a["Date Added"]))
        .slice(0, 3);
    
    return (
        <section className="relative py-20 px-6 bg-gradient-to-r from-primary2/30 via-primary2/50 to-primary2/30">
            {/* Subtle Geometric Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), 
                                     linear-gradient(-45deg, #000 25%, transparent 25%),
                                     linear-gradient(45deg, transparent 75%, #000 75%), 
                                     linear-gradient(-45deg, transparent 75%, #000 75%)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}></div>
            </div>
            
            <div className="relative max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block relative">
                        <div className="flex items-center justify-center mb-4">
                            <div className="hidden md:block w-8 h-px bg-secondary2/70"></div>
                            <div className="mx-4 w-2 h-2 bg-secondary2/70 rounded-full"></div>
                            <h1 className="text-5xl md:text-6xl font-bold text-secondary2 mx-6" 
                                style={{ 
                                    fontFamily: 'serif',
                                    textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
                                }}>
                                New Arrivals
                            </h1>
                            <div className="mx-4 w-2 h-2 bg-secondary2/70 rounded-full"></div>
                            <div className="hidden md:block w-8 h-px bg-secondary2/70"></div>
                        </div>
                    </div>
                </div>

                {/* Cigars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {newCigars.map((cigar, index) => (
                        <CigarCard
                            key={index}
                            cigar={cigar}
                            title={"New"}
                            showFlavors={false}
                        />
                    ))}
                </div>

                {/* Bottom Call-to-Action */}
                <div className="text-center mt-16">
                    <div className="inline-flex items-center">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-secondary2/60"></div>
                        <Link href="/cigars">
                            <a className="mx-8 group inline-flex items-center text-secondary2 hover:text-secondary1 transition-colors duration-300">
                                <span className="text-lg font-semibold tracking-wide mr-3" style={{ fontFamily: 'serif' }}>
                                    Browse Our Complete Collection
                                </span>
                                <div className="w-8 h-8 bg-primary2/60 rounded-full flex items-center justify-center group-hover:bg-primary1/20 transition-colors duration-300 border border-primary1/30">
                                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </a>
                        </Link>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-secondary2/60"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewArrivalList;