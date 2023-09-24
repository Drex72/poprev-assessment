import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import { sequelize } from "../../../core"
import { Users } from "../../../auth/models"
import { ProjectToken } from "./token.model"
import { TokenTransactionsType } from "../dto"

export class TokenTransactions extends Model<
  InferAttributes<TokenTransactions>,
  InferCreationAttributes<TokenTransactions>
> {
  declare transaction_id: CreationOptional<string>
  declare token_id: ForeignKey<string>
  declare txn_reference: string
  declare token_amount: number
  declare token_amount_value: number
  declare transaction_type: TokenTransactionsType
  declare made_by: ForeignKey<string>
  declare created_at?: CreationOptional<Date>
  declare deleted_at?: CreationOptional<Date>
}

TokenTransactions.init(
  {
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    token_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ProjectToken,
        key: "token_id",
      },
    },
    transaction_type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["BUY", "SELL"],
    },

    txn_reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    token_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    token_amount_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    made_by: {
      type: DataTypes.UUID,
      references: {
        model: Users,
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "token_transactions",
    modelName: "token_transactions",
  },
)
