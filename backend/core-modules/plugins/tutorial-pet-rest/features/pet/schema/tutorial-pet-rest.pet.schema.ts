import { TutorialPetRestQuery, TutorialPetRestResultSet, TutorialPetRestThumbnail } from '@plugin-tutorial-pet-rest/common/schema/tutorial-pet-rest.base.schema';

export interface TutorialPetRestPetBodyBase {
    firstName: string;
    middleName: string;
    lastName: string;
    breed: string;
    height: string;
    weight: string;
    thumbnail: string;
}

export interface TutorialPetRestPetBodyCreate extends TutorialPetRestPetBodyBase { }
export interface TutorialPetRestPetBodyUpdate extends TutorialPetRestPetBodyBase { }

export interface TutorialPetRestPet {
    id: string;
    identifier: string;
    type: string;
    firstName: string;
    middleName: string;
    lastName: string;
    breed: string;
    height: string;
    weight: string;
    thumbnail: TutorialPetRestThumbnail;
}

export interface TutorialPetRestPetQuery extends TutorialPetRestQuery {
    identifiers?: string[];
    userIdentifier?: string;
}
export interface TutorialPetRestPetResultSet extends TutorialPetRestResultSet {
    results?: TutorialPetRestPet[];
}
