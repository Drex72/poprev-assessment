import { TokenTransactionsType } from "./token_transactions.dto"

export interface CreateProjectTokenDto {
  token_name: string
  token_value: number
  token_in_circulation: number
}

export interface ProjectTransactionDto {
  project_id: string
  user_id: string
  amount: number
  transactionType: TokenTransactionsType
}
