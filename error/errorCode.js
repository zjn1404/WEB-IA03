const HttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
};

export const ErrorCode = {
  INVALID_USER_NAME_OR_PASSWORD: {
    message: "Invalid username or password",
    statusCode: HttpStatus.UNAUTHORIZED,
    desc: "The username or password you entered is incorrect",
  },

  USER_NOT_FOUND: {
    message: "User not found",
    statusCode: HttpStatus.NOT_FOUND,
    desc: "The user you're looking for doesn't exist",
  },

  UPLOAD_IMAGE_ERROR: {
    message: "Error uploading image",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "There was an error uploading the image",
  },

  DUPLICATE_EMAIL: {
    message: "This email has already been used",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "The email has already been used",
  },

  EMPTY_INPUT: {
    message: "Input field cannot be empty",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "The input is empty",
  },

  PAGE_NOT_FOUND: {
    message: "Page not found",
    statusCode: HttpStatus.NOT_FOUND,
    desc: "The page you're looking for doesn't exist",
  },

  SERVER_ERROR: {
    message: "Internal server error",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    desc: "Something went wrong",
  },
};
