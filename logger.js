const { createLogger, transports, format } = require("winston");

/**
 * log
 * info
 * warn
 * error
 */
const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.File({ filename: 'combined.log' }),
        new transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

// 개발환경에서는 콘솔에 표시
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({ format: format.simple() }));
};

module.exports = logger;