import React, { Fragment } from 'react'
import { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { handleLocationClick } from '../utils/location'
import { handlePhoneClick } from '../utils/phone'
import { handleEmailClick } from '../utils/email'
import Link from 'next/link'
import { PiClockBold, PiDoorFill, PiDoorOpenFill, PiEnvelopeSimpleFill, PiNavigationArrowFill, PiPhoneFill } from 'react-icons/pi'

const ContactLink = (props) => {
    return (
        <>
            <Link href={props.href ? props.href : ""}>

                <a
                    onClick={props.onClick}
                    tabIndex={0}
                    aria-label={props['aria-label']}
                >
                    <div className='contact-link-container'
                    >
                        <div>
                            {props.icon}
                        </div>
                        <span style={props["text-style"]}>{props.children}</span>
                    </div>
                </a>
            </Link>
            <style jsx>
                {`
a {
    width: 100%;
}
.contact-link-container {
    gap: var(--dl-space-space-unit);
    width: 100%;
    display: flex;
    border-radius: var(--dl-radius-radius-radius8);
    background-color: var(--dl-color-theme-secondary1);
    padding-right: 0.5em;
    align-items: stretch;
    align-items: center;
    position: relative;
    overflow: hidden;
}
.contact-link-container div {
    flex: 0 0 auto;
    width: var(--dl-size-size-small);
    display: flex;
    align-items: center;
    border-radius: var(--dl-radius-radius-radius4);
    justify-content: center;
    background-color: var(--dl-color-theme-primary1);
    border-top-left-radius: var(--dl-radius-radius-radius8);
    border-top-right-radius: 0;
    border-bottom-left-radius: var(--dl-radius-radius-radius8);
    border-bottom-right-radius: 0;
    transition: 0.3s ease;
    aspect-ratio: 1/1;
}
.contact-link-container span {
    fill: var(--dl-color-theme-primary2);
    color: var(--dl-color-theme-primary2);
    width: auto;
    height: 100%;
    font-style: normal;
    text-align: left;
    font-weight: 500;
    font-family: 'Inter';
    font-size: 1.2em;
    width: 100%;
    height: 100%;
    text-align: right;
    align-content: center;
    flex-wrap: wrap;
    margin: 0.4em 0;
}
.contact-link-container svg {
    fill: var(--dl-color-theme-secondary1);
}
.contact-link-container:hover svg {
    fill: var(--dl-color-theme-secondary2);
}
.contact-link-container:hover span {
    text-decoration: underline;
}
.contact-link-container:hover {
    cursor: pointer;
}
.contact-link-container:hover div {
    background-color: var(--dl-color-theme-primary2);
}
            `}
            </style>
        </>
    )
}

const Hours = (props) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const currentDayIndex = currentTime.getDay();

    useEffect(() => {
        const currentHour = currentTime.getHours();
        // Hours are set here
        setIsOpen(currentHour >= props.openingTime &&
            currentHour < props.closingTime &&
            props.openDays.includes(currentDayIndex));
    }, [currentTime]);

    const hoursDescription = 'Open Monday through Saturday from 10 a.m. to 6 p.m.; closed on Sunday.';

    return (
        <>
            <div
                className='
                    bg-secondary1 p-2 rounded-md w-full font-inter
                    grid grid-cols-3 grid-rows-3
                    overflow-hidden
                '
                style={{
                    gridTemplateColumns: 'auto 0 auto',
                    gridTemplateRows: '1fr 1fr 1.5fr',
                }}
                role="group"
                aria-label="Store hours"
                aria-describedby="hours-description"
            >
                <span id="hours-description" className='sr-only'>{hoursDescription}</span>
                <span className='text-primary2 font-bold text-md uppercase tracking-wider text-center py-1'>Mon - Sat</span>
                <span className='relative border-r-2 border-primary1' aria-hidden="true">
                    <PiClockBold size={35} className='
                    text-primary1 bg-secondary1
                    absolute
                    left-1/2 bottom-0
                    -translate-x-1/2 translate-y-1/2
                ' focusable="false" aria-hidden="true"/>
                </span>
                <span className='text-primary2 font-bold text-md uppercase tracking-wider text-center py-1'>Sunday</span>

                <span className='text-primary2/80 text-md uppercase tracking-wider text-center py-1'>10am - 6pm</span>
                <span className='border-r-2 border-primary1'/>
                <span className='text-primary2/80 text-md uppercase tracking-wider text-center py-1'>Closed</span>
                
                <span
                    className='text-primary2 font-bold text-md uppercase tracking-wider text-center py-1 col-span-3 flex justify-center items-center gap-2 pt-2'
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {isOpen ? (
                        <>
                            <PiDoorOpenFill size={24} className='inline text-primary1' aria-hidden="true" focusable="false" />
                            Open Now
                        </>
                    ) : (
                        <>
                            <PiDoorFill size={24} className='inline text-primary1' aria-hidden="true" focusable="false" />
                            Closed Now
                        </> 
                    )   }
                </span>
            </div>
        </>
    )
}

