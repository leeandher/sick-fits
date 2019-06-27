const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "settings.dev.env" });

const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// Use a library to convert the cookie from an ugly string to an object!
server.express.use(cookieParser());
// TODO: Use express middleware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    },
    port: process.env.PORT
  },
  ({ port }) => {
    console.log(`\nServer is now running at: \nhttp://localhost:${port}`);
  }
);
