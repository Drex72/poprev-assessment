import * as dotenv from "dotenv"
import Joi from "joi"
import { Dialect } from "sequelize"

dotenv.config()

// Define validation schema for environment variables
const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("development", "production", "test")
      .required(),
    DOCKER_PORT: Joi.number().required(),
    APPLICATION_PORT: Joi.number().required(),

    ACCESS_TOKEN_SECRET: Joi.string().required(),
    ACCESS_TOKEN_EXP: Joi.string().required(),
    REFRESH_TOKEN_SECRET: Joi.string().allow("").required(),
    REFRESH_TOKEN_EXP: Joi.string().required(),
    ENCRYPTOR_SECRET_KEY: Joi.string().required(),

    DATABASE_NAME: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_USER: Joi.string().allow("").required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_TYPE: Joi.string().required(),
  })
  .unknown()

// Validate environment variables against the schema
const { value: validatedEnvVars, error: validationError } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env)

// Throw an error if validation fails
if (validationError) {
  throw new Error(`Config validation error: ${validationError.message}`)
}

export const config = Object.freeze({
  port: validatedEnvVars.APPLICATION_PORT,
  appEnvironment: validatedEnvVars.NODE_ENV,
  auth: {
    accessTokenSecret: validatedEnvVars.ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: validatedEnvVars.ACCESS_TOKEN_EXP,
    refreshTokenSecret: validatedEnvVars.REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: validatedEnvVars.REFRESH_TOKEN_EXP,
    encryptorSecretKey: validatedEnvVars.ENCRYPTOR_SECRET_KEY,
  },

  db: {
    dbUser: validatedEnvVars.DATABASE_USER,
    dbPassword: validatedEnvVars.DATABASE_PASSWORD,
    dbHost: validatedEnvVars.DATABASE_HOST,
    dbName: validatedEnvVars.DATABASE_NAME,
    dbType: validatedEnvVars.DATABASE_TYPE as Dialect,
  },
})
