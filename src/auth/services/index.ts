import { Users } from "../models/user.model"
import { TokenService } from "./token.service"
import { Login } from "./login.service"
import { Logout } from "./logout.service"
import { SignUp } from "./signUp.service"
import { encryptor } from "./encryptor.service"
import { AuthGuard } from "./authGuard.service"
import { Roles } from "../models"
import { RoleService } from "./roles.service"
import { RefreshAccessToken } from "./refreshAccessToken.service"
import { GetAuthUser } from "./getAuthUser.service"
import { Wallet } from "../../user/wallet/models/wallet.model"

const tokenService = new TokenService(encryptor, Users)

export const login = new Login(Users, tokenService)
export const signup = new SignUp(Users, Roles, Wallet)
export const logout = new Logout(Users)
export const authGuard = new AuthGuard(tokenService)
export const roleService = new RoleService(Roles)
export const refreshAccessToken = new RefreshAccessToken(tokenService, Users)
export const getAuthUser = new GetAuthUser(Users)
