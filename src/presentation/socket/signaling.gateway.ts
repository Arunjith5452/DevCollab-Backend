import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from "@/infrastructure/providers/logs/logger";

export class SignalingGateway {
    private io: Server;
    private userVideoState = new Map<string, boolean>();
    private userAudioState = new Map<string, boolean>();

    constructor(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: '*', // Allow all origins for now, configure as needed
                methods: ['GET', 'POST'],
            },
        });

        this.initialize();
    }

    private initialize() {
        this.io.on('connection', (socket: Socket) => {
            logger.info(`User connected: ${socket.id}`);

            socket.on('join-room', (roomId: string, userId: string, userName: string) => {
                socket.join(roomId);
                socket.join(userId);

                socket.data.userId = userId;
                socket.data.userName = userName;
                socket.data.roomId = roomId;

                // Send current state of the room to the new joiner
                const roomVideoState: Record<string, boolean> = {};
                const roomAudioState: Record<string, boolean> = {};

                // Get all users in the room
                const socketsInRoom = this.io.sockets.adapter.rooms.get(roomId);
                if (socketsInRoom) {
                    socketsInRoom.forEach((socketId) => {
                        const socket = this.io.sockets.sockets.get(socketId);
                        if (socket && socket.data.userId && socket.data.userId !== userId) {
                            const peerId = socket.data.userId;
                            roomVideoState[peerId] = this.userVideoState.get(peerId) ?? true;
                            roomAudioState[peerId] = this.userAudioState.get(peerId) ?? true;
                        }
                    });
                }

                socket.emit('room-state', {
                    video: roomVideoState,
                    audio: roomAudioState
                });

                logger.info(`User ${userName} (${userId}) joined room ${roomId}`);
                socket.to(roomId).emit('user-connected', { userId, userName });

                socket.on('disconnect', () => {
                    logger.info(`User ${userName} (${userId}) disconnected`);
                    socket.to(roomId).emit('user-disconnected', { userId, userName, videoEnabled: this.userVideoState.get(userId) ?? true });
                    this.userVideoState.delete(userId); // Use cleanup with caution if reconnection logic exists
                    this.userAudioState.delete(userId);
                });
            });

            // WebRTC Signaling Events
            socket.on('offer', (payload: { target: string; caller: string; sdp: { type: "offer" | "answer" | "pranswer" | "rollback", sdp: string } }) => {
                this.io.to(payload.target).emit('offer', payload);
            });

            socket.on('answer', (payload: { target: string; caller: string; sdp: { type: "offer" | "answer" | "pranswer" | "rollback", sdp: string } }) => {
                this.io.to(payload.target).emit('answer', payload);
            });

            socket.on('ice-candidate', (payload: { target: string; candidate: { candidate: string, sdpMid: string | null, sdpMLineIndex: number | null } }) => {
                this.io.to(payload.target).emit('ice-candidate', payload);
            });

            socket.on('raise-hand', (payload: { roomId: string; userId: string; raised: boolean }) => {
                socket.to(payload.roomId).emit('hand-raised', payload);
            });

            socket.on('video-state', (payload: { roomId: string; userId: string; enabled: boolean }) => {
                this.userVideoState.set(payload.userId, payload.enabled);
                socket.to(payload.roomId).emit('video-state', payload);
            });
            socket.on('audio-state', (payload: { roomId: string; userId: string; enabled: boolean }) => {
                this.userAudioState.set(payload.userId, payload.enabled);
                socket.to(payload.roomId).emit('audio-state', payload);
            });

        });
    }
}
