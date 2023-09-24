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
import { ProjectToken } from "../../token"

export class Projects extends Model<
  InferAttributes<Projects>,
  InferCreationAttributes<Projects>
> {
  declare project_id: CreationOptional<string>
  declare project_token_id: ForeignKey<string>
  declare name: string
  declare description: string
  declare estimated_funding_amount: number
  declare amount_contributed: number
  declare artist: ForeignKey<string>
  declare still_accepts_contribution: CreationOptional<boolean>
  declare created_at?: CreationOptional<Date>
  declare deleted_at?: CreationOptional<Date>
}

Projects.init(
  {
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    project_token_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ProjectToken,
        key: "token_id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 100,
      },
    },
    estimated_funding_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount_contributed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    artist: {
      type: DataTypes.UUID,
      references: {
        model: Users,
        key: "id",
      },
    },
    still_accepts_contribution: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "projects",
    modelName: "projects",
  },
)
