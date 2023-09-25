import { Router } from "express"
import { createProposal, decideProposal, findProposals } from "../../proposals"
import { createProject, findProjects } from "../services"
import {
  createProjectSchema,
  createProposalSchema,
  decideProposalSchema,
} from "./schema"
import { getTokenTransaction } from "../../token"
import { ControlBuilder } from "../../../core/middlewares/controlBuilder"

export const projectRouter = Router()

projectRouter
  .get(
    "/project-proposals",
    ControlBuilder.builder()
      .setHandler(findProposals.get_all)
      .isPrivate()
      .only("ADMIN")
      .handle(),
  )

  .get(
    "/pending-project-proposals",
    ControlBuilder.builder()
      .setHandler(findProposals.get_pending)
      .isPrivate()
      .only("ADMIN")
      .handle(),
  )
  .get(
    "/artist-project-proposals",
    ControlBuilder.builder()
      .setHandler(findProposals.get_by_artists)
      .isPrivate()
      .only("ARTIST")
      .handle(),
  )

  .post(
    "/project-proposals",
    ControlBuilder.builder()

      .setHandler(createProposal.create)
      .setValidator(createProposalSchema)
      .isPrivate()
      .only("ARTIST")
      .handle(),
  )

  .post(
    "/project-proposal-decision",
    ControlBuilder.builder()

      .setHandler(decideProposal.decide)
      .setValidator(decideProposalSchema)
      .isPrivate()
      .only("ADMIN")
      .handle(),
  )

projectRouter

  .post(
    "/",
    ControlBuilder.builder()

      .setHandler(createProject.create)
      .setValidator(createProjectSchema)
      .isPrivate()
      .only("ADMIN")
      .handle(),
  )

  .get(
    "/",
    ControlBuilder.builder()
      .setHandler(findProjects.find_active_projects)
      .isPrivate()
      .handle(),
  )

  .get(
    "/",
    ControlBuilder.builder()
      .setHandler(getTokenTransaction.getTokenTransactions)
      .isPrivate()
      .only("ADMIN")
      .handle(),
  )
