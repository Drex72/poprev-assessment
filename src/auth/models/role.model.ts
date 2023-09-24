import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  UUIDV4,
} from "sequelize"

import { sequelize } from "../../core"

export class Roles extends Model<
  InferAttributes<Roles>,
  InferCreationAttributes<Roles>
> {
  declare role_id: CreationOptional<string>
  declare roleName: string
}

Roles.init(
  {
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    modelName: "roles",
    tableName: "roles",
    sequelize,
    timestamps: true,
    freezeTableName: true,
  },
)

export enum UserRoles {
  USER = "user",
  ADMIN = "admin",
  ARTIST = "artist",
}
