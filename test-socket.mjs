import { io } from 'socket.io-client';

// Token válido para la conexión
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcwYjA5ZmZkLTViNzMtNGVjNy1hODMzLTkwOThmNWU0NDA4OSIsImVtYWlsIjoiYWJpQG1haWwuY29tIiwidXNlcl90eXBlIjoicmVndWxhciIsImlhdCI6MTczNDY0NjA0NCwiZXhwIjoxNzM0Njg5MjQ0fQ.xmd1vXM76IDtduhfDtl5MMycXy0PxYs7R59Dpszf_8I'; // Reemplaza con un token válido

// Conectar al servidor WebSocket
const socket = io('http://localhost:3000/chats', {
  auth: {
    token: token,
  },
});

socket.on('connect', () => {
  console.log('Conectado al servidor WebSocket.');
  console.log('ID de la conexión:', socket.id);

  // Enviar un mensaje a un grupo
  const groupMessagePayload = {
    content: 'Hola, grupo!',
    sender_id: '65be313a-1ce0-4a1f-9247-2eb1e93d7125', // Cambia al ID del usuario remitente
    groupId: '4607eecf-605b-4806-aa5e-ba59efa9eb15', // Cambia al ID de un grupo existente
    type: 'text',
    is_anonymous: false,
  };

  console.log('Enviando mensaje grupal:', groupMessagePayload);
  socket.emit('message', groupMessagePayload);

  // Enviar un mensaje a un chat individual
  const privateMessagePayload = {
    content: 'Hola, chat privado!',
    sender_id: 'fa94d580-fdc5-47ac-82f6-44e2b387ca27', // Cambia al ID del usuario remitente
    chatId: '5895cc3f-fae2-4d69-8043-7e7f5a0f1f77', // Cambia al ID de un chat existente
    messageReceivers: ['e39cf5a5-0741-4b37-a4ec-861c406b8a80'], // Cambia al ID del usuario receptor
    type: 'text',
    is_anonymous: false,
  };

  console.log('Enviando mensaje privado:', privateMessagePayload);
  socket.emit('message', privateMessagePayload);

  // Manejar la respuesta para mensajes grupales
  socket.on('receiveGroupMessage', (data) => {
    console.log('Mensaje recibido en el grupo:', data);
  });

  // Manejar la respuesta para mensajes privados
  socket.on('receivePrivateMessage', (data) => {
    console.log('Mensaje recibido en chat privado:', data);
  });

  // Manejar errores
  socket.on('error', (error) => {
    console.error('Error recibido del servidor:', error);
  });

  // Desconectar manualmente después de 10 segundos
  setTimeout(() => {
    console.log('Desconectando manualmente...');
    socket.disconnect();
  }, 10000); // Cambia el tiempo si es necesario
});

// Manejar eventos de desconexión
socket.on('disconnect', (reason) => {
  console.log('Desconectado del servidor:', reason);
});
