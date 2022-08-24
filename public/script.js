const ws = new WebSocket(`wss://${document.location.hostname}:1338`)

const username = localStorage.getItem('username') || prompt('What do you want your username to be?') || 'anonymous'

localStorage.setItem('username', username)

ws.addEventListener('open', connectionOpen)
ws.addEventListener('message', handleSocketMessage)

function connectionOpen() {
    console.log('Websocket connection established')
}

function appendToChatbox({ sender, message }) {
    const div = document.createElement('div')
    div.className = 'message-row'

    const senderDiv = document.createElement('div')
    senderDiv.className = 'sender'
    senderDiv.textContent = sender

    const messageDiv = document.createElement('div')
    messageDiv.className = 'message'
    messageDiv.textContent = message

    div.appendChild(senderDiv)
    div.appendChild(messageDiv)

    document.getElementById('chat').appendChild(div)
}

function handleSocketMessage(e) {
    try {
        const realMessage = JSON.parse(e.data)
        const { sender, message } = realMessage
        appendToChatbox({ sender, message })
    } catch(error) {
        // case for public
    }
}

function runHandler(e) {
    e.preventDefault()
    if(ws.readyState === WebSocket.OPEN) {
        const field = document.getElementById('message-field')
        const message = field.value
        field.value = ''
        console.log(`Trying to send this message on socket: ${message}`)
        ws.send(JSON.stringify({
            sender: username,
            message
        }))
    } else {
        console.log('Establishing connection')
    }
}