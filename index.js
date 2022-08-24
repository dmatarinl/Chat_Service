const express = require('express')
const { WebSocketServer, WebSocket } = require('ws')

const app = express()

const wss = new WebSocketServer({
  port: 1338,
  clientTracking: true
})

wss.on('connection', function connection(ws) {
    ws.on('message', function(e) {
        const rawMessage = Buffer.from(e).toString()
        try {
            const { sender, message } = JSON.parse(rawMessage)

            for(const client of wss.clients) {
                if(client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        sender, message
                    }))
                }
            }
        } catch(error) {
            // if server dont crash
        }
    })
    ws.on('close', () => {
    })
    ws.send(JSON.stringify({
        sender: 'System',
        message: 'Connection Established'
    }))
})

app.use(express.static('public'))

const port = 1337
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

