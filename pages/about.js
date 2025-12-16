import React, { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import Data from "../public/data/consolidated_cigars.json"

import Contact from '../components/contact'
import Directory from '../components/directory'
import Ksman from '../components/ksman'
import Layout from '../components/layout'
import PageTitle1 from '../components/pagetitle1'
import BasicSection from '../components/basicSection'
import { PiInfoDuotone, PiInfoFill, PiStorefrontDuotone } from 'react-icons/pi'
import BasicParagraph from '../components/basicParagraph'
import Image from 'next/image'
import { CgWebsite } from 'react-icons/cg'

const About = (props) => {
    return (
        <>
            <Head>
                <title>About</title>
            </Head>
            <Layout>
                <BasicSection
                    backdropSrc="/kschairs.jpg"
                    title="Our Store"
                    titleIcon={PiStorefrontDuotone}
                >
                    <div className='flex flex-row gap-4 items-stretch'>
                        <div>
                            <span className='text-2xl tracking-wide text-center max-w-5xl mx-auto w-fit font-semibold'>The King Street Coffee & Tobacco Emporium</span>
                            <BasicParagraph className='mt-5 font-medium'>
                                Opening its doors for business in 1993, our shop & lounge has been a staple of Martinsburg, WV ever since.
                            </BasicParagraph>
                            <BasicParagraph>
                                Owned and operated by life-long Martinsburg resident, <strong>Edward Trout</strong> makes his customers feel at home, whether they're new to the shop or a regular.
                            </BasicParagraph>
                            <br />
                            <BasicParagraph>
                                With an Old World feel, the Emporium is a place to shop <strong>premium cigars, pipe tobaccos, coffee beans, and loose & bagged teas</strong>. Stop in for a fresh cup, or settle in to smoke your selection of cigar or pipe tobacco. You'll find the regulars are sure to provide the conversation to complement your experience.
                            </BasicParagraph>
                            <br />
                            <BasicParagraph>
                                We are located in Martinsburg, WV, right on King & Church, conveniently nestled in the Shenandoah Valley of the Blue Ridge Mountains off of Interstate 81.
                            </BasicParagraph>
                            <br />
                            <BasicParagraph>
                                Regular updates about closings, events, offers, and more can be found on our <a href='https://www.facebook.com/people/King-Street-Coffee-Tobacco-Emporium/100063496593967/?ref=embed_page'>Facebook page</a>.
                            </BasicParagraph>
                        </div>
                        <Image
                            src="/ks-storefront.jpg"
                            alt="King Street Coffee & Tobacco Emporium storefront"
                            width={600}
                            height={700}
                            className="rounded-lg mx-auto my-5 object-cover"
                        />
                        {/* TODO: Take a new photo of the store */}
                    </div>
                </BasicSection>
                <BasicSection
                    backdropSrc="/website-bg.jpg"
                    title="Our Website"
                    titleIcon={CgWebsite}
                >
                    <BasicParagraph className='font-medium'>
                        This website is your go-to platform for information about King Street Coffee & Tobacco Emporium.
                    </BasicParagraph>
                    <br />
                    <BasicParagraph>
                        The online catalog allows you to browse our selection anytime, anywhere. With regularly updated offerings, our catalog will help you find what you need!
                    </BasicParagraph>
                    <br />
                    <h3 className='font-semibold text-2xl'>Have a question or issue?</h3>
                    <ul className='list-disc list-inside space-y-2 my-2'>
                        <li><a href='https://github.com/macglencoe/EmporiumWebsite/issues/new' target='_blank' rel='noreferrer' className='underline'>Report an issue on GitHub</a></li>
                        <li>Contact the developer via email: <a href='mailto:me@macglencoe.com' className='underline'>me@macglencoe.com</a></li>
                    </ul>
                    <BasicParagraph>

                    </BasicParagraph>
                </BasicSection>
                
            </Layout>
        </>
    )
}


export default About
