import Joi from "joi"

export const signUpSchema = {
  inputSchema: Joi.object().keys({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .label("First name is required and must be between 2 and 50 characters"),

    lastName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .label("Last name is required and must be between 2 and 50 characters"),

    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Valid email is required"),

    password: Joi.string()
      .min(8)
      .required()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/)
      .label(
        "Password is required and must be at least 8 characters. It should include at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!).",
      ),
    roleId: Joi.string()
      .length(36)
      .required()
      .label("Role ID is required and must be exactly 36 characters"),

    phoneNumber: Joi.string()
      .regex(/^\+234\d{10}$/)
      .required()
      .label("Valid phone number is required"),
  }),
}
