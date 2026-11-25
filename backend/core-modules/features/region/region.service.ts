import { RequestContext } from "@context/request";
import { Country, CountryResultSet, State, StateResultSet } from "@feature-region";
import { PaginationInput } from "@feature/models";
import { BaseFeatureService } from "@feature/service";


export abstract class RegionService extends BaseFeatureService {
    abstract getCountries(pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<CountryResultSet>;
    abstract getCountry(identifier: string, requestContext: RequestContext, context?: any): Promise<Country>;
    abstract getCountryStates(countryIdentifier: string, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<StateResultSet>;
    abstract getCountryState(countryIdentifier: string, stateIdentifier: string, requestContext: RequestContext, context?: any): Promise<State>;
}
