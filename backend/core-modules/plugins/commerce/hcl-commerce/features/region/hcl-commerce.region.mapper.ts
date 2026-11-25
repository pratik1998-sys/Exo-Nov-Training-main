import { RequestContext } from "@context/request";
import { Country, CountryResultSet, State } from "@feature-region";
import { HCLCommerceBaseMapper } from "@plugin-hcl-commerce/common";

export class HCLCommerceRegionMapper extends HCLCommerceBaseMapper {
    mapCountryResultSet(requestContext: RequestContext, dsCountries: any[]): CountryResultSet {
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

    /*
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
    */

    mapCountry(requestContext: RequestContext, dsCountry: any): Country {
        return dsCountry ?
            {
                id: dsCountry.code,
                identifier: dsCountry.code,
                description: dsCountry.displayName,
                name: dsCountry.displayName,
                code: dsCountry.code,
                states: dsCountry.states?.map((dsState) => this.mapState(requestContext, dsState)),
            }
            : {};
    }

    mapState(requestContext: RequestContext, dsState: any): State {
        return dsState ?
            {
                id: dsState.code,
                identifier: dsState.code,
                description: dsState.displayName,
                name: dsState.displayName,
                code: dsState.code,
            }
            : {};
    }
}
