import { Projects } from "../../project"
import { ProjectToken, TokenTransactions } from "../models"
import { CreateProjectToken } from "./create_project_token.service"
import { CreateTokenTransaction } from "./create_token_transaction.service"
import { GetTokenTransaction } from "./get_token_transactions.service"
import { TransactToken } from "./transact_project_token.service"

export const createProjectToken = new CreateProjectToken(ProjectToken)
export const createTokenTransaction = new CreateTokenTransaction(
  ProjectToken,
  TokenTransactions,
)
export const getTokenTransaction = new GetTokenTransaction(TokenTransactions)
export const transactToken = new TransactToken(
  ProjectToken,
  Projects,
  createTokenTransaction,
)
