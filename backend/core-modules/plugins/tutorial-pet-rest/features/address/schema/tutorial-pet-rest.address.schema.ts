import { TutorialPetRestResultSet } from "@plugin-tutorial-pet-rest/common/schema/tutorial-pet-rest.base.schema";

export interface TutorialPetRestAddressBodyBase { }

export interface TutorialPetRestAddressBodyCreate extends TutorialPetRestAddressBodyBase { }
export interface TutorialPetRestAddressBodyUpdate extends TutorialPetRestAddressBodyBase { }

export interface TutorialPetRestAddress { }

export interface TutorialPetRestAddressResultSet extends TutorialPetRestResultSet {
    results?: TutorialPetRestAddress[];
}
