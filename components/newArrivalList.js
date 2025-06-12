import Link from 'next/link';
import { useState } from 'react';

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
                        <div
                            key={cigar.slug}
                            className="group relative"
                            onMouseEnter={() => setHoveredCigar(index)}
                            onMouseLeave={() => setHoveredCigar(null)}
                        >
                            <Link href={`/cigars/${cigar.slug}`}>
                                <a className="block relative">
                                    {/* Card Container */}
                                    <div className="relative h-96 transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-primary2/80 via-primary2 to-primary2/90"
                                         style={{
                                             border: '2px solid rgb(245 158 11)', // primary1 equivalent
                                             borderRadius: '12px',
                                             boxShadow: '0 8px 25px rgba(245,158,11,0.15), 0 3px 10px rgba(0,0,0,0.1)',
                                             transform: hoveredCigar === index ? 'translateY(-8px)' : 'translateY(0)'
                                         }}>
                                        
                                        {/* Elegant Inner Frame */}
                                        <div className="absolute inset-3 border border-primary1/40 rounded-lg opacity-60"></div>
                                        <div className="absolute inset-5 border border-primary1/20 rounded opacity-40"></div>
                                        
                                        {/* Premium Badge */}
                                        <div className="absolute -top-3 left-6 bg-gradient-to-r from-secondary2/90 to-secondary2 text-primary2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-20"
                                             style={{ fontFamily: 'serif' }}>
                                            New
                                        </div>
                                        
                                        {/* Date Ribbon */}
                                        <div className="absolute top-6 right-6 bg-primary2/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10 border border-primary1/30">
                                            <div className="text-xs text-secondary2 font-medium text-center leading-tight"
                                                 style={{ fontFamily: 'serif' }}>
                                                {new Date(cigar['Date Added']).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                                <br />
                                                <span className="text-lg font-bold text-secondary1">
                                                    {new Date(cigar['Date Added']).getDate()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="relative z-10 p-8 h-full flex flex-col justify-center text-center">
                                            {/* Cigar Name */}
                                            <div className="mb-6">
                                                <h3 className="text-2xl font-bold mb-2 text-secondary1 leading-tight"
                                                    style={{ 
                                                        fontFamily: 'serif',
                                                        textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                                                    }}>
                                                    <div className="text-lg italic font-light text-secondary2 mb-1">
                                                        {cigar['Cigar Brand']}
                                                    </div>
                                                    <div className="font-bold">
                                                        {cigar['Cigar Name']}
                                                    </div>
                                                </h3>
                                            </div>
                                            
                                            {/* Attributes Pills */}
                                            <div className="flex flex-wrap justify-center gap-2 mb-6">
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
                                                        {cigar['Sizes'].length > 1 
                                                            ? `${cigar['Sizes'].length} Sizes` 
                                                            : cigar['Sizes'][0]?.Size || 'Size Info'
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {/* Explore Button */}
                                            <div className="mt-auto">
                                                <div className="inline-flex items-center bg-gradient-to-r from-secondary2/90 to-secondary2 text-primary2 px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-secondary2 group-hover:to-secondary2/90">
                                                    Explore Details
                                                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subtle Hover Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary1/0 to-primary1/0 group-hover:from-primary1/10 group-hover:to-primary1/20 rounded-xl transition-all duration-500"></div>
                                    </div>
                                </a>
                            </Link>
                        </div>
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