import { Table, Column, Model, DataType, AllowNull, HasMany, Default} from 'sequelize-typescript';
import OrderDetail from './OrderDetail';

@Table({ 
    tableName: 'products' 
})

class Product extends Model {
    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(500)
    })
    declare description: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(500)
    })
    declare img: string;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL
    })
    declare price: number;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL
    })
    declare stock: number;

    @AllowNull(false)
    @Default(true)
    @Column({
        type: DataType.BOOLEAN
    })
    declare isActive: boolean;

    @HasMany(() => OrderDetail)
    declare orderDetail: OrderDetail[]
}

export default Product;