const Contact = (props) => {



    const [currentTime, setCurrentTime] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const currentDayIndex = currentTime.getDay();

    useEffect(() => {
        const currentHour = currentTime.getHours();
        // Hours are set here
        setIsOpen(currentHour >= 10 && currentHour < 18 && currentDayIndex != 0);
    }, [currentTime]);

    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`
    }







    return (
        <>
            <section className="contact" aria-label='Contact Information'>
                <div className="catalog-container75">
                    <ContactLink
                        icon={<PiNavigationArrowFill size={24} />}
                        onClick={handleLocationClick}
                        text-style={{
                            textAlign: 'right',
                            fontSize: '0.96em',
                        }}
                    >320 W King Street<br></br>
                        Martinsburg, West Virginia</ContactLink>
                        <Hours
                            openingTime={10}
                            closingTime={18}
                            openDays= {[
                                1, 2, 3, 4, 5, 6
                            ]}
                        />
                    <ContactLink
                        icon={<PiPhoneFill size={36} />}
                        onClick={handlePhoneClick}
                        text-style={{
                            textAlign: 'left',
                            fontFamily: 'Inter',
                        }}
                    >
                        (304) 264-9130
                    </ContactLink>
                    <ContactLink
                        icon={<PiEnvelopeSimpleFill size={36} />}
                        onClick={handleEmailClick}
                        text-style={{
                            fontSize: '0.75em',
                            textAlign: 'left'
                        }}
                    >
                        kingstreetemporium@gmail.com
                    </ContactLink>

                    
                </div>
            </section>
            <style jsx>
                {`
.contact {
    flex: initial;
    width: 100%;
    height: auto;
    display: flex;
    padding: var(--dl-space-space-halfunit);
                align-items: flex-start;
                flex-direction: column;
                background-color: var(--dl-color-theme-secondary2);
                }
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
.location-container:hover span {
    text-decoration: underline;
}
.phone-container:hover span {
    text-decoration: underline;
}
.email-container:hover span {
    text-decoration: underline;
}
.catalog-container75 {
    gap: var(--dl-space-space-halfunit);
    flex: 0 0 auto;
    width: 100%;
    display: flex;
    padding: var(--dl-space-space-halfunit);
    align-items: flex-start;
    flex-direction: column;
    background-color: #836653;
}
.catalog-container76 {
    gap: var(--dl-space-space-unit);
    width: 100%;
    height: var(--dl-size-size-small);
    display: flex;
    position: relative;
    align-items: center;
    border-color: var(--dl-color-theme-primary1);
    border-style: solid;
    border-width: px;
    border-radius: var(--dl-radius-radius-radius8);
    background-color: var(--dl-color-theme-secondary1);
}
.catalog-container77 {
    flex: 0 0 auto;
    width: var(--dl-size-size-small);
    height: 100%;
    display: flex;
    align-items: center;
    border-radius: var(--dl-radius-radius-radius4);
    justify-content: center;
    background-color: var(--dl-color-theme-primary1);
    border-top-left-radius: var(--dl-radius-radius-radius8);
    border-top-right-radius: 0;
    border-bottom-left-radius: var(--dl-radius-radius-radius8);
    border-bottom-right-radius: 0;
}
.location-container {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    padding-top: var(--dl-space-space-halfunit);
    padding-right: var(--dl-space-space-halfunit);
    padding-bottom: var(--dl-space-space-halfunit);
    justify-content: flex-end;
    cursor: pointer;
}
.catalog-text236 {
    fill: var(--dl-color-theme-primary2);
    color: var(--dl-color-theme-primary2);
    width: auto;
    height: 100%;
    font-size: 15px;
    font-style: normal;
    text-align: right;
    font-weight: 500;
}
.catalog-hours {
    gap: var(--dl-space-space-halfunit);
    flex: 0 0 auto;
    width: 100%;
    display: flex;
    padding: var(--dl-space-space-halfunit);
    align-items: flex-start;
    border-radius: var(--dl-radius-radius-radius8);
    flex-direction: column;
    background-color: var(--dl-color-theme-secondary1);
}
.catalog-container79 {
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    display: grid;
    grid-gap: 2px;
    border-color: var(--dl-color-theme-secondary1);
    border-width: 2px;
    background-color: var(--dl-color-theme-secondary1);
    grid-template-columns: auto auto auto auto auto auto auto;
}
                
                
                
                
                
                
                
.weekday-active-day {
    flex: initial;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}
.weekday-open {
    background-color: var(--dl-color-theme-primary1)
}
.weekday-active-day span {
    fill: var(--dl-color-theme-primary2);
    color: var(--dl-color-theme-primary2);
    font-style: normal;
    font-weight: 700;
}
                
                
                
                
                
                
                
.catalog-container87 {
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    display: flex;
    padding-left: var(--dl-space-space-unit);
    padding-right: var(--dl-space-space-unit);
    justify-content: space-between;
}
.catalog-text248 {
    fill: var(--dl-color-theme-primary2);
    color: var(--dl-color-theme-primary2);
    font-size: 25px;
    font-style: normal;
    font-weight: 700;
}
.catalog-text249 {
    fill: var(--dl-color-theme-primary2);
    color: var(--dl-color-theme-primary2);
    font-size: 25px;
    font-style: normal;
    font-weight: 700;
}
.catalog-text252 {
    fill: var(--dl-color-theme-primary2);
    color: var(--dl-color-theme-primary2);
    font-size: 25px;
    font-style: normal;
    font-weight: 700;
}
.catalog-container88 {
    gap: var(--dl-space-space-halfunit);
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    display: flex;
    align-self: flex-start;
    align-items: flex-start;
    justify-content: flex-start;
}
.catalog-container89 {
    flex: 1;
    width: auto;
    height: 100%;
    display: flex;
    align-items: center;
    border-radius: var(--dl-radius-radius-radius4);
    justify-content: center;
    background-image: linear-gradient(
    270deg,
    rgba(232, 168, 21, 0) 0%,
    rgb(232, 168, 21) 98%
    );
    padding: 5px;
}
.catalog-text253 {
    color: var(--dl-color-theme-primary2);
    font-style: normal;
    font-weight: 700;
}
.catalog-text254 {
    fill: var(--dl-color-theme-primary2);
    color: var(--dl-color-theme-primary2);
    font-size: 25px;
    font-style: normal;
    text-align: center;
    font-weight: 700;
}
.phone-container {
    gap: var(--dl-space-space-unit);
    width: 100%;
    height: var(--dl-size-size-small);
    display: flex;
    position: relative;
    align-items: center;
    border-color: var(--dl-color-theme-primary1);
    border-style: solid;
    border-width: px;
    border-radius: var(--dl-radius-radius-radius8);
    background-color: var(--dl-color-theme-secondary1);
    cursor: pointer;
}
.catalog-container91 {
    flex: 0 0 auto;
    width: var(--dl-size-size-small);
    height: 100%;
    display: flex;
    align-items: center;
    border-radius: var(--dl-radius-radius-radius4);
    justify-content: center;
    background-color: var(--dl-color-theme-primary1);
    border-top-left-radius: var(--dl-radius-radius-radius8);
    border-top-right-radius: 0;
    border-bottom-left-radius: var(--dl-radius-radius-radius8);
    border-bottom-right-radius: 0;
}
.catalog-icon24 {
    width: 75%;
    height: 75%;
}
.catalog-text257 {
    color: var(--dl-color-theme-primary2);
    width: auto;
    font-size: 20px;
    font-style: normal;
    text-align: left;
    font-weight: 500;
}
.email-container {
    gap: var(--dl-space-space-unit);
    width: 100%;
    height: var(--dl-size-size-small);
    display: flex;
    position: relative;
    align-items: center;
    border-color: var(--dl-color-theme-primary1);
    border-style: solid;
    border-width: px;
    border-radius: var(--dl-radius-radius-radius8);
    background-color: var(--dl-color-theme-secondary1);
    cursor: pointer;
}
.catalog-container93 {
    flex: 0 0 auto;
    width: var(--dl-size-size-small);
    height: 100%;
    display: flex;
    align-items: center;
    border-radius: var(--dl-radius-radius-radius4);
    justify-content: center;
    background-color: var(--dl-color-theme-primary1);
    border-top-left-radius: var(--dl-radius-radius-radius8);
    border-top-right-radius: 0;
    border-bottom-left-radius: var(--dl-radius-radius-radius8);
    border-bottom-right-radius: 0;
}
.catalog-icon26 {
    width: 75%;
    height: 75%;
}
.catalog-text258 {
    color: var(--dl-color-theme-primary2);
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
}
                
            `}
            </style>
        </>
    )
}

export default Contact;
