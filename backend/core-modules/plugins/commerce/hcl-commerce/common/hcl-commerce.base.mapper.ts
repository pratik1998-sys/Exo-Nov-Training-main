import { RequestContext } from "@context/request";
import { Money } from "@feature-shared-models";
import { Pagination } from "@feature/models";
import { BaseMapper } from "@plugin/mapper";

export class HCLCommerceBaseMapper extends BaseMapper {
    mapPagination(requestContext: RequestContext, dsResultSet: any): Pagination {
        const recordSetStartNumber = parseInt(dsResultSet?.recordSetStartNumber ?? '0');
        const recordSetCount = parseInt(dsResultSet?.recordSetCount ?? '0');
        const recordSetTotal = parseInt(dsResultSet?.recordSetTotal ?? '0');

        const page =
            recordSetCount > 0 ?
                recordSetStartNumber == 0 ?
                    1
                    : Math.floor(recordSetStartNumber / recordSetCount) + 1
                : 1;
        const pageSize = recordSetCount;
        const pageCount = recordSetCount > 0 ? Math.ceil(recordSetTotal / recordSetCount) : 1;
        const resultCount = recordSetTotal ?? 0;

        const pagination: Pagination = {
            page,
            pageSize,
            pageCount,
            resultCount,
            hasMorePages: page < pageCount,
        };

        return pagination;
    }

    mapMoney(requestContext: RequestContext, dsMoney: any): Money {
        return dsMoney ?
            {
                currency: dsMoney.currency,
                value: dsMoney.value,
            }
            : {};
    }
}
