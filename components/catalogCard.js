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
    const canvasRef = useRef(null);

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
    const displayTitle = [name, title].filter(Boolean).join(' ').trim();
    const imageAlt = displayTitle ? `Cigar image: ${displayTitle}` : 'Cigar image';
    const linkLabel = displayTitle ? `View details for ${displayTitle}` : 'View details for catalog item';


    return (
            <Link href={href}>
                <a
                    className="group block relative transition-transform duration-300 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary1 focus-visible:ring-offset-2 focus-visible:ring-offset-primary2 min-w-3xs max-w-sm"
                    aria-label={linkLabel}
                >
                    <div className="bg-gradient-to-br from-primary2/80 via-primary2 to-primary2/90 border-2 border-primary1 rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
                    {/* Decorative Inner Frame */}
                        <div className="absolute inset-3 border border-primary1/40 rounded-lg pointer-events-none opacity-60" aria-hidden="true"></div>

                    {/* Image */}
                        {image && (
                            <div className="aspect-square overflow-hidden bg-secondary2/30">
                                <img
                                    src={image}
                                    alt={imageAlt}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
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
                        <dl className="flex flex-col" aria-label="Item details">
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
                        </dl>


                    {/* Barcode */}
                        {barcode && (
                            <div className="flex justify-center p-4" aria-live="polite">
                                <canvas
                                    ref={canvasRef}
                                    role="img"
                                    aria-label={`Barcode for ${displayTitle || 'item'}: ${barcode}`}
                                />
                                <span className="sr-only">Barcode value {barcode}</span>
                            </div>
                        )}

                    {/* CTA + Sizes */}
                        <div className="p-4 text-center space-y-2">
                            {buttonText && (
                                <span
                                    className="text-md text-secondary2 font-medium border-t border-b border-primary1 py-2 mt-2 flex justify-center items-center gap-3 uppercase w-full"
                                    style={{ fontFamily: 'Playfair Display' }}
                                >
                                    {buttonText}
                                </span>
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
    const labelText = label || 'Detail';
    const strengthIndex = STRENGTH_LEVELS.findIndex(
        level => level.toLowerCase() === normalizedValue.toLowerCase()
    );
    const showGauge = isStrengthGauge && strengthIndex !== -1;
    const tagList = normalizedValue ? normalizedValue.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    const containerLayout = (isTags && !hideLabel)
        ? 'flex flex-col items-start'
        : 'flex items-start justify-between';
    return (
        <div className={`${containerLayout} border-b border-dashed border-primary1 py-2 mx-5 gap-y-1 space-x-3`}>
            <dt className={`font-semibold flex items-center gap-2 my-1 w-fit ${hideLabel ? 'sr-only' : ''}`}>
                {IconComponent && <IconComponent className="w-4.5 h-4.5 text-secondary1/70" aria-hidden="true" focusable="false" />}
                <span>{labelText}</span>
            </dt>
            {isTags ? (
                <dd className="flex flex-wrap justify-start gap-2 flex-1 font-inter" aria-label={`${labelText} tags`}>
                    {tagList.length > 0 ? (
                        tagList.map((tag, tagIndex) => (
                            <span
                                key={tagIndex}
                                className="bg-primary1/30 text-secondary1 border border-primary1/40 px-2 py-1 rounded text-xs font-medium"
                            >
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="text-secondary2 text-sm">No tags</span>
                    )}
                </dd>
            ) : showGauge ? (
                <dd>
                    <StrengthGauge activeIndex={strengthIndex} value={normalizedValue} />
                </dd>
            ) : (
                <dd className="text-right flex items-center h-full">{normalizedValue || 'Not specified'}</dd>
            )}
        </div>
    )
}

function StrengthGauge({ activeIndex, value }) {
    return (
        <div className="flex items-center gap-2 h-full font-inter">
            <div className="flex items-center gap-1" role="img" aria-label={`Strength ${value}`}>
                {STRENGTH_LEVELS.map((level, index) => (
                    <div
                        key={level}
                        className={`h-2 w-6 rounded-full transition-colors duration-200 ${index <= activeIndex ? 'bg-primary1' : 'bg-primary1/20'}`}
                        aria-hidden="true"
                        title={level}
                    />
                ))}
            </div>
            <span className="text-xs text-secondary2 whitespace-nowrap">{value}</span>
        </div>
    );
}

export default CatalogCard;
