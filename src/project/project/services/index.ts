import { createProjectToken } from "../../token"
import { Projects } from "../model/project.model"
import { CreateProject } from "./create_project.service"
import { GetProjects } from "./get_projects.service"

export const createProject = new CreateProject(Projects, createProjectToken)
export const findProjects = new GetProjects(Projects)
