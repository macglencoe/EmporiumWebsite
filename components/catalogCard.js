import Link from 'next/link';
import JsBarcode from 'jsbarcode';
import { useEffect, useRef } from 'react';

const CatalogCard = ({
    href,
    image,
    title,
    secondaryTitle,
    name,
    data = [],
    barcode,
    buttonText,
    description,
    sizes = [],
}) => {
    const canvasRef = useRef();

    useEffect(() => {
        if (canvasRef.current && barcode) {
            JsBarcode(canvasRef.current, barcode, {
                format: 'CODE128',
                width: 2,
                height: 30,
                fontSize: 16,
                displayValue: true,
            });
        }
    }, [barcode]);

    const safeSizes = Array.isArray(sizes) ? sizes : [];
    const singleSize = safeSizes.length === 1 ? safeSizes[0] : null;


    return (
        <Link href={href}>
            <a className="group block relative transition-transform duration-300 hover:scale-[1.01] min-w-3xs max-w-sm">
                <div className="bg-gradient-to-br from-primary2/80 via-primary2 to-primary2/90 border-2 border-primary1 rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
                    {/* Decorative Inner Frame */}
                    <div className="absolute inset-3 border border-primary1/40 rounded-lg pointer-events-none opacity-60"></div>

                    {/* Image */}
                    {image && (
                        <div className="aspect-square overflow-hidden bg-secondary2/30">
                            <img
                                src={image}
                                alt={`Cigar image: ${title}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className='p-4 flex-row justify-between items-start'>
                        {/* Title Block */}
                        <div className="p-4 flex flex-col text-start">
                            <h3 className="text-secondary1 text-xl font-bold leading-tight" style={{ fontFamily: 'serif' }}>
                                <div className="uppercase">{name} {title}</div>
                                <div className="text-sm italic text-secondary2 font-light mb-1">{secondaryTitle}</div>
                            </h3>
                        </div>
                        {/* top right corner space for future use (like price) */}
                    </div>

                    {/* Description (if no image) */}
                    {!image && description && (
                        <div className="px-4 text-secondary2 text-sm mb-4 text-center">
                            <p className="line-clamp-3">{description}</p>
                        </div>
                    )}

                    {/* Field Data */}
                    {(Array.isArray(data) ? data : [])
                        .filter(field => field && field.value)
                        .map((field, index) => (
                            <DataField
                                key={index}
                                label={field.label}
                                value={field.value}
                                icon={field.icon}
                                type={field.type}
                            />
                        ))
                    }


                    {/* Barcode */}
                    {barcode && (
                        <div className="flex justify-center p-4">
                            <canvas ref={canvasRef} />
                        </div>
                    )}

                    {/* CTA + Sizes */}
                    <div className="p-4 text-center space-y-2">
                        {buttonText && (
                            <button
                                type="button"
                                className="text-md text-secondary2 font-medium border-t border-b border-primary1 py-2 mt-2 flex justify-center items-center gap-3 uppercase w-full"
                                style={{ fontFamily: 'Playfair Display' }}
                            >
                                {buttonText}
                            </button>
                        )}
                        {safeSizes.length > 0 && (
                            <div className="text-md text-secondary2 font-medium border-t border-b border-primary1 py-2 mt-2 flex justify-center items-center gap-3 uppercase">
                                <span>
                                    {safeSizes.length > 1
                                        ? `${safeSizes.length} Sizes Available`
                                        : singleSize?.Size || '1 Size'}
                                </span>
                                {singleSize?.In_Stock === false && (
                                    <span className="bg-red-600 text-primary2 px-2 py-1 rounded text-xs font-bold">
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </a>
        </Link>
    );
};

function DataField({ label, icon, value, type }) {
    const IconComponent = icon;
    return (
        <div className="flex justify-between border-b border-dashed border-primary1 py-2 mx-5 items-start space-x-3 gap-y-1" style={{
            justifyContent: String(type).includes('hidden-label') ? 'start'
            : 'between',
            flexDirection: (!String(type).includes('hidden-label') && String(type).includes('tags')) ? 'column' : 'row'
        }}>
            <span className='font-semibold flex items-center gap-2 my-1 w-fit'>
                {icon && <IconComponent className="w-4.5 h-4.5 text-secondary1/70" />}
                {label && !String(type).includes('hidden-label') && <span>{label}</span>}
            </span>
            {String(type).includes('tags') ? (
                <div className="flex flex-wrap justify-start gap-2 flex-1">
                    {value.split(',').map((tag, tagIndex) => (
                        <span
                            key={tagIndex}
                            className="bg-primary1/30 text-secondary1 border border-primary1/40 px-2 py-1 rounded text-xs font-bold"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            ) : (
                <span className="text-right">{value}</span>
            )}
        </div>
    )
}

export default CatalogCard;
