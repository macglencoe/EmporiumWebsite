import Link from "next/link";


export default function ({ name, href, logoSrc, category, description, ...props }) {
    return (
        <article
            key={name}
            className="group relative"
            {...props}
            
        >
            <Link href={href}>
                <a className="block relative">
                    {/* Card Container */}
                    <div className="relative h-72 transition-all duration-300 group-hover:-translate-y-1 bg-primary2 bg-gradient-to-br from-primary1/10 via-secondary1/20 to-primary1/10"
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
                                    src={logoSrc}
                                    alt={name}
                                    className="max-w-full max-h-full object-contain filter drop-shadow-md"
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="relative z-10 text-center px-4 pb-4">
                            {/* Category */}
                            <div className="text-xs font-bold text-secondary2/70 uppercase tracking-wider mb-2"
                                style={{ fontFamily: 'serif' }}>
                                {category}
                            </div>

                            {/* Brand Name */}
                            <h3 className="text-lg font-bold mb-3 text-secondary1"
                                style={{
                                    fontFamily: 'serif',
                                    textShadow: '1px 1px 2px rgba(255,255,255,0.3)'
                                }}>
                                {name}
                            </h3>

                            {/* Description */}
                            <p className="text-sm leading-relaxed text-secondary1"
                                style={{
                                    fontFamily: 'serif'
                                }}>
                                {description}
                            </p>
                        </div>

                        {/* Bottom Accent */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary1/30 to-primary1 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    </div>
                </a>
            </Link>
        </article>
    )
}