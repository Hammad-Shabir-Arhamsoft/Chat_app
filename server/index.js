import cors from "cors";
import http from 'http';
import morgan from "morgan";
import express from "express"
import bodyParser from "body-parser"
import { WebSocketServer } from 'ws';
import compression from "compression";
import rateLimit from "express-rate-limit";
import methodOverride from 'method-override';
import UserRoutes from "./src/api/routes/index.js";
import connection from "./src/db/connection.js"
const app = express()
const server = http.createServer(app);
connection()
app.use(cors())
app.use(morgan('dev'));
app.use(compression());
app.use(methodOverride());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const apiRequestLimiterAll = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 90000
});

app.use("/v1/", apiRequestLimiterAll);
app.use('/v1/front', UserRoutes);

const adjectives = ['Mighty', 'Brave', 'Clever', 'Swift', 'Gentle', 'Bold', 'Curious', 'Fierce'];
const animals = ['Tiger', 'Elephant', 'Lion', 'Hawk', 'Dolphin', 'Panda', 'Eagle', 'Fox'];

// Function to generate a random user name
function generateRandomName() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return `${randomAdjective} ${randomAnimal}`; // Combine them into a single name
}


const wsServer = new WebSocketServer({ server });
const clients = {};

wsServer.on('connection', function (connection) {
    const userId = generateRandomName();

    clients[userId] = connection;
    connection.on('message', (message) => {
        for (let clientId in clients) {
            if (clients[clientId].readyState === clients[clientId].OPEN && clientId !== userId) {
                clients[clientId].send(`${userId}: ${message}`); // Send message to other clients, but not the sender
            }
        }
    });

    connection.on('close', () => {
        console.log(`${userId} disconnected.`);
        delete clients[userId];
    });

    connection.on('error', (error) => {
        console.error(`Error with connection ${userId}:`, error);
        delete clients[userId];
    });
});


server.listen(4000, () => {
    console.log("App is running on port 4000")
})