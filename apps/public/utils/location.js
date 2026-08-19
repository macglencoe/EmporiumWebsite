import { track } from "@vercel/analytics";

/**
 * Opens a link to the King Street Emporium location in the user's preferred maps app.
 * This function is used in the Contact and Product Call/Visit Buttons components.
 *
 * The location is hardcoded to 320 W King Street, Martinsburg, West Virginia.
 */
export const handleLocationClick = () => {
    let address = "320 W King Street";
    let city = "Martinsburg";
    let state = "West Virginia";
    const encodedAddress = encodeURIComponent(`${address}, ${city}, ${state}`);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let mapUrl;
    if (isMobile) {
        // Use platform-specific maps app links
        if (navigator.userAgent.match(/Android/i)) {
            mapUrl = `geo:0,0?q=${encodedAddress}`; // Android
        } else if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i)) {
            mapUrl = `http://maps.apple.com/?q=${encodedAddress}`; // iOS
        } else {
            mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
        }
    } else {
        mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }

    track("Location");

    window.open(mapUrl, '_blank', 'noopener,noreferrer');
};