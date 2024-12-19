import { io } from 'socket.io-client';

// Token válido para la conexión
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUzYTk3MzMzLWE5ZmYtNDkxYS1hZWNlLTkyYzY4MWFmMDNhYyIsImVtYWlsIjoianVhblBlcmV6QG1haWwuY29tIiwidXNlcl90eXBlIjoicmVndWxhciIsImlhdCI6MTczNDYzOTE3OCwiZXhwIjoxNzM0NjgyMzc4fQ.Yalk92iazvWc2GdZpxPT-kB8FVNRM6Wek9EzST74484'; // Reemplaza con un token válido

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
    sender_id: '9fb9c573-04a8-45a4-bf65-012060939a4d', // Cambia al ID del usuario remitente
    chatId: '42986961-e229-4eaf-9d12-49608c46c9c9', // Cambia al ID de un chat existente
    messageReceivers: ['b1fda537-e3fa-4d57-9c16-fc1e3d4b366d'], // Cambia al ID del usuario receptor
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
