## General

- **Crear una petición**
 `POST /petitions`
 El body es de la forma:

 ```json
 {
  "emitter": "string",
  "receiver": "string", //Puede ser undefines
  "reference": {
    "id": "string", //Puede ser undefined
    "type": "type" //Match, Group, User
  }
 }
```
  Donde emitter es el id de usuario emisor, receiver el id del usuario receptor.
  Reference es el recurso al que se está invitando, reference.type puede ser Match, Group o User
  Si es Match o Group reference.id es el id de ese grupo/partido.
  Si es User, entonces e suna solciitud de amistad, y reference.id tiene que dejarse vacío.
  Si el reference.type es Match o Group, si el receiver es undefined toma como receiver al admin del grupo/partido

- **Aceptar petición**  
  `PUT /petitions/accept/:petitionId`  
  Donde `:petitionId` es el id de la petición.
- **Rechazar petición**  
  `PUT /petitions/decline/:petitionId`  
  Donde `:petitionId` es el id de la petición.

## Friends

- **Enviar solicitud**  
  `POST /users/friends/:friendId`  
  El usuario logueado le envía una petición al usuario de id `friendId`.

- **Ver solicitudes de amistad**  
  `GET /users/friends-petitions`  
  Muestra las solicitudes del usuario logueado. La respuesta incluye:  
  - `results`: array con las peticiones.  
  - `totalCount`: número total de peticiones.

## Groups
- **Enviar solicitud**
  `POST /groups/:groupId/petition`
  El usuario logueado le envía una petición al admin del grupo con id groupId
- **Enviar Invitación**
 `POST /groups/:groupId/invite/:userId`
   El usuario logueado tiene que ser admin del grupo, le envía una petición para que el usuario de id userId se una al grupo de id groupId
- **Ver las peticiones de grupo**
 `GET /groups/petitions`
  Muestra todas las peticiones de gruposen el que el usuario es el receptor.
  La respuesta incluye:  
  - `results`: array con las peticiones.  
  - `totalCount`: número total de peticiones.
 
## Matches
- **Enviar solicitud**
  `POST /matches/:matchId/petition`
  El usuario logueado le envía una petición al admin del partido de id matchId
- **Enviar Invitación**
 `POST /matches/:matchId/invite/:userId`
   El usuario logueado tiene que ser admin del partido, le envía una petición para que el usuario de id userId se una al partido de id matchId
- **Ver las peticiones del partido**
 `GET matches/petitions`
  Muestra todas las peticiones de partidos en el que el usuario es el receptor.
  La respuesta incluye:  
  - `results`: array con las peticiones.  
  - `totalCount`: número total de peticiones.
 
 
 ### Regla de negocio básica
 - **Petición**: el *emitter* NO es administrador del recurso ⇒ solicita unirse. isInvitation = false
 - **Invitación**: el *emitter* SÍ es administrador ⇒ invita a otro usuario. isInvitation = true