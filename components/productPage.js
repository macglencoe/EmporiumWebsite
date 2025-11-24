import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { handleLocationClick } from '../utils/location';
import { handlePhoneClick } from '../utils/phone';
import { PiArrowLeftBold, PiArrowRightBold, PiCaretRight, PiCaretRightBold, PiMapPinBold, PiPhoneBold, PiRuler, PiRulerBold, PiShareFatBold } from 'react-icons/pi';

const buildShareUrl = (router) => {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}${router.asPath}`;
  }
  return router?.asPath || '';
};

const sharePage = (router, title, text) => {
  if (typeof navigator === 'undefined') {
    alert('Share is not available in this browser.');
    return;
  }

  const url = buildShareUrl(router);
  const payload = {
    title: title || 'King Street Emporium',
    text: text || 'Check this out from King Street Emporium',
    url,
  };

  if (navigator.share) {
    navigator.share(payload);
    return;
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard.');
    });
    return;
  }

  alert('Share is not available in this browser.');
};

export const PodcastLink = ({ url }) => {
  if (!url) return null;

  const iframeMatch = url.includes('<iframe') ? url.match(/src="([^"]*)"/) : null;
  const embedUrl = iframeMatch ? iframeMatch[1] : null;

  return (
    <section className="mt-4 bg-gradient-to-br from-primary2 via-primary2 to-primary2/90 border-2 border-primary1 rounded-xl shadow-lg text-secondary1 overflow-hidden">
      <div className="p-4 sm:p-5 space-y-3">
        <p className="uppercase tracking-[0.14em] text-secondary2 text-xs font-semibold">Featured on</p>
        <h3 className="text-2xl font-bold" style={{ fontFamily: 'serif' }}>The Stick Figures Podcast</h3>
        <p className="text-secondary2 leading-relaxed">
          We discussed this product on the show.
        </p>
        {embedUrl ? (
          <div className="rounded-lg overflow-hidden border border-primary1/40 bg-primary2/40">
            <iframe title="Podcast episode" src={embedUrl} frameBorder="0" className="w-full h-56" allow="autoplay" />
          </div>
        ) : (
          <a className="inline-flex items-center gap-2 text-primary1 font-semibold underline" href={url} target="_blank" rel="noreferrer">
            Listen to the episode
          </a>
        )}
      </div>
    </section>
  );
};

export const StringBubbleList = ({ title, data = [] }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="bg-primary1/20 rounded-xl shadow-md p-4 space-y-3 text-secondary1">
      {title && (
        <p className="uppercase tracking-[0.12em] text-xs text-secondary2 font-semibold">{title}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {data.map((item) => (
          <span
            key={item}
            className="bg-primary1/30 text-secondary1 border border-primary1/40 px-3 py-1 rounded-full text-xs font-semibold font-inter"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export const ProductImage = ({ src, fallbackSearch, alt }) => {
  const query = fallbackSearch || 'cigar';
  const searchUrl = `https://www.google.com/search?tbm=isch&q=${query}`;

  return (
    <div className="relative bg-primary1/20 rounded-2xl shadow-lg overflow-hidden">
      <div className="absolute inset-3 border border-primary1/40 rounded-xl pointer-events-none opacity-60" aria-hidden />
      {src ? (
        <img
          src={src}
          alt={alt || 'Product image'}
          className="w-full h-full max-h-[420px] object-cover"
        />
      ) : (
        <div className="p-6 text-center space-y-2 text-secondary1">
          <p className="font-semibold">No image yet.</p>
          <a className="text-primary1 underline font-semibold" href={searchUrl} target="_blank" rel="noopener noreferrer">
            Search for photos
          </a>
        </div>
      )}
    </div>
  );
};

export const ProductSideContent = ({ children }) => {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:col-span-2">
      {children}
    </aside>
  );
};

export const ProductMainContent = ({ children }) => {
  return (
    <div className="space-y-4 lg:col-span-3">
      {children}
    </div>
  );
};

