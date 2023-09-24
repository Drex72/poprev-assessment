export interface CreateProjectDto {
  name: string
  description: string
  estimated_funding_amount: number
  token_value: number
}

export interface CalculateTokenInCirculationOptions {
  token_value: number
  estimated_funding_amount: number
}
