import { Table, Column, Model, DataType, AllowNull, HasMany} from 'sequelize-typescript';
import OrderDetail from './OrderDetail';

@Table({ 
    tableName: 'orders' 
})

class Order extends Model {
    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare client_name: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(10)
    })
    declare document_number: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(10)
    })
    declare number_phone: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(500)
    })
    declare address: string;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL
    })
    declare total: number;

    @HasMany(() => OrderDetail, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare orderDetail: OrderDetail[]
}

export default Order;