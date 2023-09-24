import { createProject } from "../../project"
import { Proposal } from "../models"
import { CreateProposal } from "./create.service"
import { DecideProposal } from "./decide.service"
import { FindProposals } from "./find.service"

export const createProposal = new CreateProposal(Proposal)
export const decideProposal = new DecideProposal(Proposal, createProject)
export const findProposals = new FindProposals(Proposal)
