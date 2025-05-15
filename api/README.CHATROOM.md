## General
 ```json
 {
  "kind": "kind", //Match, Group, Direct
  "foreignId": "string", //Puede ser undefined
  "participants": ["string", "string"], // puede ser undefined
  "messages": ["Message"]
 }
```
kind puede ser Match, Group o Direct.
foreignId es el id del Group o Match al cual está ligado el chatroom.
Si kind es Direct no tiene foreignId
participants es sólo si el kind es direct, y tiene los ids d elos dos usuarios participantes
messages es el array de los mensajes del chatroom
Y el Message es:


 ```json
 {
  "chatroomId": "string", //El id del chatroom 
  "senderId": "string", // El id del que lo envió
  "message": "string",
  "kind": "kind", //Por ahora no se usa
  "foreignId": "string" //Por ahora no se usa
 }
```
chatroomId es el id del chatroom en el que se envía el mensaje,
senderId es el id del ususario que envió el mensaje
message es el mensaje en sí, es el texto del mensaje,
Por ahora kind y foreignId no se usan

#### Cada vez que se crea un Match o Group, se crea su chatroom

### Para eviar mensaje a un chatroom
POST '/chatroom/:chatroomId/send'
Y el body es

```json
{
    "message": "string"
}
```

message es el texto del mensaje a enviar

### Para enviar mensaje directo se usa
POST '/users/message/:receiverId'
y el body es
```json
{
    "message": "string"
}
```

### Traer los chats directos con el último mensaje
GET '/chatroom/user/direct'

Devuelve un array de objetos, que tienen chatroomId, kind (Direct), participants,  y lastMessage,
por ejemplo:

```json
[
    {
        "chatroomId": "682619d545873a2255da98f3",
        "kind": "Direct",
        "participants": [
            "67db347b35e90c4535489413",
            "679ba8a55768ea11f86cdf9e"
        ],
        "lastMessage": {
            "_id": "68262a87c64db3030d0dca7d",
            "chatroomId": "682619d545873a2255da98f3",
            "senderId": "67db347b35e90c4535489413",
            "message": "holaaaa",
            "kind": "Text",
            "createdAt": "2025-05-15T17:55:20.034Z",
            "updatedAt": "2025-05-15T17:55:20.034Z",
            "__v": 0
        }
    }
]
```

### Traer los chats con el último mensaje
GET '/chatroom/user'

Es como el anterior, pero trae tambien los chats de group y matches