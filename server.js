let express = require('express');
// var favicon = require('serve-favicon');
let compression = require('compression');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let fs = require('fs');
let app = express();

let files = {};

// https://github.com/expressjs/session
// https://github.com/kelektiv/node.bcrypt.js

let con = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "startpage",
	password: "startpage",
	database: "startpage"
});

let sendNews = function(result, {req, res}){
	res.status(200).send(result);
}

const mysqlRequest = (request, callback, arguments) => {
	con.query(request, (error, results) => {
		if (error){
			console.error(error);
			arguments.push(error);
		}
		if (callback !== undefined) {
			callback(results, arguments);
		}
	});
};

const promise1 = new Promise((resolve, reject) => {
	con.connect((err) => { // TODO
		if (err) {
			reject(err)
		} else {
			resolve('Connected to db!');
		}
	});
});

const promise2 = new Promise((resolve, reject) => {
	try {
		files["content"] = fs.readFileSync('include/content.html', 'utf8');
		files["404"] = fs.readFileSync('public/404.html', 'utf8');
		resolve('Fichiers trouvés');
	} catch (err) {
		reject(err);
	}
})

const startupPromise = function(){
	Promise.all([promise1, promise2]).then((values) => {
		console.log(values);
		routing();
	}).catch((reasons) => {
		console.warn('ERROR');
		console.warn(reasons);
		console.log('killing process...');
		process.exit(1);
	});
}

let routing = function() {
	app.use(compression())
		.use(bodyParser.urlencoded({
			extended: false
		}))
		.use('/public', express.static(__dirname + '/public'))
		.get('/', (req, res) => {
			res.setHeader('Content-Type', 'text/html; charset=utf-8');
			res.setHeader('Cache-Control', 'public');
			res.setHeader('Keep-Alive', 'timeout=5, max=1000');
			res.status(200).send(files['content']);
		})
		.post('/getNews', (req, res) => {
			res.setHeader('Content-Type', 'text/json; charset=utf-8');
			res.setHeader('Cache-Control', 'public');
			res.setHeader('Keep-Alive', 'timeout=5, max=1000');
			try {
				mysqlRequest('SELECT * FROM news WHERE 1 ORDER BY id DESC LIMIT 0, 20', sendNews, {req, res});
			} catch (err) {
				res.setHeader('Content-Type', 'text/plain; charset=utf-8');
				res.status(500).send(err);
			}
			
		})
		.use((req, res) => {
			res.setHeader('Content-Type', 'text/html; charset=utf-8');
			res.setHeader('Cache-Control', 'public');
			res.setHeader('Keep-Alive', 'timeout=5, max=1000');
			res.status(404).send(files['404']);
		});
	app.listen(8080);
}

	startupPromise();
