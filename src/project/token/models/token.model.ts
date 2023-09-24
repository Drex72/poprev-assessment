import {
  ForeignKey,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import { sequelize } from "../../../core"

export class ProjectToken extends Model<
  InferAttributes<ProjectToken>,
  InferCreationAttributes<ProjectToken>
> {
  declare token_id: CreationOptional<string>
  declare token_name: string
  declare token_value: number
  declare token_in_circulation: number
  declare created_at?: CreationOptional<Date>
  declare deleted_at?: CreationOptional<Date>
}

ProjectToken.init(
  {
    token_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    token_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    token_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    token_in_circulation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "project_token",
    modelName: "project_token",
  },
)
