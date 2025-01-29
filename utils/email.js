
/**
 * Opens the user's default email client with a new email
 * addressed to the King Street Emporium email address.
 */

export const handleEmailClick = () => {
    let emailAddress = "kingstreetemporium@gmail.com"
    const mailtoUrl = `mailto:${emailAddress}`;
    window.location.href = mailtoUrl;
};