import Link from 'next/link';
import JsBarcode from 'jsbarcode';
import { useEffect, useRef } from 'react';

const STRENGTH_LEVELS = ['Mild', 'Mild-Medium', 'Medium', 'Medium-Full', 'Full'];

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
    const typeString = String(type || '');
    const hideLabel = typeString.includes('hidden-label');
    const isTags = typeString.includes('tags');
    const isStrengthGauge = typeString.includes('strength-gauge');
    const normalizedValue = value === undefined || value === null ? '' : String(value).trim();
    const strengthIndex = STRENGTH_LEVELS.findIndex(
        level => level.toLowerCase() === normalizedValue.toLowerCase()
    );
    const showGauge = isStrengthGauge && strengthIndex !== -1;
    return (
        <div className="flex justify-between border-b border-dashed border-primary1 py-2 mx-5 items-start space-x-3 gap-y-1" style={{
            justifyContent: hideLabel ? 'flex-start' : 'space-between',
            flexDirection: (!hideLabel && isTags) ? 'column' : 'row'
        }}>
            <span className='font-semibold flex items-center gap-2 my-1 w-fit'>
                {icon && <IconComponent className="w-4.5 h-4.5 text-secondary1/70" />}
                {label && !hideLabel && <span>{label}</span>}
            </span>
            {isTags ? (
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
            ) : showGauge ? (
                <StrengthGauge activeIndex={strengthIndex} value={normalizedValue} />
            ) : (
                <span className="text-right">{value}</span>
            )}
        </div>
    )
}

function StrengthGauge({ activeIndex, value }) {
    return (
        <div className="flex items-center gap-2 h-full">
            <div className="flex items-center gap-1" aria-label={`Strength ${value}`}>
                {STRENGTH_LEVELS.map((level, index) => (
                    <div
                        key={level}
                        className={`h-2 w-6 rounded-full transition-colors duration-200 ${index <= activeIndex ? 'bg-primary1' : 'bg-primary1/20'}`}
                        title={level}
                    />
                ))}
            </div>
            <span className="text-xs text-secondary2 whitespace-nowrap">{value}</span>
        </div>
    );
}

export default CatalogCard;
