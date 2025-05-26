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


### Para traer los mensajes dentro de un chat
GET '/chatroom/user/direct/:otherId'

Me trae todos los mensajes de mi chatroom con el usuario de id otherId
el resultado es
```json
{
    "results": "MessageWithAuthor[]",
    "totalCount": "number",
    "page?": "number",
    "limit?": "number"
}
```
y MessageWithAuthor[] es como Message, pero tiene ademas author, que dice "me", u "other"

Ejemplo de llamada
http://localhost:3005/chatroom/user/direct/68236b0b3c787897b084d59a?limit=1

ejemplo de respuesta

```json
{
    "results": [
        {
            "_id": "6830b562111cca55dfb41b8b",
            "chatroomId": "6830b2ee6b3e6d15779023e2",
            "senderId": "68236b0b3c787897b084d59a",
            "message": "Todo bien, vos",
            "kind": "Text",
            "createdAt": "2025-05-23T17:50:26.770Z",
            "updatedAt": "2025-05-23T17:50:26.770Z",
            "__v": 0,
            "author": "other"
        }
    ],
    "totalCount": 2,
    "page": 1,
    "limit": "1"
}
```