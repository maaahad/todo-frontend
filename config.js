// This file contains variables for configuration
// || TODO : This should be solved by environment variable for production and .credentials.development.js for
// development  (have a look at Trello Clone Frontend)
const credentials = {
  api: {
    BASE_URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001/api"
        : "https://maaahad-todo-server.herokuapp.com/api",
  },
};

export { credentials };
