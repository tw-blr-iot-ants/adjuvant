const winston = require('winston');
const fs = require('fs');
const logsPath = './logs/';

fs.existsSync(logsPath) || fs.mkdirSync(logsPath);

module.exports = new winston.Logger({
    'transports': [
        new winston.transports.Console(),
        new winston.transports.File({'filename': './logs/events.log'})
    ]
});

