import { RequestContext } from '@context/request';
import { DBTutorialPetPrescriptionEntity } from './entities/tutorial-pet-db.prescription.entity';
import { PrescriptionResultSet, Prescription } from '@feature-tutorial-pet/prescription/prescription.model';
import { DBTutorialPetBaseMapper } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.mapper';
import { DBTutorialPetPetMapper } from '@plugin-tutorial-pet-db/features/pet/tutorial-pet-db.pet.mapper';
import { DBTutorialPetPharmacyMapper } from '@plugin-tutorial-pet-db/features/pharmacy/tutorial-pet-db.pharmacy.mapper';
import { DBTutorialPetVeterinarianMapper } from '@plugin-tutorial-pet-db/features/veterinarian/tutorial-pet-db.veterinarian.mapper';

export class DBTutorialPetPrescriptionMapper extends DBTutorialPetBaseMapper {
    mapPrescriptionResultSet(requestContext: RequestContext, dbPrescriptions: DBTutorialPetPrescriptionEntity[], count: number, limit: number, offset: number): PrescriptionResultSet {
        const mapperId = 'mapPrescriptionResultSet';
        const methodname = `${DBTutorialPetPrescriptionMapper.name}.${mapperId}`;

        return {
            pagination: this.composePagination(limit, offset, count),
            results:
                dbPrescriptions ?
                    dbPrescriptions.map((dbUser) => {
                        return this.mapPrescription(requestContext, dbUser);
                    })
                    : [],
        };
    }

    mapPrescription(requestContext: RequestContext, dbPrescription: DBTutorialPetPrescriptionEntity): Prescription {
        const mapperId = 'mapPrescription';
        const methodname = `${DBTutorialPetPrescriptionMapper.name}.${mapperId}`;

        return dbPrescription ?
            {
                id: `${dbPrescription.id}`,
                identifier: dbPrescription.identifier,
                description: dbPrescription.description,
                prescription: dbPrescription.prescription,
                type: dbPrescription.type,
                status: dbPrescription.status,
                refillCount: dbPrescription.refillCount,
                veterinarian: this.getMapper<DBTutorialPetVeterinarianMapper>(requestContext, DBTutorialPetVeterinarianMapper).mapVeterinarian(requestContext, dbPrescription.veterinarian),
                pet: this.getMapper<DBTutorialPetPetMapper>(requestContext, DBTutorialPetPetMapper).mapPet(requestContext, dbPrescription.pet),
                pharmacy: this.getMapper<DBTutorialPetPharmacyMapper>(requestContext, DBTutorialPetPharmacyMapper).mapPharmacy(requestContext, dbPrescription.pharmacy),
            }
            : null;
    }
}
