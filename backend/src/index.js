require('dotenv').config({ path: 'settings.dev.env' })

const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

// TODO: Use express middleware to handle cookies (JWT)
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
    console.log(`\nServer is now running at: \nhttp://localhost:${port}`)
  }
)
