import { TutorialPetRestThumbnail, TutorialPetRestQuery, TutorialPetRestResultSet } from "@plugin-tutorial-pet-rest/common/schema/tutorial-pet-rest.base.schema";
import { TutorialPetRestAddressBodyBase, TutorialPetRestAddressBodyCreate, TutorialPetRestAddress } from "@plugin-tutorial-pet-rest/features/address/schema/tutorial-pet-rest.address.schema";

export interface TutorialPetRestVeterinarianBodyBase {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    thumbnail: string;
    address: TutorialPetRestAddressBodyBase;
}

export interface TutorialPetRestVeterinarianBodyCreate extends TutorialPetRestVeterinarianBodyBase {
    address: TutorialPetRestAddressBodyCreate;
}

export interface TutorialPetRestVeterinarianBodyUpdate extends TutorialPetRestVeterinarianBodyBase { }

export interface TutorialPetRestVeterinarian {
    id: string;
    identifier: string;
    type: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    thumbnail: TutorialPetRestThumbnail;
    address: TutorialPetRestAddress;
}

export interface TutorialPetRestVeterinarianQuery extends TutorialPetRestQuery {
    identifiers?: string[];
    userIdentifier?: string;
}
export interface TutorialPetRestVeterinarianResultSet extends TutorialPetRestResultSet {
    results?: TutorialPetRestVeterinarian[];
}
