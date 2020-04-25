let express = require('express');
let compression = require('compression');
let fs = require('fs');
let app = express();

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
			.use('/public', express.static(__dirname + '/public'))
			.get('/', (req, res) => {
				res.setHeader('Content-Type', 'text/html; charset=utf-8');
				res.setHeader('Cache-Control', 'public');
				res.setHeader('Keep-Alive', 'timeout=5, max=1000');
				res.status(200).send(this.files['content']);
			})
			.use((req, res) => {
				res.setHeader('Content-Type', 'text/html; charset=utf-8');
				res.setHeader('Cache-Control', 'public');
				res.setHeader('Keep-Alive', 'timeout=5, max=1000');
				res.status(404).send(this.files['404']);
			});
		app.listen(8080);
	}

}

let startpage = new Startpage();
startpage.main();