let express = require('express');
let compression = require('compression');
let bodyParser = require('body-parser');
let fs = require('fs');
let app = express();
const http = require('http');
const https = require('https');

class Startpage {

	files = {};

	promiseIndex = new Promise((resolve, reject) => {
		try {
			fs.readFile('include/content.html', {encoding: 'utf8'}, (err, data) => {
				if (err) {
					reject(err);
					return;
				}
				this.files['content'] = data;
				resolve('content.html loaded');
			});
		} catch (err) {
			reject(err);
		}
	});

	promise404 = new Promise((resolve, reject) => {
		try {
			fs.readFile('include/404.html', {encoding: 'utf8'}, (err, data) => {
				if (err) {
					reject(err);
					return;
				}
				this.files['404'] = data;
				resolve('404.html loaded');
			});
		} catch (err) {
			reject(err);
		}
	});

	main() {
		Promise.all([this.promiseIndex, this.promise404]).then((values) => {
			console.log(values);
			this.routing();
		}).catch((reasons) => {
			console.error('ERROR');
			console.error(reasons);
			console.warn('killing process...');
			process.exit(1);
		});
	}

	routing() {
		app.use(compression())
			.use(bodyParser.json())
			.use(bodyParser.urlencoded({ extended: true}))
			.use('/public', express.static(__dirname + '/public'))
			.get('/', (req, res) => {
				res.setHeader('Content-Type', 'text/html; charset=utf-8');
				res.setHeader('Cache-Control', 'public');
				res.setHeader('Keep-Alive', 'timeout=5, max=1000');
				res.status(200).send(this.files['content']);
				console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 200 Success');
			})
			.post('/news', (req, res) => {
				res.setHeader('Content-Type', 'application/xml; charset=utf-8');
				res.setHeader('Cache-Control', 'public');
				res.setHeader('Keep-Alive', 'timeout=5, max=1000');
				if(req.body.link !== undefined){
					let module;
					if(req.body.link.startsWith("https")){
						module = https;
					}else{
						module = http;
					}
					module.get(req.body.link, (response) => {
						const { statusCode } = response;
						const contentType = response.headers['content-type'];
					  
						let error;
						if (statusCode !== 200) {
						  error = new Error('Request Failed.\n' +
											`Status Code: ${statusCode}`);
						} else if (!/^application\/xml/.test(contentType)) {
						  error = new Error('Invalid content-type.\n' +
											`Expected application/xml but received ${contentType}`);
						}

						if(error){
							res.status(502).send("An error occured");
							console.log(error);
							response.resume();
							return;
						}
						response.setEncoding('utf8');
						let rawData = '';
						response.on('data', (chunk) => { rawData += chunk; });
						response.on("end", () => {
							res.status(200).send(rawData);
							console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 200 Sucess');

						});
					}).on("error", (err) => {
						res.status(err.statusCode).send("News source not found");
						console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': ' + err.statusCode + ' ' + err.status);

					});
				}else{
					res.status(400).send('Please precise an url');
					console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 400 Bad request');
				}
			})
			.get('/teapot', (req, res) => {
				res.setHeader('Content-Type', 'text/html; charset=utf-8');
				res.setHeader('Cache-Control', 'public');
				res.setHeader('Keep-Alive', 'timeout=5, max=1000');
				res.status(418).send('I\'m a teapot');
				console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 418 I\'m a teapot');

			})
			.use((req, res) => {
				res.setHeader('Content-Type', 'text/html; charset=utf-8');
				res.setHeader('Cache-Control', 'public');
				res.setHeader('Keep-Alive', 'timeout=5, max=1000');
				res.status(404).send(this.files['404']);
				console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 404 Not Found');

			});
		app.listen(8080);
	}

}

let startpage = new Startpage();
startpage.main();