import { RequestContext } from '@context/request';
import { TutorialPetRestAddress } from './schema/tutorial-pet-rest.address.schema';
import { TutorialPetRestBaseMapper } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.mapper';
import { Address } from '@feature-address';

export class TutorialPetRestAddressMapper extends TutorialPetRestBaseMapper {
    mapAddress(requestContext: RequestContext, dsAddress: TutorialPetRestAddress): Address {
        return {};
    }
}
