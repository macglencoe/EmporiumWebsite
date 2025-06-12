import Link from 'next/link';
import { useState } from 'react';

export default function BrandShowcase() {
  const [hoveredBrand, setHoveredBrand] = useState(null);

  const brands = [
    {
      name: "Arturo Fuente",
      href: "/cigars?Cigar+Brand=Arturo+Fuente",
      logo: "/af-logo.webp",
      category: "Premium Cigars",
      description: "Legendary Dominican craftsmanship since 1912"
    },
    {
      name: "J.C. Newman",
      href: "/cigars?Cigar+Brand=J.C.+Newman",
      logo: "/jcn-logo.png",
      category: "Heritage Cigars",
      description: "America's oldest family-owned premium cigar maker"
    },
    {
      name: "Savinelli",
      href: "/pipes#savinelli",
      logo: "/savinelli-logo.webp",
      category: "Italian Pipes",
      description: "Artisan pipes from Brebbia since 1876"
    },
    {
      name: "Peterson",
      href: "/pipes#peterson",
      logo: "/peterson-logo.png",
      category: "Irish Pipes",
      description: "Dublin's finest pipe makers since 1865"
    }
  ];

  return (
    <section className="relative py-16 px-6 bg-gradient-to-br from-secondary2/50 via-primary2/30 to-secondary2/50">
      {/* Vintage Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #000 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-bold text-primary2 mb-2" 
                style={{ 
                  fontFamily: 'serif',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  letterSpacing: '0.05em'
                }}>
              We are proud to carry your
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-primary2 italic mb-4"
                style={{ 
                  fontFamily: 'serif',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
              favorite brands
            </h2>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-px bg-primary2"></div>
              <div className="w-3 h-3 bg-primary2 rotate-45"></div>
              <div className="w-16 h-px bg-primary2"></div>
            </div>
          </div>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="group relative"
              onMouseEnter={() => setHoveredBrand(index)}
              onMouseLeave={() => setHoveredBrand(null)}
            >
              <Link href={brand.href}>
                <a className="block relative">
                  {/* Card Container */}
                  <div className="relative h-72 transition-all duration-300 group-hover:-translate-y-1 bg-primary2 bg-gradient-to-br from-secondary2/20 via-primary1/10 to-secondary2/20"
                       style={{
                         border: '3px solid #8B4513',
                         borderRadius: '8px',
                         boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                       }}>
                    
                    {/* Inner Border */}
                    <div className="absolute inset-2 border border-yellow-600 rounded opacity-40"></div>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary1/0 to-primary1/0 group-hover:from-primary1/20 group-hover:to-primary1/10 rounded transition-all duration-300"></div>
                    
                    {/* Logo Section */}
                    <div className="relative z-10 h-32 flex items-center justify-center p-4 mt-4">
                      <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={brand.logo} 
                          alt={brand.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-md"
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="relative z-10 text-center px-4 pb-4">
                      {/* Category */}
                      <div className="text-xs font-bold text-secondary2/70 uppercase tracking-wider mb-2"
                           style={{ fontFamily: 'serif' }}>
                        {brand.category}
                      </div>
                      
                      {/* Brand Name */}
                      <h3 className="text-lg font-bold mb-3 text-secondary1"
                          style={{ 
                            fontFamily: 'serif',
                            textShadow: '1px 1px 2px rgba(255,255,255,0.3)'
                          }}>
                        {brand.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm leading-relaxed text-secondary1"
                         style={{ 
                           fontFamily: 'serif'
                         }}>
                        {brand.description}
                      </p>
                    </div>

                    {/* Bottom Accent */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary1/30 to-primary1 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}