export const ProductTitle = ({ children, breadcrumbs = [], meta, description }) => {
  if (!children) return null;

  return (
    <header className="bg-primary1/10 rounded-xl shadow-md p-4 space-y-2 text-secondary1">
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="text-xs text-secondary2">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((crumb, idx) => (
              <li key={`${crumb.label}-${idx}`} className="flex items-center gap-2 font-inter">
                {crumb.href ? (
                  <Link href={crumb.href}>
                    <a className="uppercase tracking-[0.12em] font-semibold hover:text-secondary1 transition">
                      {crumb.label}
                    </a>
                  </Link>
                ) : (
                  <span className="uppercase tracking-[0.12em] font-semibold">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <span aria-hidden>
                  <PiCaretRightBold size={16} />
                </span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ fontFamily: 'serif' }}>
        {children}
      </h2>
      {meta && <p className="text-secondary2 font-semibold">{meta}</p>}
      {description &&
        <>
          <p className="mt-2 leading-relaxed text-secondary1/90">{description}</p>
        </>
      }
    </header>
  );
};

export const ProductInfoFields = ({ fields = [] }) => {
  const visible = fields.filter((field) => field && field.value);
  if (visible.length === 0) return null;

  return (
    <section className="grid gap-3 sm:grid-cols-2">
      {visible.map((field) => (
        <article
          key={field.name}
          className="bg-primary1/10 rounded-xl p-3 shadow-sm text-secondary1 flex flex-row gap-1 items-start"
        >
          {field.icon && <field.icon size={25} className="mr-2" />}
          <div className='flex flex-col gap-1 p-1'>
            <p className="uppercase tracking-[0.1em] text-xs text-secondary2 font-semibold">{field.name}</p>
            {field.markout && field.markout !== field.value && (
              <span className="line-through text-secondary2 text-sm">{field.markout}</span>
            )}
            <p className="text-xl font-bold">{field.value}</p>
          </div>
        </article>
      ))}
    </section>
  );
};

export const ProductBasicInfo = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="bg-primary2/80 rounded-xl p-4 text-secondary1 shadow-sm">
      <p className="uppercase tracking-[0.1em] text-xs text-secondary2 font-semibold">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
};

export const ProductSizeChart = ({ sizes = [], allCigarSizes = {} }) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <section className="bg-primary1/20 rounded-xl shadow-md p-4 space-y-3 text-secondary1">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className='flex flex-row gap-2 items-center'>
          <PiRuler size={25} />
          <p className="uppercase tracking-[0.12em] text-xs text-secondary2 font-semibold">Available sizes</p>
          
        </span>
        <p className="text-secondary2 text-xs">Measurements shown where available.</p>
      </div>
      <ul className="space-y-2">
        {sizes.map((size) => {
          const measurements = allCigarSizes[size.Size];
          const inStock = size['In_Stock'];
          return (
            <li
              key={size.Size}
              className="flex items-center justify-between gap-3 bg-primary2/60 border border-primary1/40 rounded-lg px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{size.Size}</span>
                {measurements && (
                  <span className="text-secondary2 text-xs font-inter">{measurements.join(' x ')} *</span>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${inStock ? 'bg-[var(--positive)] text-primary2 font-inter border-green-600' : 'bg-red-200 text-red-900 border-red-600'}`}>
                {inStock ? 'In stock' : 'Out of stock'}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-secondary2 text-xs">* estimate based on standard dimensions</p>
    </section>
  );
};

export const InteractionPanel = ({ title, text }) => {
  const router = useRouter();

  const actions = [
    {
      key: 'call',
      label: 'Call for availability',
      helper: 'During business hours',
      helperClass: 'text-secondary1/80 text-xs',
      icon: <PiPhoneBold size={30} />,
      onClick: handlePhoneClick,
    },
    {
      key: 'visit',
      label: 'Visit The Emporium',
      helper: 'Get directions',
      icon: <PiMapPinBold size={30} />,
      onClick: handleLocationClick,
    },
    {
      key: 'share',
      label: 'Share',
      helper: 'Send this page',
      icon: <PiShareFatBold size={30} />,
      onClick: () => sharePage(router, title, text),
    },
  ];

  const baseButtonClass = 'flex items-center gap-3 px-4 py-3 rounded-xl font-bold shadow-md hover:translate-y-[-2px] transition bg-primary1/20 hover:bg-primary1/10';

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => (
        <button
          key={action.key}
          className={`${baseButtonClass} ${action.className}`}
          onClick={action.onClick}
        >
          <span aria-hidden>{action.icon}</span>
          <div className="flex flex-col text-left leading-tight">
            <span>{action.label}</span>
            <span className={action.helperClass || 'text-secondary2 text-xs'}>{action.helper}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export const ShareButton = ({ title, text }) => {
  const router = useRouter();

  return (
    <button
      className="inline-flex items-center gap-2 bg-primary1 text-secondary2 px-4 py-2 rounded-lg font-bold shadow-md hover:translate-y-[-2px] transition"
      onClick={() => sharePage(router, title, text)}
    >
      Share
    </button>
  );
};

export const Divider = () => (
  <span className="block w-full h-px bg-gradient-to-r from-transparent via-primary1 to-transparent" />
);

export const Navigation = ({ prev, next, href, nameField }) => {
  if (!prev && !next) return null;

  return (
    <nav className="grid gap-3 sm:grid-cols-2 mt-3" aria-label="Product pagination">
      {prev && prev[nameField] && (
        <Link href={`..${href}/${prev.slug}`}>
          <a className="group flex items-center justify-start gap-3 bg-primary1/20 hover:bg-primary1/10 rounded-xl p-3 shadow-sm hover:-translate-y-0.5 transition text-secondary1">
            <span className="text-lg" aria-hidden>
              <PiArrowLeftBold size={16} />
            </span>
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.12em] text-secondary2">Previous</p>
              <p className="font-bold group-hover:underline">{prev[nameField]}</p>
            </div>
          </a>
        </Link>
      )}
      {next && next[nameField] && (
        <Link href={`..${href}/${next.slug}`}>
          <a className="group flex items-center justify-end gap-3 bg-primary1/20 hover:bg-primary1/10 rounded-xl p-3 shadow-sm hover:-translate-y-0.5 transition text-secondary1">
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.12em] text-secondary2">Next</p>
              <p className="font-bold group-hover:underline">{next[nameField]}</p>
            </div>
            <span className="text-lg" aria-hidden><PiArrowRightBold size={16} /></span>
          </a>
        </Link>
      )}
    </nav>
  );
};

export const Disclaimer = () => (
  <p className="text-center text-secondary2 text-sm mt-6">
    Availability changes quickly. Call or visit during open hours to confirm stock. No online sales.
  </p>
);

const ProductPage = ({ children }) => {
  return (
    <section className="bg-primary2 text-secondary1 p-4 sm:p-6 space-y-5">
      <div className="flex flex-col-reverse gap-6 lg:grid lg:grid-cols-5 lg:items-start">
        {children}
      </div>
    </section>
  );
};

export default ProductPage;
