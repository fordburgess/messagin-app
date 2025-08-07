import express from 'express';
import cors from 'cors';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { Server as SocketIOServer } from 'socket.io';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { Pool } from 'pg';
var jwt = require('jsonwebtoken');

const app = express()

const pool = new Pool({
  connectionString: 'postgresql://messaging_app_db_p68i_user:Ur0YU6e8Otv5lVvWG8z1yVVYXwuY3nKN@dpg-d29rrc1r0fns73e649ug-a.frankfurt-postgres.render.com/messaging_app_db_p68i',
  ssl: {
    rejectUnauthorized: false,
  },
});

import http from 'http';
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('connected')
})

const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        message: `Hello ${input.name}`
      }
    }),

  getAllData: publicProcedure
    .input(z.string())
    .query(async (opts) => {
      const { input } = opts;

      const users = await pool.query('SELECT id, name, username FROM users;');
      const chats = await pool.query(`SELECT c.* FROM chats c JOIN chat_participants cp ON c.id = cp.chat_id WHERE cp.user_id = $1;`, [input])
      const chatParticipants = await pool.query('SELECT * FROM chat_participants;');
      const allMessages = await pool.query('SELECT * FROM messages;');

      var chatData = chats.rows.map((chat) => {
        var messages = allMessages.rows.filter((message) => message.chat_id == chat.id);
        var chatUsers = chatParticipants.rows.filter((user) => user.chat_id == chat.id).map((user) => user.user_id);
        var participants = users.rows.filter((user) => chatUsers.includes(parseInt(user.id)));

        return {
          id: chat.id,
          messages,
          participants,
        }
      })

      return {
        chatData,
        users: users.rows
      };
    }),

  authenticate: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {

      const result = await pool.query('SELECT * FROM users WHERE username = $1', [input.username]);

      if (result.rows.length > 0) {
        const user = result.rows[0];

        if (input.password == user.password) {
          const secretKey = '391811276b7a2f24eb1c77e86cd23c1dfb237fbe664f6e2d719052d55877d41926d21362f60d331dbcac41255b277d5c5154a5af4357caab5d869af4fddab876';

          const payload = { id: user.id, name: user.name, username: user.username };
          const token = jwt.sign( payload, secretKey, { expiresIn: '1h' });

          return { token }
        }
        else {
          throw new Error('Incorrect username or password');
        }
      }
      else {
        throw new Error('Incorrect username or password');
      }
    }),

  newMessage: publicProcedure
    .input(z.object({ message: z.string(), userId: z.string(), chatId: z.string() }))
    .mutation(async ({ input}) => {
      const message = input.message;
      const userId = input.userId;
      const chatId = input.chatId;
      const timeSent = new Date().toISOString();

      const senderName = await pool.query('SELECT name FROM users WHERE id = $1;', [userId]);

      const result = await pool.query(`
        INSERT INTO messages
        (chat_id, sender_id, message, time_sent)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `, [chatId, userId, message, timeSent]);

      const insertedId = result.rows[0];

      io.emit('receive_message', {
        messageId: insertedId.id,
        chatId,
        senderId: userId,
        senderName: senderName.rows[0].name,
        time_sent: timeSent,
        message: message
      })

      return { timeSent }
    }),

  newChat: publicProcedure
    .input(z.object({
      senderId: z.number(),
      recipientProfile: z.object({
        id: z.string(),
        name: z.string(),
        username: z.string(),
      })
    }))
    .mutation(async ({ input }) => {
      const senderId = input.senderId;
      const recipientProfile = input.recipientProfile;

      const senderProfile = await pool.query('SELECT name, username FROM users WHERE id = $1', [senderId]);
      const newChatId = await pool.query('INSERT INTO chats DEFAULT VALUES RETURNING id;');

      // insert sender
      await pool.query('INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2);', [newChatId.rows[0].id, senderId]);

      // insert recipient
      await pool.query(`INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2);`, [newChatId.rows[0].id, recipientProfile.id])

      io.emit('new_chat', {
        id: newChatId.rows[0].id,
        messages: [],
        senderId,
        participants: [
          { id: senderId, name: senderProfile.rows[0].name, username: senderProfile.rows[0].username },
          { id: recipientProfile.id, name: recipientProfile.name, username: recipientProfile.username }
        ]
      })

      return {
        id: newChatId.rows[0].id,
        messages: [],
        senderId,
        participants: [
          { id: senderId, name: senderProfile.rows[0].name, username: senderProfile.rows[0].username },
          { id: recipientProfile.id, name: recipientProfile.name, username: recipientProfile.username }
        ]
      }
    })

})

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json());

app.use('/trpc', createExpressMiddleware({
  router: appRouter,
}));

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
})

export type AppRouter = typeof appRouter;
