import Link from 'next/link';

export const getStaticProps = async () => {
    const data = await import('../public/data/consolidated_cigars.json');
    return {
        props: {
            data: data.default
        },
    };
};

export const NewArrivalList = ({ cigars }) => {
    const newCigars = (cigars || [])
        .filter(cigar => cigar["Date Added"])
        .sort((a, b) => new Date(b["Date Added"]) - new Date(a["Date Added"]))
        .slice(0, 6);
    
    return (
        <div className="bg-gradient-to-b from-amber-50 to-yellow-100 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-block">
                        <h2 className="text-4xl md:text-5xl font-serif text-amber-900 mb-2 tracking-wide">
                            New Arrivals
                        </h2>
                        <div className="h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent w-full"></div>
                    </div>
                    <p className="text-amber-800 mt-4 text-lg font-light max-w-2xl mx-auto">
                        Discover our latest premium cigars, carefully selected for the discerning enthusiast
                    </p>
                </div>

                {/* Cigars Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newCigars.map((cigar, index) => (
                        <div 
                            key={cigar.slug}
                            className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                                index < 2 ? 'bg-gradient-to-br from-amber-100 to-yellow-200 border-2 border-amber-300' :
                                index < 4 ? 'bg-gradient-to-br from-yellow-50 to-amber-100 border border-amber-200' :
                                'bg-gradient-to-br from-stone-50 to-yellow-50 border border-stone-200'
                            }`}
                        >
                            {/* Featured Badge for first two items */}
                            {index < 2 && (
                                <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide z-10">
                                    Featured
                                </div>
                            )}
                            
                            <div className="p-6">
                                {/* Date */}
                                <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                                    <p className="text-sm text-amber-700 font-medium uppercase tracking-wider">
                                        {new Date(cigar['Date Added']).toLocaleString('default', { month: 'long' })}{' '}
                                        {new Date(cigar['Date Added']).getDate()}{', '}
                                        {new Date(cigar['Date Added']).getFullYear()}
                                    </p>
                                </div>

                                {/* Cigar Title */}
                                <Link href={`/cigars/${cigar.slug}`}>
                                    <a className="block group-hover:text-amber-700 transition-colors duration-200">
                                        <h3 className="text-xl md:text-2xl font-serif text-amber-900 mb-3 leading-tight">
                                            <span className="italic font-light">{cigar['Cigar Brand']}</span>
                                            <br />
                                            <span className="font-semibold">{cigar['Cigar Name']}</span>
                                        </h3>
                                    </a>
                                </Link>

                                {/* Attributes */}
                                <div className="flex flex-wrap items-center gap-2 text-sm text-amber-800">
                                    {cigar['Strength_Profile'] && (
                                        <span className="bg-amber-200 px-3 py-1 rounded-full font-medium">
                                            {cigar['Strength_Profile']}
                                        </span>
                                    )}
                                    {cigar['Wrapper'] && (
                                        <span className="bg-yellow-200 px-3 py-1 rounded-full font-medium">
                                            {cigar['Wrapper']}
                                        </span>
                                    )}
                                    {cigar['Sizes'] && (
                                        <span className="bg-stone-200 px-3 py-1 rounded-full font-medium">
                                            {cigar['Sizes'].length > 1 
                                                ? `${cigar['Sizes'].length} Sizes` 
                                                : cigar['Sizes'][0]?.Size || 'Size Info'
                                            }
                                        </span>
                                    )}
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>

                            {/* Bottom Border Accent */}
                            <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-12">
                    <Link href="/cigars">
                        <a className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wide">
                            View All Cigars
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NewArrivalList;