import { Router } from "express"
import { controllerHandler } from "../../../core"
import { createProposal, decideProposal, findProposals } from "../../proposals"
import { createProject, findProjects } from "../services"
import {
  createProjectSchema,
  createProposalSchema,
  decideProposalSchema,
} from "./schema"
import { getTokenTransaction } from "../../token"

export const projectRouter = Router()

projectRouter
  .get(
    "/project-proposals",
    controllerHandler.handle(
      findProposals.get_all,
      {},
      {
        isPrivate: true,
        allowedRoles: ["ADMIN"],
      },
    ),
  )
  .get(
    "/artist-project-proposals",
    controllerHandler.handle(
      findProposals.get_by_artists,
      {},
      {
        isPrivate: true,
        allowedRoles: ["ARTIST"],
      },
    ),
  )
  .post(
    "/project-proposals",
    controllerHandler.handle(createProposal.create, createProposalSchema, {
      isPrivate: true,
      allowedRoles: ["ARTIST"],
    }),
  )
  .post(
    "/project-proposal-decision",
    controllerHandler.handle(decideProposal.decide, decideProposalSchema, {
      isPrivate: true,
      allowedRoles: ["ADMIN"],
    }),
  )

projectRouter
  .post(
    "/",
    controllerHandler.handle(createProject.create, createProjectSchema, {
      isPrivate: true,
      allowedRoles: ["ADMIN"],
    }),
  )
  .get(
    "/",
    controllerHandler.handle(
      findProjects.find_active_projects,
      {},
      {
        isPrivate: true,
      },
    ),
  )
  .get(
    "/token-transactions",
    controllerHandler.handle(
      getTokenTransaction.getTokenTransactions,
      {},
      { isPrivate: true, allowedRoles: ["ADMIN"] },
    ),
  )
