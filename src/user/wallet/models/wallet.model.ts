import {
  ForeignKey,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import { sequelize } from "../../../core"
import { Users } from "../../../auth/models"

export class Wallet extends Model<
  InferAttributes<Wallet>,
  InferCreationAttributes<Wallet>
> {
  declare wallet_id: CreationOptional<string>
  declare wallet_owner_id: ForeignKey<string>
  declare created_at?: CreationOptional<Date>
  declare deleted_at?: CreationOptional<Date>
}

Wallet.init(
  {
    wallet_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    wallet_owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },

    
  },
  {
    sequelize,
    timestamps: true,
    tableName: "wallets",
    modelName: "wallets",
  },
)
