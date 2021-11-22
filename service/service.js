'use strict'
import config from './config.js'
import Hapi from '@hapi/hapi'
import { v4 as uuid } from 'uuid'
import { openSync, writeSync, readSync } from 'fs'
import { spawnSync } from 'child_process'
const server = new Hapi.Server({
  port: config.SERVER_PORT,
  host: '0.0.0.0'
})

server.route({
  method: 'POST',
  path: '/convert/{format}',
  config: {
     payload:{
        output:'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        timeout: config.PAYLOAD_TIMEOUT,
        maxBytes: config.PAYLOAD_MAX_SIZE,
     },
     handler: async function (request) {
      const convertToFormat = request.params.format
      const data = request.payload
      let response = ''
      if (data.file) {
        const chunks = [];
        let fileContentBuffer = await new Promise((resolve) => {
          data.file.on('data', (chunk) => {
            chunks.push(Buffer.from(chunk))
          })
          data.file.on('end', () => resolve(Buffer.concat(chunks)))
        })
        let fd = openSync(uuid, 'w')
        writeSync(fd, fileContentBuffer)
        if ( fileContentBuffer ) {
          spawnSync('unoconv', ['-f', convertToFormat, uuid])
          let fd2 = openSync(uuid, 'r')
          let convertedData = readSync(fd2)
          if ( convertedData.length ) {
            response = convertedData
          }
        }
      }
      return response
     }
  }
});

server.start()
