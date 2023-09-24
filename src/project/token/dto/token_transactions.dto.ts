export type TokenTransactionsType = "BUY" | "SELL"

export interface CreateTokenTransactionDTO {
  token_id: string
  txn_reference: string
  token_amount: number
  token_amount_value: number
  transaction_type: TokenTransactionsType
  made_by: string
}
