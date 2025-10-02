import { createServer } from 'node:htttp'

const server = createServer()

function requestCallback(request, response) {
    response.writeHead(200)
    response.end(`request received`)
}

server.on('request', requestCallback)

server.listen(3000)