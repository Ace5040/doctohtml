'use strict'
import config from './config.js'
import Hapi from '@hapi/hapi'
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
          data.file.on('end', () => resolve(Buffer.concat(chunks)));
        })
        if ( fileContentBuffer ) {
          let proc = spawnSync('unoconvert', ['--convert-to', convertToFormat, '-', '-'], {
            input: fileContentBuffer
          })
          if ( proc.output.length && proc.output[1] ) {
            response = proc.output[1]
          }
        }
      }
      return response
     }
  }
});

server.start()
