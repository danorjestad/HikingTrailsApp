/* App entry point */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dbConfig = require('./config/database');

const api = require('./controllers/api');
const adminApi = require('./controllers/admin-api');
const adminBundle = require('./controllers/admin-bundle');
const adminPath = require('./controllers/admin-path');
const adminPlace = require('./controllers/admin-place');

/*
 * Setup express
 */
/* if a port was sent as an arg, use it, otherwise 3000 */
const port = (process.argv.length > 2 ? process.argv[2] : 3000);
const app = express();


/* Setup the static file servering directory */
app.use(express.static(__dirname + '/public'));
app.use(cors());

// Add a JSON-parser, as any incoming data should be json
app.use(express.json({strict: false}));

/*
 * Set up API end-points
 */
app.use('/api', api);
app.use('/api/path', api);
app.use('/api/place', api);

app.use('/admin', adminApi);
app.use('/admin/bundle', adminBundle);
app.use('/admin/path', adminPath);
app.use('/admin/place', adminPlace);

/*
 * Setup mongoose and start server if everything went well
 */
mongoose.connect(dbConfig.database, dbConfig.opts, (err) => {
	if (err) {
		console.error('Mongoose unable to connect!');
		console.error(err);
		process.exit(1);
	}
});

const server = app.listen(port, () => {
	console.log(`[app] Starting server at port ${port}`);
});

/*
 * Allow for a more controlled shutdown, hook it to
 * SIGTERM and SIGKILL
 */
const gracefulShutdown = () => {
	console.log('[app] Shutting down...');
	mongoose.disconnect((err) => {
		if (err) {
			console.error(err);
		}
	});

	server.close(() => {
		process.exit();
	});

	setTimeout(() => {
		console.error('\tNot able to close connection in 5 sec - forcing shutdown');
		process.exit();
	}, 5000);
};

process.stdin.resume();
process.on('exit', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/* Export the port for testing */
if (process.env.NODE_ENV === 'test') {
	module.exports = { port };
}
