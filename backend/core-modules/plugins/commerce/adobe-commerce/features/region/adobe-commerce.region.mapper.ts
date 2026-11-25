import { RequestContext } from "@context/request";
import { Country, CountryResultSet, State, StateResultSet } from "@feature-region";
import { AdobeCommerceBaseMapper } from "@plugin-adobe-commerce/common";
import { AdobeCommerceCountry, AdobeCommerceCountryRegion } from "./schema/adobe-commerce.region.schema";

export class AdobeCommerceRegionMapper extends AdobeCommerceBaseMapper {
    mapCountryResultSet(requestContext: RequestContext, dsCountries: AdobeCommerceCountry[]): CountryResultSet {
        return {
            pagination: {
                page: 1,
                pageSize: dsCountries?.length || 0,
                hasMorePages: false,
                resultCount: dsCountries?.length || 0,
                pageCount: 1,
            },
            results: dsCountries?.map((dsCountry) => this.mapCountry(requestContext, dsCountry)),
        };
    }

    mapStateResultSet(requestContext: RequestContext, dsStates: AdobeCommerceCountryRegion[]): StateResultSet {
        return {
            pagination: {
                page: 1,
                pageSize: dsStates?.length || 0,
                hasMorePages: false,
                resultCount: dsStates?.length || 0,
                pageCount: 1,
            },
            results: dsStates?.map((dsState) => this.mapCountry(requestContext, dsState)),
        };
    }

    mapCountry(requestContext: RequestContext, dsCountry: AdobeCommerceCountry): Country {
        return dsCountry ?
            {
                id: dsCountry.id,
                identifier: dsCountry.id,
                description: dsCountry.full_name_english,
                name: dsCountry.full_name_english,
                code: dsCountry.two_letter_abbreviation,
                states: dsCountry.available_regions ? dsCountry.available_regions.map((dsState) => this.mapState(requestContext, dsState)) : [],
            }
            : {};
    }

    mapState(requestContext: RequestContext, dsState: AdobeCommerceCountryRegion): State {
        return dsState ?
            {
                id: dsState.id,
                identifier: dsState.code,
                description: dsState.name,
                name: dsState.name,
                code: dsState.code,
            }
            : {};
    }
}
