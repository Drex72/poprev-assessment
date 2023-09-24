import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  UUIDV4,
  ForeignKey,
} from "sequelize"
import { sequelize } from "../../core"
import { Roles } from "./role.model"

export class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  declare id: CreationOptional<string>
  declare firstName: string
  declare lastName: string
  declare roleId: ForeignKey<string>
  declare password: string
  declare phoneNumber: string
  declare email: string
  declare refreshToken: CreationOptional<string>
  declare refreshTokenExp: CreationOptional<Date>
  declare isActive: CreationOptional<boolean>
}

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    refreshToken: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    refreshTokenExp: {
      type: DataTypes.DATE,

      allowNull: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,

      references: {
        model: Roles,
        key: "role_id",
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["password", "refreshToken", "refreshTokenExp"],
      },
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ["password"],
        },
      },
      withRefreshToken: {
        attributes: {
          include: ["refreshToken", "refreshTokenExp"],
        },
      },
    },
    modelName: "users",
    tableName: "users",
    sequelize,
    timestamps: true,
    freezeTableName: true,
  },
)
