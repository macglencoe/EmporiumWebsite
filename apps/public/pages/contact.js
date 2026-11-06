import Head from "next/head";
import Layout from "../components/layout";
import PageTitle1 from "../components/pagetitle1";
import {
    PiClockBold,
    PiEnvelopeSimpleBold,
    PiMapPinBold,
    PiNavigationArrowBold,
    PiPhoneBold,
} from "react-icons/pi";

const ContactPage = (props) => {
    return(
        
        <>
        <Head>
            <title>Contact</title>
        </Head>
            <Layout>
                    <PageTitle1 subtitle="Contact & Location Information">How to Reach Us</PageTitle1>

                    <section className="rounded-2xl border border-primary1/30 px-5 sm:px-8 py-6 sm:py-8 space-y-6">
                        <div className="rounded-xl border border-primary1/25 bg-primary2 shadow-md p-5 sm:p-6">
                            <p className="text-secondary1 font-inter text-base leading-relaxed max-w-3xl">
                                Call for stock checks or to hold something aside. We are quick to respond by phone during shop hours, and we check emails after hours.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            <ContactCard 
                                icon={PiPhoneBold} 
                                title="Call Us"
                                description="Talk with the crew (shop hours only)"
                                details="+1 (304) 264 9130"
                                href="tel:+13042649130"
                            />
                            <ContactCard 
                                icon={PiEnvelopeSimpleBold} 
                                title="Email"
                                description="For special orders or inquiries"
                                details="kingstreetemporium@gmail.com"
                                href="mailto:kingstreetemporium@gmail.com"
                            />
                            <ContactCard 
                                icon={PiMapPinBold} 
                                title="Visit the Lounge"
                                description="Street parking on King Street; free 10-minute parking spots on Church Street."
                                details="320 W King St, Martinsburg, WV 25401"
                                href="https://maps.google.com/?q=320+W+King+St,+Martinsburg,+WV+25401"
                            />
                            <ContactCard 
                                icon={PiClockBold} 
                                title="Shop Hours"
                            >
                                <div className="space-y-1 text-secondary1 font-inter text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-secondary2 font-semibold">Mon - Sat</span>
                                        <span>10:00am - 6:00pm</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-secondary2 font-semibold">Sunday</span>
                                        <span className="uppercase tracking-wide text-secondary2/80">Closed</span>
                                    </div>
                                </div>
                            </ContactCard>
                        </div>

                        
                    </section>
            </Layout>
        </>
    )
}

function ContactCard({icon, title, description, details, href, children}) {
    const IconComponent = icon;
    return (
        <div className="rounded-xl border border-primary1/25 bg-primary2 shadow-md p-5 sm:p-6">
            <div className="flex items-start gap-4">
                {IconComponent && (
                    <div className="h-11 w-11 rounded-md bg-primary1/15 border border-primary1/30 flex items-center justify-center text-secondary2">
                        <IconComponent className="text-xl" />
                    </div>
                )}
                <div className="flex-1 space-y-1">
                    {title && <h3 className="text-lg font-semibold text-secondary1">{title}</h3>}
                    {description && <p className="text-secondary2 text-sm tracking-wide">{description}</p>}
                    {children}
                    {!children && details && (
                        href ? (
                            <a
                                href={href}
                                className="inline-flex items-center gap-2 text-base text-secondary1 hover:text-primary1 transition font-inter"
                            >
                                {details}
                            </a>
                        ) : (
                            <p className="text-base text-secondary1 font-inter">{details}</p>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContactPage
