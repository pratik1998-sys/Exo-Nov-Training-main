import { TutorialPetRestQuery, TutorialPetRestResultSet } from "@plugin-tutorial-pet-rest/common/schema/tutorial-pet-rest.base.schema";
import { TutorialPetRestAddressBodyCreate } from "@plugin-tutorial-pet-rest/features/address/schema/tutorial-pet-rest.address.schema";
import { TutorialPetRestPet } from "@plugin-tutorial-pet-rest/features/pet/schema/tutorial-pet-rest.pet.schema";
import { TutorialPetRestPharmacy } from "@plugin-tutorial-pet-rest/features/pharmacy/schema/tutorial-pet-rest.pharmacy.schema";
import { TutorialPetRestVeterinarian } from "@plugin-tutorial-pet-rest/features/veterinarian/schema/tutorial-pet-rest.veterinarian.schema";


export interface TutorialPetRestPrescriptionBodyBase {
    veterinarianIdentifier: string;
    petIdentifier: string;
    pharmacyIdentifier: string;
    prescription: string;
    description: string;
    status: string;
    refillCount: number;
}

export interface TutorialPetRestPrescriptionBodyCreate extends TutorialPetRestPrescriptionBodyBase {
    address: TutorialPetRestAddressBodyCreate;
}

export interface TutorialPetRestPrescriptionBodyUpdate extends TutorialPetRestPrescriptionBodyBase { }

export interface TutorialPetRestPrescription {
    id: string;
    identifier: string;
    description: string;
    prescription: string;
    type: string;
    status: string;
    refillCount: number;
    veterinarian: TutorialPetRestVeterinarian;
    pharmacy: TutorialPetRestPharmacy;
    pet: TutorialPetRestPet;
}

export interface TutorialPetRestPrescriptionQuery extends TutorialPetRestQuery { }

export interface TutorialPetRestPrescriptionResultSet extends TutorialPetRestResultSet {
    results?: TutorialPetRestPrescription[];
}
