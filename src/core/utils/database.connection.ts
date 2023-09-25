import { Roles, UserRoles, Users } from "../../auth/models"
import { Projects } from "../../project"
import { Proposal } from "../../project/proposals"
import { ProjectToken, TokenTransactions } from "../../project/token"
import { Wallet } from "../../user/wallet/models/wallet.model"
import { WalletToken } from "../../user/wallet/models/wallet_token"
import { sequelize } from "../config"
import { logger } from "../logging"

export const initializeDbConnection = async () => {
  await sequelize.authenticate()
  logger.info("Connection has been established successfully.")

  await sequelize.sync()
  logger.info("All models were synchronized successfully.")

  await handleSeedDatabase()
  logger.info("Seeding Completed Successfully")

  await handleSetAssociations()
  logger.info("Associations Set Successfully")
}

const handleSeedDatabase = async () => {
  const allRoles = await Roles.findAll()

  if (allRoles.length === 0) {
    const initialRoles = [
      { roleName: UserRoles.ADMIN },
      { roleName: UserRoles.USER },
      { roleName: UserRoles.ARTIST },
    ]

    await Roles.bulkCreate(initialRoles)
  }
}

const handleSetAssociations = async () => {
  Users.belongsTo(Roles, {
    foreignKey: "roleId",
    as: "role",
  })

  // Project to Project Token Association
  Projects.belongsTo(ProjectToken, {
    foreignKey: "project_token_id",
    as: "projectToken",
  })

  // Project to User (Artist) Association
  Projects.belongsTo(Users, {
    foreignKey: "artist",
    as: "artistInfo",
  })

  // Token Transaction to Project Token Association
  TokenTransactions.belongsTo(ProjectToken, {
    foreignKey: "token_id",
    as: "projectToken",
  })

  // Token Transaction to User (Made By) Association
  TokenTransactions.belongsTo(Users, {
    foreignKey: "made_by",
    as: "madeBy",
  })

  // Proposal to User (Artist) Association
  Proposal.belongsTo(Users, {
    foreignKey: "artist",
    as: "artistInfo",
  })

  // Wallet to User (Wallet Owner) Association
  Wallet.belongsTo(Users, {
    foreignKey: "wallet_owner_id",
    as: "walletOwner",
  })

  // Wallet Token to Wallet Association
  WalletToken.belongsTo(Wallet, {
    foreignKey: "wallet_id",
    as: "walletToken",
  })

  // Wallet Information to Project Token Association
  WalletToken.belongsTo(ProjectToken, {
    foreignKey: "token_id",
    as: "projectToken",
  })
}
