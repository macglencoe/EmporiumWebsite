import React, { Fragment } from 'react'
import {useState, useEffect} from 'react'

import PropTypes from 'prop-types'
import { handleLocationClick } from '../utils/location'
import { handlePhoneClick } from '../utils/phone'
import { handleEmailClick } from '../utils/email'

const Contact = (props) => {

    // Hours 

    const [currentTime, setCurrentTime] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const days = ['S','M','T','W','T','F','S'];
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
        hours = hours ? hours: 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`
    }

    

      



    return (
        <>
            <div className="contact">
                <div className="catalog-container75">
                    <div className="catalog-container76">
                        <div className="catalog-container77">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="catalog-icon22"
                            >
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </div>
                        <div className="location-container" onClick={handleLocationClick} tabIndex={0}>
                            <span className="catalog-text236" >
                                <span>320 W King Street</span>
                                <br></br>
                                <span>Martinsburg, West Virginia</span>
                                <br></br>
                            </span>
                        </div>
                    </div>
                    <div className="catalog-hours">
                        <div className="catalog-container79 weekday-container">
                            {days.map((day, index) => (
                                <div key={index} className={
                                    `weekday${index === currentDayIndex ? '-active-day' : ''}`+' '+
                                    `weekday${index >= 1 ? '-open' : ''}`
                                    /* This is where open days are set */}>
                                    <span>{day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="catalog-container87">
                            <span className="catalog-text248">10AM</span>
                            <span className="catalog-text249">
                                <span>-</span>
                                <br></br>
                            </span>
                            <span className="catalog-text252">6PM</span>
                        </div>
                        <div className="catalog-container88">
                            <div className="catalog-container89">
                                <span className="catalog-text253">{isOpen ? "Open Now" : "Closed"}</span>
                            </div>
                            <span className="catalog-text254">
                                <span>{formatTime(currentTime)}</span>
                                <br></br>
                            </span>
                        </div>
                    </div>
                    <div className="phone-container" onClick={handlePhoneClick} tabIndex={0}>
                        <div className="catalog-container91">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="catalog-icon24"
                            >
                                <path
                                    d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.98.98 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02c-.37-1.11-.56-2.3-.56-3.53c0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </div>
                        <span className="catalog-text257">(304) 264-9130</span>
                    </div>
                    <div className="email-container" onClick={handleEmailClick} tabIndex={0}>
                        <div className="catalog-container93">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="catalog-icon26"
                            >
                                <path
                                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </div>
                        <span className="catalog-text258">
                            kingstreetemporium@gmail.com
                        </span>
                    </div>
                </div>
            </div>
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