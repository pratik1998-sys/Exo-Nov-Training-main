import { RequestContext } from "@context/request";
import { BaseMapper } from "@plugin/mapper";
import { AdobeCommerceSearchResultPageInfo } from "@plugin-adobe-commerce/common";
import { Pagination } from "@feature/models";
import { Address } from "@feature-address";

export class AdobeCommerceBaseMapper extends BaseMapper {
    mapPagination(requestContext: RequestContext, dsPagination: AdobeCommerceSearchResultPageInfo, totalCount: number): Pagination {
        return {
            page: dsPagination?.current_page ?? 0,
            pageSize: dsPagination?.page_size ?? 0,
            pageCount: dsPagination?.total_pages ?? 0,
            resultCount: totalCount ?? 0,
            hasMorePages: dsPagination ? dsPagination.current_page < dsPagination.total_pages : false,
        };
    }

    mapAddress(requestContext: RequestContext, dsAddress: any): Address {
        const address: Address =
            dsAddress ?
                {
                    id: dsAddress?.id,
                    firstName: dsAddress.firstname,
                    lastName: dsAddress.lastname,
                    city: dsAddress.city,
                    state: dsAddress.region?.code || dsAddress.region?.region_code,
                    postalCode: dsAddress.postcode,
                    country: dsAddress.country?.code || dsAddress.country_code,
                    phone: dsAddress.telephone,
                    line1: dsAddress.street?.length > 0 ? dsAddress.street[0] : null,
                    line2: dsAddress.street?.length > 1 ? dsAddress.street[1] : null,
                    line3: dsAddress.street?.length > 2 ? dsAddress.street[2] : null,
                }
                : {};

        return address;
    }
}
