import { Pagination } from "@feature/models";
import { BaseMapper } from "@plugin/mapper";


export class DBTutorialPetBaseMapper extends BaseMapper {
    composePagination(limit: number, offset: number, count: number): Pagination {
        let totalPages = count < limit ? 1 : Math.ceil(count / limit);
        let pageNumber = Math.ceil(offset / limit) + 1;

        return {
            page: pageNumber,
            pageSize: limit,
            resultCount: count,
            pageCount: totalPages,
            hasMorePages: pageNumber < totalPages,
        };
    }
}
