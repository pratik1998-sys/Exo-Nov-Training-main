import { RequestContext } from '@context/request';
import { TutorialPetRestPagination, TutorialPetRestThumbnail } from './schema/tutorial-pet-rest.base.schema';
import { BaseMapper } from '@plugin/mapper';
import { Pagination } from '@feature/models';
import { Image } from '@feature-shared-models';

export class TutorialPetRestBaseMapper extends BaseMapper {
    mapPagination(requestContext: RequestContext, dsPagination: TutorialPetRestPagination): Pagination {
        return dsPagination ?
            {
                page: dsPagination.page,
                pageSize: dsPagination.pageSize,
                pageCount: dsPagination.pageCount,
                hasMorePages: dsPagination.hasMorePages,
                resultCount: dsPagination.resultCount,
            }
            : null;
    }

    mapThumbnail(requestContext: RequestContext, dsThumbnail: TutorialPetRestThumbnail): Image {
        return dsThumbnail ?
            {
                url: dsThumbnail.url,
            }
            : null;
    }
}
