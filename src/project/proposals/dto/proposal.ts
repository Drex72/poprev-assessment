export interface CreateProposalDto {
  name: string
  description: string
  estimated_funding_amount: number
  token_value: number
}

export interface DecideProposalDto {
  proposal_id: string
  proposal_status: "ACCEPT" | "REJECT"
}

export type ProposalStatus = "REJECTED" | "PENDING" | "APPROVED"
