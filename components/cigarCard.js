import Link from 'next/link';

export const CigarCard = ({
  cigar,
  href = `/cigars/${cigar.slug}`,
  title = null,
  date = cigar['Date Added'],
  showBadge = true,
  showDate = true,
  showAttributes = true,
  showButton = true,
  showFlavors = true,
}) => {
  return (
    <div className="group relative">
      <Link href={href}>
        <a className="block relative">
          <div
            className="relative h-96 transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-primary2/80 via-primary2 to-primary2/90"
            style={{
              border: '2px solid rgb(245 158 11)',
              borderRadius: '12px',
              boxShadow:
                '0 8px 25px rgba(245,158,11,0.15), 0 3px 10px rgba(0,0,0,0.1)',
            }}
          >
            {/* Decorative borders */}
            <div className="absolute inset-3 border border-primary1/40 rounded-lg opacity-60"></div>
            <div className="absolute inset-5 border border-primary1/20 rounded opacity-40"></div>

            {/* Badge */}
            {showBadge && title && (
              <div className="absolute -top-3 left-6 bg-gradient-to-r from-secondary2/90 to-secondary2 text-primary2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-20"
                   style={{ fontFamily: 'serif' }}>
                {title}
              </div>
            )}

            {/* Date */}
            {showDate && date && (
              <div className="absolute top-6 right-6 bg-primary2/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10 border border-primary1/30">
                <div className="text-xs text-secondary2 font-medium text-center leading-tight"
                     style={{ fontFamily: 'serif' }}>
                  {new Date(date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                  <br />
                  <span className="text-lg font-bold text-secondary1">
                    {new Date(date).getDate()}
                  </span>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="relative z-10 p-8 h-full flex flex-col justify-center text-center">
              {/* Brand & Name */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-secondary1 leading-tight"
                    style={{
                      fontFamily: 'serif',
                      textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                    }}>
                  <div className="text-lg italic font-light text-secondary2 mb-1">
                    {cigar['Cigar Brand']}
                  </div>
                  <div className="font-bold">{cigar['Cigar Name']}</div>
                </h3>
              </div>

              {/* Attribute Pills */}
              {showAttributes && (
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
                      {cigar['Sizes'].length > 1
                        ? `${cigar['Sizes'].length} Sizes`
                        : cigar['Sizes'][0]?.Size || 'Size Info'}
                    </span>
                  )}
                </div>
              )}

              {/* Flavor Pills */}
              {showFlavors && cigar['Flavor_Profile'] && (
                <div className="flex flex-wrap gap-1 justify-center items-center mb-4">
                  {cigar['Flavor_Profile'].split(',').map((item, index) => (
                    <span key={index} className="font-bold italic bg-secondary2 py-1 px-2 rounded-md text-primary2 mx-1">
                      {item.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              {showButton && (
                <div className="mt-auto">
                  <div className="inline-flex items-center bg-gradient-to-r from-secondary2/90 to-secondary2 text-primary2 px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-secondary2 group-hover:to-secondary2/90">
                    Explore Details
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary1/0 to-primary1/0 group-hover:from-primary1/10 group-hover:to-primary1/20 rounded-xl transition-all duration-500"></div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default CigarCard;
