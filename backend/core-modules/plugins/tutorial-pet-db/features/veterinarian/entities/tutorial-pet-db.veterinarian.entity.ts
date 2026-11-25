import { DBTutorialPetAddressEntity } from '@plugin-tutorial-pet-db/features/address/entities/tutorial-pet-db.address.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('veterinarian')
export class DBTutorialPetVeterinarianEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'identifier' })
    identifier: string;

    @Column({ name: 'type' })
    type: string;

    @Column({ name: 'can_edit' })
    canEdit: boolean;

    @Column({ name: 'firstname' })
    firstName: string;

    @Column({ name: 'middlename' })
    middleName: string;

    @Column({ name: 'lastname' })
    lastName: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'phone' })
    phone: string;

    @Column({ name: 'thumbnail' })
    thumbnail: string;

    @Column({ name: 'address_identifier' })
    addressIdentifier: string;

    @OneToOne(() => DBTutorialPetAddressEntity)
    @JoinColumn({ name: 'address_identifier', referencedColumnName: 'identifier' })
    address: DBTutorialPetAddressEntity;
}
