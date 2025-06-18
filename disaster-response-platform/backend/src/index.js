const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

const disastersRoute = require('./routes/disasters');
const reportsRoute = require('./routes/reports');
const resourcesRoute = require('./routes/resources');
const socialMediaRoute = require('./routes/socialMedia');
const geocodeRoute = require('./routes/geocode');
const officialUpdatesRoute = require('./routes/officialUpdates');
const verifyImageRoute = require('./routes/verifyImage');

app.set('io', io);

app.use('/disasters', disastersRoute);
app.use('/reports', reportsRoute);
app.use('/resources', resourcesRoute);
app.use('/disasters', socialMediaRoute);
app.use('/geocode', geocodeRoute);
app.use('/disasters', officialUpdatesRoute);
app.use('/disasters', verifyImageRoute);

app.get('/', (req, res) => res.send('Disaster Response Platform API'));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 