const NRP = require('node-redis-pubsub');
const config = {
    port: 6379, // Port of your locally running Redis server
    host: '127.0.0.1',
    scope: 'recipes' // Use a scope to prevent two NRPs from sharing messages
};

const nrp = new NRP(config); // This is the NRP client

module.exports = nrp;