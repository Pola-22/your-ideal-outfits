import { Table, Column, Model, DataType, AllowNull, Unique} from 'sequelize-typescript';

@Table({ 
    tableName: 'users' 
})

class User extends Model {
    @AllowNull(false)
    @Unique(true)
    @Column({
        type: DataType.STRING(100)
    })
    declare email: string;

    @AllowNull(false)
    @Unique(true)
    @Column({
        type: DataType.STRING
    })
    declare password: string;
}

export default User;