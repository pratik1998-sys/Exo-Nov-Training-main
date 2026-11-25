export interface HCLCommerceState {
    code: string;
    displayName: string;
}

export interface HCLCommerceCountry {
    callingCode: string;
    code: string;
    displayName: string;
    states: HCLCommerceState[];
}

export interface HCLCommerceCountriesStates {
    countries: HCLCommerceCountry[];
    countryCodeStates: any;
}
