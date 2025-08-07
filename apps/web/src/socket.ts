import { io } from 'socket.io-client';

const URL = 'http://http://192.168.1.110:3000';

export const socket = io(URL);
