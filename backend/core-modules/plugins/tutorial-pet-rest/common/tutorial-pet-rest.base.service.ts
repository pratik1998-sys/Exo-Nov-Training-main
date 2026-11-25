
import { RequestContext } from '@context/request';
import { TutorialPetRestQuery } from './schema/tutorial-pet-rest.base.schema';
import { BaseDatasourcePluginServiceImpl } from '@plugin/service';
import { PaginationInput, SortByInput } from '@feature/models';

export class TutorialPetRestBaseServiceImpl extends BaseDatasourcePluginServiceImpl {
    protected composeQuery(requestContext: RequestContext, pagination: PaginationInput, sort: SortByInput): TutorialPetRestQuery {
        return {
            page: pagination?.page,
            pageSize: pagination?.pageSize,
        };
    }
}
