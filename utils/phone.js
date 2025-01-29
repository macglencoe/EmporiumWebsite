/**
 * Initiates a phone dial to the specified phone number.
 * This function formats the phone number to remove non-digit characters 
 * and redirects the browser to a 'tel' URL to dial a call.
 */

export const handlePhoneClick = () => {
    let phoneNumber = "3042649130"
    const telUrl = `tel:${phoneNumber.replace(/\D/g, '')}`; // Remove non-digits
    window.location.href = telUrl; // Use window.location.href for direct call
};