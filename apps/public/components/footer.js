import Link from 'next/link';
import {
  PiClockFill,
  PiEnvelopeSimpleFill,
  PiFacebookLogoFill,
  PiInstagramLogoFill,
  PiMapPinFill,
  PiPhoneFill,
} from 'react-icons/pi';

const URLs = {
  facebook:
    'https://www.facebook.com/p/King-Street-Coffee-Tobacco-Emporium-100063496593967/',
  instagram: 'https://www.instagram.com/kingstreetcigarwv/',
  telephone: 'tel:304-264-9130',
  email: 'mailto:kingstreetemporium@gmail.com',
  maps: 'https://maps.google.com/?q=320+W+King+Street,+Martinsburg,+West+Virginia',
};

const navLinks = [
  { href: '/cigars', label: 'Cigars' },
  { href: '/pipes', label: 'Pipes' },
  { href: '/caffeine', label: 'Coffee & Tea' },
  { href: '/tobacco', label: 'Tobacco' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Visit & Contact' },
];

const hours = [
  { day: 'Mon - Sat', time: '10:00 AM - 6:00 PM' },
  { day: 'Sunday', time: 'Closed' },
];

const SocialButton = ({ href, label, children }) => {
  const external = href.startsWith('http');

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      aria-label={label}
      className="group flex h-11 w-11 items-center justify-center rounded-full border border-primary1/30 bg-primary1/10 text-primary2 transition hover:bg-primary1 hover:text-secondary1"
    >
      {children}
    </a>
  );
};

const ContactRow = ({ icon, label, href, children }) => {
  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className={href ? 'block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary1/70 rounded-md' : undefined}
    >
      <div className="group flex items-start gap-3 rounded-lg border border-primary1/5 bg-secondary2/20 px-4 py-3 transition hover:border-primary1/40 hover:bg-secondary2/40">
        <span className="mt-1 text-primary1">{icon}</span>
        <div>
          <p className="text-xs uppercase tracking-widest text-primary2/70">
            {label}
          </p>
          <p className="font-inter text-base text-primary2 group-hover:text-primary1 transition">
            {children}
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

function Hours() {
  return (
    <div className="space-y-3 rounded-xl border border-primary1/10 bg-secondary2/20 p-3 text-primary2">
      <span className='text-xs uppercase tracking-widest text-primary2/70 font-bold font-inter'>Hours</span>
        <div className="flex items-center justify-between gap-4 text-base font-inter">
          <div className="text-xs uppercase tracking-widest text-primary2/70">
            <span>MON-SAT</span>
          </div>
          <div className='flex flex-col rounded overflow-hidden text-right font-semibold'>
            <span className='bg-primary1 text-secondary1 py-1 px-2'>10:00AM</span>
            <span className='bg-primary2 text-secondary2 py-1 px-2'>6:00PM</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 text-base font-inter">
          <div className="text-xs uppercase tracking-widest text-primary2/70">
            <span>SUNDAY</span>
          </div>
          <span className={`font-semibold text-right text-secondary2 uppercase tracking-wide`}>
            Closed
          </span>
        </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="mt-12 bg-secondary1 text-primary2 border-t-8 border-secondary2">
      <div className="max-w-6xl mx-auto w-full px-6 py-12 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="small-caps text-3xl font-extrabold text-primary2">
                The King Street Emporium
              </h2>
              <span className="block h-1 w-20 rounded-full bg-gradient-to-r from-primary2 via-primary1 to-primary2" />
            </div>

            <div className="flex gap-3">
              <SocialButton href={URLs.facebook} label="Visit our Facebook">
                <PiFacebookLogoFill size={20} />
              </SocialButton>
              <SocialButton href={URLs.instagram} label="Visit our Instagram">
                <PiInstagramLogoFill size={20} />
              </SocialButton>
              <SocialButton href={URLs.telephone} label="Give us a call">
                <PiPhoneFill size={20} />
              </SocialButton>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-wide text-primary1">
              Visit The Shop
            </h3>
            <span className="block h-0.5 w-12 bg-primary1/60" />
            <div className="space-y-4">
              <ContactRow
                icon={<PiMapPinFill size={22} />}
                label="Address"
                href={URLs.maps}
              >
                320 W King Street<br />
                Martinsburg, WV 25401
              </ContactRow>
              <Hours />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-wide text-primary1">
              Quick Links
            </h3>
            <span className="block h-0.5 w-12 bg-primary1/60" />
            <ul className="space-y-2 text-lg font-inter">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="group flex items-center gap-2 text-primary2/90 transition hover:text-primary1">
                      <span className="h-px w-5 bg-primary1/40 transition-all duration-300 group-hover:w-8 group-hover:bg-primary1" />
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-wide text-primary1">
              Contact Us
            </h3>
            <span className="block h-0.5 w-12 bg-primary1/60" />
            <ContactRow
              icon={<PiPhoneFill size={22} />}
              label="Phone"
              href={URLs.telephone}
            >
              (304) 264-9130
            </ContactRow>
            <ContactRow
              icon={<PiEnvelopeSimpleFill size={22} />}
              label="Email"
              href={URLs.email}
            >
              <p className='text-xs'>kingstreetemporium@gmail.com</p>
            </ContactRow>
          </div>
        </div>
      </div>
      <div className="border-t border-primary2/20 bg-secondary2/40 px-6 py-4">
        <p className="text-center text-xs font-inter tracking-widest text-primary2/70">
          © {new Date().getFullYear()} 2025 King Street Coffee & Tobacco Emporium - Web Design & Development by Liam Paul McDonald
        </p>
        <p className='text-center text-xs font-inter tracking-widest'><a className='text-primary1/70' href='/privacy'>Privacy Policy</a></p>
      </div>
    </footer>
  );
}
