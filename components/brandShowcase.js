import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import BrandCard from './brandCard';

export default function BrandShowcase() {

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
      category: "Premium Cigars",
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
    <section className="relative py-16 px-6 bg-gradient-to-br from-primary2/50 via-primary2/30 to-primary2/50">
      {/* Subtle Backdrop */}
      <div className="absolute inset-0">
        <Image layout='fill' className="object-cover opacity-15" src="/chupa-cabras.jpg" />
        <div className='absolute inset-0' style={{
          boxShadow: "inset 0 0 400px -300px black"
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary2 mb-2" 
                style={{ 
                  fontFamily: 'serif',
                  letterSpacing: '0.05em'
                }}>
              We are proud to carry your
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary2 italic mb-4"
                style={{ 
                  fontFamily: 'serif',
                }}>
              favorite brands
            </h2>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-px bg-secondary2"></div>
              <div className="w-3 h-3 bg-secondary2 rotate-45"></div>
              <div className="w-16 h-px bg-secondary2"></div>
            </div>
          </div>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <BrandCard
              name={brand.name}
              href={brand.href}
              logoSrc={brand.logo}
              category={brand.category}
              description={brand.description}
            />
          ))}
        </div>
        <div className='mx-auto flex flex-col items-center mt-10'>
          <span className='w-full text-center text-2xl text-secondary2 font-medium'>And many more!</span>
        </div>
      </div>
    </section>
  );
}