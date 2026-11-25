import { DBTutorialPetPetEntity } from '@plugin-tutorial-pet-db/features/pet/entities/tutorial-pet-db.pet.entity';
import { DBTutorialPetPharmacyEntity } from '@plugin-tutorial-pet-db/features/pharmacy/entities/tutorial-pet-db.pharmacy.entity';
import { DBTutorialPetVeterinarianEntity } from '@plugin-tutorial-pet-db/features/veterinarian/entities/tutorial-pet-db.veterinarian.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('prescription')
export class DBTutorialPetPrescriptionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'identifier' })
    identifier: string;

    @Column({ name: 'type' })
    type: string;

    @Column({ name: 'prescription' })
    prescription: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'can_edit' })
    canEdit: boolean;

    @Column({ name: 'status' })
    status: string;

    @Column({ name: 'refillcount' })
    refillCount: number;

    @Column({ name: 'veterinarian_identifier' })
    veterinarianIdentifier: string;

    @Column({ name: 'pet_identifier' })
    petIdentifier: string;

    @Column({ name: 'pharmacy_identifier' })
    pharmacyIdentifier: string;

    @OneToOne(() => DBTutorialPetVeterinarianEntity)
    @JoinColumn({ name: 'veterinarian_identifier', referencedColumnName: 'identifier' })
    veterinarian: DBTutorialPetVeterinarianEntity;

    @OneToOne(() => DBTutorialPetPetEntity)
    @JoinColumn({ name: 'pet_identifier', referencedColumnName: 'identifier' })
    pet: DBTutorialPetPetEntity;

    @OneToOne(() => DBTutorialPetPharmacyEntity)
    @JoinColumn({ name: 'pharmacy_identifier', referencedColumnName: 'identifier' })
    pharmacy: DBTutorialPetPharmacyEntity;
}
