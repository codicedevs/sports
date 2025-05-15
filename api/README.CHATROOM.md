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
Y el Message es


 ```json
 {
  "chatroomId": "string", //El id del chatroom 
  "senderId": "string", // El id del que lo envió
  "message": "string",
  "kind": "kind", //Por ahora no se usa
  "foreignId": "string" //Por ahora no s eusa
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

### Para enviar mensaje a User se usa
POST '/users/message/:receiverId'
y el body es
```json
{
    "message": "string"
}
```