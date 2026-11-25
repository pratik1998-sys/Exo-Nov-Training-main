import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class CatalystUserEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ name: 'name', type: 'varchar', length: 255 })
    name?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt?: Date;
}
