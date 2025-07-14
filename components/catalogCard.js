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

                    {/* Title Block */}
                    <div className="p-4 text-center flex flex-col justify-center">
                        <h3 className="text-secondary1 text-xl font-bold leading-tight" style={{ fontFamily: 'serif' }}>
                            <div className="text-sm italic text-secondary2 font-light mb-1">{secondaryTitle}</div>
                            <div className="uppercase">{name} {title}</div>
                        </h3>
                    </div>

                    {/* Description (if no image) */}
                    {!image && description && (
                        <div className="px-4 text-secondary2 text-sm mb-4 text-center">
                            <p className="line-clamp-3">{description}</p>
                        </div>
                    )}

                    {/* Field Data */}
                    {(Array.isArray(data) ? data : [])
                        .filter(field => Array.isArray(field) && field.length >= 2 && field[1])
                        .map(([label, value], index) => (
                            <div key={index} className="flex justify-between border-b border-dashed border-primary1 py-2 mx-5">
                                <span className="font-semibold">{label}</span>
                                <span className="text-right">{value}</span>
                            </div>
                        ))}


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

export default CatalogCard;
