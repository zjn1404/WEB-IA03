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

  MOVIE_NOT_FOUND: {
    message: "Movie not found",
    statusCode: HttpStatus.NOT_FOUND,
    desc: "The movie you're looking for doesn't exist",
  },

  MOVIE_IMAGE_REQUIRED: {
    message: "Movie image is required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Movie image is required",
  },

  MOVIE_ID_REQUIRED: {
    message: "Movie ID is required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Movie ID is required",
  },

  REVIEW_TITLE_REQUIRED: {
    message: "Review title is required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Review title is required",
  },

  REVIEW_CONTENT_REQUIRED: {
    message: "Review content is required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Review content is required",
  },

  USERNAME_REQUIRED: {
    message: "Username is required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Username is required",
  },

  MOVIE_TITLE_REQUIRED: {
    message: "Movie title is required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Movie title is required",
  },

  MOVIE_FULLTITLE_REQUIRED: {
    message: "Movie full title is required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Movie full title is required",
  },

  MOVIE_YEAR_REQUIRED: {
    message: "Movie year is required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Movie year is required",
  },

  MOVIE_PLOT_REQUIRED: {
    message: "Movie plot is required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Movie plot is required",
  },

  MOVIE_RELEASEDATE_REQUIRED: {
    message: "Movie release date is required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Movie release date is required",
  },

  MOVIE_GENRES_REQUIRED: {
    message: "Movie genres are required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Movie genres are required",
  },

  MOVIE_ACTORS_REQUIRED: {
    message: "Movie actors are required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Movie actors are required",
  },

  MOVIE_DIRECTORS_REQUIRED: {
    message: "Movie directors are required",
    statusCode: HttpStatus.BAD_REQUEST,
    desc: "Movie directors are required",
  },

  ACTOR_NOT_FOUND: {
    message: "Actor not found",
    statusCode: HttpStatus.NOT_FOUND,
    desc: "The actor you're looking for doesn't exist",
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
