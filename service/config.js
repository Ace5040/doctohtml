'use strict'

export default {
  SERVER_PORT: process.env.SERVER_PORT || 3000,
  PAYLOAD_MAX_SIZE: process.env.PAYLOAD_MAX_SIZE || 10485760,
  PAYLOAD_TIMEOUT: process.env.PAYLOAD_TIMEOUT || 300000,
}
