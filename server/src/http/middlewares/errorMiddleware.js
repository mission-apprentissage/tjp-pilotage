import Boom from "boom";

function boomify(rawError) {
  let error;
  if (rawError.isBoom) {
    error = rawError;
    error.output.payload.details = rawError.data;
  } else if (rawError.name === "ValidationError") {
    //This is a joi validation error
    error = Boom.badRequest("Erreur de validation");
    error.output.payload.details = rawError.details;
  } else if (rawError.message === "Unauthorized") {
    error = Boom.unauthorized("Accès non autorisé");
  } else {
    error = Boom.boomify(rawError, {
      statusCode: rawError.status || 500,
      ...(!rawError.message ? "Une erreur est survenue" : {}),
    });
  }
  return error;
}

export function errorMiddleware() {
  // eslint-disable-next-line no-unused-vars
  return (rawError, req, res, next) => {
    req.err = rawError;

    let { output } = boomify(req.err);
    return res.status(output.statusCode).send(output.payload);
  };
}
