import { RequestContext } from "@context/request";
import { Address } from "@feature-address";
import { Money } from "@feature-shared-models";
import { Pagination } from "@feature/models";
import { components } from "./schema/sap-commerce.schema";
import { BaseMapper } from "@plugin/mapper";

export class SAPCommerceBaseMapper extends BaseMapper {
    mapPagination(requestContext: RequestContext, dsResult: any): Pagination {
        return dsResult ?
            {
                page: 1,
                pageCount: 1,
                pageSize: 1,
                resultCount: 1,
                hasMorePages: false,
            }
            : {
                page: 1,
                pageCount: 1,
                pageSize: 1,
                resultCount: 1,
                hasMorePages: false,
            };
    }

    mapMoney(requestContext: RequestContext, value: number, currency: string): Money {
        return {
            value: `${value}`,
            currency,
        };
    }

    mapAddress(requestContext: RequestContext, dsAddress: components['schemas']['Address']): Address {
        const address: Address =
            dsAddress ?
                {
                    id: dsAddress?.id,
                    identifier: dsAddress?.id,
                    isDefault: dsAddress.defaultAddress,
                    firstName: dsAddress.firstName,
                    lastName: dsAddress.lastName,
                    line1: dsAddress.line1,
                    line2: dsAddress.line2,
                    city: dsAddress.town,
                    state: dsAddress.region?.name,
                    postalCode: dsAddress.postalCode,
                    country: dsAddress.country?.isocode,
                    phone: dsAddress.phone,
                }
                : {};

        return address;
    }
}
