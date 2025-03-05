import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway(3001, { cors: { origin: '*' } })
  export class DrawingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    // Fired when a user connects
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    // Fired when a user disconnects
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    // Listen for drawing events from clients
    @SubscribeMessage('draw')
    handleDrawing(@MessageBody() data: any) {
      // Broadcast the drawing data to all connected clients
      this.server.emit('draw', data);
    }
  }
  