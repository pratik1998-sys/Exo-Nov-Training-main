import { RequestContext } from "@context/request";
import { Pet } from "@feature-tutorial-pet/pet";
import { TutorialPetRestPet, TutorialPetRestPetMapper } from "@plugin-tutorial-pet-rest/features/pet";

export class ExtTutorialPetRestPetMapper extends TutorialPetRestPetMapper {
    mapPet(requestContext: RequestContext, dsPet: TutorialPetRestPet): Pet {
        const methodname = `${ExtTutorialPetRestPetMapper.name}.mapPet`;

        this.logger.info(`${methodname} - In Extension`);

        return super.mapPet(requestContext, dsPet);
    }
}
