import { TutorialPetRestQuery, TutorialPetRestResultSet } from "@plugin-tutorial-pet-rest/common/schema/tutorial-pet-rest.base.schema";
import { TutorialPetRestAddressBodyBase, TutorialPetRestAddressBodyCreate, TutorialPetRestAddress } from "@plugin-tutorial-pet-rest/features/address/schema/tutorial-pet-rest.address.schema";

export interface TutorialPetRestPharmacyBodyBase {
    name: string;
    description: string;
    email: string;
    phone: string;
    address: TutorialPetRestAddressBodyBase;
}

export interface TutorialPetRestPharmacyBodyCreate extends TutorialPetRestPharmacyBodyBase {
    address: TutorialPetRestAddressBodyCreate;
}

export interface TutorialPetRestPharmacyBodyUpdate extends TutorialPetRestPharmacyBodyBase { }

export interface TutorialPetRestPharmacy {
    id: string;
    identifier: string;
    type: string;
    name: string;
    description: string;
    email: string;
    phone: string;
    address: TutorialPetRestAddress;
}

export interface TutorialPetRestPharmacyQuery extends TutorialPetRestQuery { }

export interface TutorialPetRestPharmacyResultSet extends TutorialPetRestResultSet {
    results?: TutorialPetRestPharmacy[];
}
