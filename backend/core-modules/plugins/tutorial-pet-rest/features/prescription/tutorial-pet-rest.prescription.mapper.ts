import { RequestContext } from '@context/request';
import { TutorialPetRestPrescriptionResultSet, TutorialPetRestPrescription } from './schema/tutorial-pet-rest.prescription.schema';
import { TutorialPetRestBaseMapper } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.mapper';
import { PrescriptionResultSet } from '@feature-tutorial-pet/prescription/prescription.model';
import { Prescription } from '@feature-tutorial-pet/prescription/prescription.model';
import { TutorialPetRestVeterinarianMapper } from '@plugin-tutorial-pet-rest/features/veterinarian/tutorial-pet-rest.veterinarian.mapper';
import { TutorialPetRestPetMapper } from '@plugin-tutorial-pet-rest/features/pet/tutorial-pet-rest.pet.mapper';
import { TutorialPetRestPharmacyMapper } from '@plugin-tutorial-pet-rest/features/pharmacy/tutorial-pet-rest.pharmacy.mapper';

export class TutorialPetRestPrescriptionMapper extends TutorialPetRestBaseMapper {
    mapPrescriptionResultSet(requestContext: RequestContext, dsPrescriptionResultSet: TutorialPetRestPrescriptionResultSet): PrescriptionResultSet {
        return dsPrescriptionResultSet ?
            {
                pagination: this.mapPagination(requestContext, dsPrescriptionResultSet.pagination),
                results: dsPrescriptionResultSet.results?.map((dsPrescription) => this.mapPrescription(requestContext, dsPrescription)),
            }
            : null;
    }

    mapPrescription(requestContext: RequestContext, dsPrescription: TutorialPetRestPrescription): Prescription {
        return dsPrescription ?
            {
                id: dsPrescription.id,
                identifier: dsPrescription.identifier,
                type: dsPrescription.type,
                prescription: dsPrescription.prescription,
                description: dsPrescription.description,
                status: dsPrescription.status,
                refillCount: dsPrescription.refillCount,
                veterinarian: this.getVeterinarianMapper(requestContext).mapVeterinarian(requestContext, dsPrescription.veterinarian),
                pharmacy: this.getPharmacyMapper(requestContext).mapPharmacy(requestContext, dsPrescription.pharmacy),
            }
            : null;
    }

    protected getVeterinarianMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestVeterinarianMapper>(requestContext, TutorialPetRestVeterinarianMapper);
    }

    protected getPetMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestPetMapper>(requestContext, TutorialPetRestPetMapper);
    }

    protected getPharmacyMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestPharmacyMapper>(requestContext, TutorialPetRestPharmacyMapper);
    }
}
