import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DBTutorialPetAddressEntity } from '@plugin-tutorial-pet-db/features/address/entities/tutorial-pet-db.address.entity';

@Entity('pharmacy')
export class DBTutorialPetPharmacyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'identifier' })
    identifier: string;

    @Column({ name: 'type' })
    type: string;

    @Column({ name: 'can_edit' })
    canEdit: boolean;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'phone' })
    phone: string;

    @Column({ name: 'address_identifier' })
    addressIdentifier: string;

    @OneToOne(() => DBTutorialPetAddressEntity)
    @JoinColumn({ name: 'address_identifier', referencedColumnName: 'identifier' })
    address: DBTutorialPetAddressEntity;
}
