import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * A shopping cart. `identifier` is the public cart id handed to API clients (Cart.id).
 * Registered on the plugin's primary database connection (no @PluginDatabaseConnection needed).
 */
@Entity({ name: 'cart', schema: 'public' })
export class CatalystStaticCartEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ name: 'identifier', type: 'varchar', length: 64, unique: true })
    identifier?: string;

    @Column({ name: 'created_on', type: 'timestamptz', default: () => 'now()' })
    createdOn?: Date;

    @Column({ name: 'updated_on', type: 'timestamptz', default: () => 'now()' })
    updatedOn?: Date;
}
