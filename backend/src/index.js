const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: 'settings.dev.env' })

const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

// Use a library to convert the cookie from an ugly string to an object!
server.express.use(cookieParser())

// Decode the JWT so that we can get the User ID on each request
server.express.use((req, res, next) => {
  const token = req.cookies['sf-token']
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    req.userId = userId
  }
  next()
})

// Populates the entire user object on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) return next()
  const user = await db.query.user(
    { where: { id: req.userId } },
    `{ id, permissions, email, name }`,
  )
  req.user = user
  next()
})

// Start the app!
server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
    port: process.env.PORT,
  },
  ({ port }) => {
    console.log(`\n Server is now running at: \nhttp://localhost:${port}`)
  },
)
