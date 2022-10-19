import Joi from "joi";

export function passwordSchema(isAdmin = false) {
  return isAdmin
    ? Joi.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){20,}$/)
    : Joi.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){12,}$/);
}

export function siretSchema() {
  return Joi.string()
    .regex(/^[0-9]{14}$/)
    .creditCard()
    .error(
      (errors) =>
        new Error(`Error: schema not valid : ValidationError: ${errors[0].local.key} must be follow Luhn algorithm`)
    );
}

export function uaiSchema() {
  return Joi.string().regex(/^[0-9]{7}[a-zA-Z]$/);
}
