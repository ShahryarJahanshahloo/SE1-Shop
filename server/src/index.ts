import http from 'http'
import dotenv from 'dotenv'
import * as customRequest from './custom'
import * as environmentTypes from './environment'
dotenv.config({ path: './config/dev.env' })

import app from './app'
import startDBConnection from './db/connection'

const server = http.createServer(app)

const PORT = process.env.PORT || 3001

server.listen(PORT, async () => {
  console.log('server running on port: ' + PORT)
  await startDBConnection()
})
