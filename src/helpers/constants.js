// SUBCODE
export const PROFILE_UPDATE_OTP_MESSAGE_SUBCODE = 1000;
export const RELOGIN_SUBCODE = 1000;

// PRICE CONVERTS
export const centsToDollars = (cents) => {
    return cents / 100;
}

export const dollarsToCents = (dollars) => {
    return Math.round(dollars * 100);
}