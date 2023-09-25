import {
  ForeignKey,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import { sequelize } from "../../../core"
import { Wallet } from "./wallet.model"
import { ProjectToken } from "../../../project/token"

export class WalletToken extends Model<
  InferAttributes<WalletToken>,
  InferCreationAttributes<WalletToken>
> {
  declare wallet_information_id: CreationOptional<string>
  declare wallet_id: ForeignKey<string>
  declare token_owned_amount: number
  declare token_id: ForeignKey<string>
  declare created_at?: CreationOptional<Date>
  declare deleted_at?: CreationOptional<Date>
}

WalletToken.init(
  {
    wallet_information_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    wallet_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Wallet,
        key: "wallet_id",
      },
    },
    token_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ProjectToken,
        key: "token_id",
      },
    },

    token_owned_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "wallet_tokens",
    modelName: "wallet_tokens",
  },
)
