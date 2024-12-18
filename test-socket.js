import { io } from 'socket.io-client';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUzYTk3MzMzLWE5ZmYtNDkxYS1hZWNlLTkyYzY4MWFmMDNhYyIsImVtYWlsIjoianVhblBlcmV6QG1haWwuY29tIiwidXNlcl90eXBlIjoicmVndWxhciIsImlhdCI6MTczNDU1MzM3OCwiZXhwIjoxNzM0NTk2NTc4fQ.IrT1rggR-FQ2pWCuknYgZrEyLG8PU9gPqq6DBxaitfQ'; // Reemplaza con un token válido

// Conectar al servidor WebSocket con el token
const socket = io('http://localhost:3000/chats', {
  auth: {
    token: token,
  },
});

socket.on('connect', () => {
  console.log('Conectado al servidor WebSocket.');
  console.log('ID de la conexión:', socket.id);

  // Simular desconexión manual después de unos segundos
  setTimeout(() => {
    console.log('Desconectando manualmente...');
    socket.disconnect();
  }, 5000); // Cambia el tiempo si es necesario
});

// Manejar eventos de desconexión
socket.on('disconnect', (reason) => {
  console.log('Desconectado del servidor:', reason);
});

// Manejar errores enviados desde el servidor
socket.on('error', (error) => {
  console.error('Error recibido del servidor:', error);
});
