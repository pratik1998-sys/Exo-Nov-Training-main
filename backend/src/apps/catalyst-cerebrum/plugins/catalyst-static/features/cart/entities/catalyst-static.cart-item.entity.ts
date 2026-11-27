import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * One line of a cart. `productIdentifier` is public.product.identifier; the price is read from the
 * product table when the cart is loaded, so it is not stored here.
 */
@Entity({ name: 'cart_item', schema: 'public' })
export class CatalystStaticCartItemEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ name: 'cart_id', type: 'int' })
    cartId?: number;

    @Column({ name: 'product_identifier', type: 'varchar', length: 64 })
    productIdentifier?: string;

    @Column({ name: 'quantity', type: 'int' })
    quantity?: number;
}
