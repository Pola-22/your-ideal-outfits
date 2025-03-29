import { Table, Column, Model, DataType, AllowNull, ForeignKey, BelongsTo} from 'sequelize-typescript';
import Product from './Product';
import Order from './Order';

@Table({ 
    tableName: 'order_details' 
})

class OrderDetail extends Model {
    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL
    })
    declare quantity: number;

    @ForeignKey(() => Product)
    declare id_product: number;

    @BelongsTo(() => Product)
    declare product: Product

    @ForeignKey(() => Order)
    declare id_order: number;

    @BelongsTo(() => Order)
    declare order: Order
}

export default OrderDetail;