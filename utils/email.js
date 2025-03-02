
/**
 * Opens the user's default email client with a new email
 * addressed to the King Street Emporium email address.
 */

import { track } from "@vercel/analytics";

export const handleEmailClick = () => {
    let emailAddress = "kingstreetemporium@gmail.com"
    const mailtoUrl = `mailto:${emailAddress}`;

    track("Email");
    window.location.href = mailtoUrl;
};