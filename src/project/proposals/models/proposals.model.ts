import {
  ForeignKey,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"
import { sequelize } from "../../../core"
import { ProposalStatus } from "../dto"

export class Proposal extends Model<
  InferAttributes<Proposal>,
  InferCreationAttributes<Proposal>
> {
  declare proposal_id: CreationOptional<string>
  declare name: string
  declare description: string
  declare estimated_funding_amount: number
  declare token_value: number
  declare status: CreationOptional<ProposalStatus>
  declare artist: ForeignKey<string>
  declare created_at?: CreationOptional<Date>
  declare deleted_at?: CreationOptional<Date>
}

Proposal.init(
  {
    proposal_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    token_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("REJECTED", "APPROVED", "PENDING"),
      allowNull: true,
      defaultValue: "PENDING",
    },
    artist: {
      type: DataTypes.UUID,
      // references: {
      //   model: User,
      //   key: "id",
      // },
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "proposals",
    modelName: "proposals",
  },
)
