'use strict'
import config from './config.js'
import Hapi from '@hapi/hapi'
import { v4 as uuid } from 'uuid'
import { openSync, writeSync, readFileSync, closeSync, unlinkSync } from 'fs'
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
        let filename = uuid()
        let fd = openSync(filename, 'w')
        writeSync(fd, fileContentBuffer)
        closeSync(fd)
        spawnSync('unoconv', ['-f', convertToFormat, filename])
        unlinkSync(filename)
        let convertedData = readFileSync(filename + '.html')
        unlinkSync(filename + '.html');
        if ( convertedData.length ) {
          response = convertedData
        }
      }
      return response
     }
  }
});

server.start()
