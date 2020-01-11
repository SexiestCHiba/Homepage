let express = require('express');
// var favicon = require('serve-favicon');
let session = require('express-session');
let compression = require('compression');
var bodyParser = require('body-parser');
let mysql = require('mysql');
let MySQLStore = require('express-mysql-session')(session);
let fs = require('fs');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
let app = express();

const saltRounds = 10;
let include = {};
let sessionStore;

// https://github.com/expressjs/session
// https://github.com/kelektiv/node.bcrypt.js

let con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "startpage",
    password: "startpage",
    database: "startpage"
});

const promise1 = new Promise((resolve, reject) => {
    let sessionStore = new MySQLStore({}, con, function (err) {
        if (err) {
            reject(err)
        } else {
            sessionStore = new MySQLStore({}, con);
            resolve('Connected to db!');
        }
    });
    // con.connect(function(err) {
    //     if (err){
    //         reject(err)
    //     }else{
    //         resolve('Connected to db!');
    //     }
    // });
});

let credentialsPOST = function (sqlResult, {req, res}) {
    if (sqlResult.length === 1) {
        response = {
            "connected": true,
            "mail": sqlResult[0].mail,
            "searchengine": sqlResult[0].searchengine
        }
    } else {
        response = {
            "connected": false
        }
    }
    res.status(200).send(response);
}

let loginPOST = function (sqlResult, {req, res, mail, password}) {
    if (sqlResult.length === 1) {
        promise3 = new Promise((resolve) => {
            mysqlRequest('UPDATE account SET session="' + req.session.session + '" WHERE mail="' + mail + '" AND password="' + password + '"');
            resolve();
        });
        promise3.then(() => {
            mysqlRequest('SELECT * FROM account WHERE session="' + req.session.session + '"', credentialsPOST, {req, res});
        });
    } else {
        mysqlRequest('SELECT * FROM account WHERE session="' + req.session.session + '"', credentialsPOST, {req, res});
    }
}

let updateSettings = function (results, {req, res}) {
    mysqlRequest('SELECT * FROM account WHERE session="' + req.session.session + '"', credentialsPOST, {req, res})
}

const mysqlRequest = (request, callback, arguments) => {
    con.query(request, (error, results) => {
        if (error)
            throw error;
        if (callback !== undefined) {
            callback(results, arguments);
        }
    });
};

const verifyCookie = (req, res) => {
    if (!req.session.session) {
        req.session.session = uuidv4();
    }
}

const promise2 = new Promise((resolve, reject) => {
    try {
        include["header"] = fs.readFileSync('include/header.html', 'utf8');
        resolve('Fichiers trouvés');
    } catch (err) {
        reject(err);
    }
})

Promise.all([promise1, promise2]).then((values) => {
    console.log(values);
    routing();
}).catch((reasons) => {
    console.warn('ERROR');
    console.error(reasons);
    process.exit(1);
});

let routing = () => {
    app.use(session({
            secret: 'daidnabfalhfafpa25d5',
            resave: false,
            store: sessionStore,
            saveUninitialized: false,
            cookie: {
                secure: false,
                expires: Date.now() + 30 * 24 * 60 * 60
            }

        }))
        .use(compression())
        .use(bodyParser.urlencoded({extended: false}))
        .use('/public', express.static(__dirname + '/public'))
        .use((req, res, next) => {
            verifyCookie(req, res);
            next();
        })
        .get('/', (req, res) => {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 'no-store, no-cache, private');
            res.setHeader('Keep-Alive', 'timeout=5, max=1000');
            res.status(200).send(include['header']);
        })
        .post('/request', (req, res) => {
            if (req.body.data === "credentials") {
                mysqlRequest('SELECT * FROM account WHERE session="' + req.session.session + '"', credentialsPOST, {req, res});
            } else {
                if (req.body.data === "login") {
                    let mail = req.body.mail;
                    let password = req.body.password;
                    mysqlRequest('SELECT * FROM account WHERE mail="' + mail + '" AND password="' + password + '"', loginPOST, {"req": req, "res": res, "mail": mail, "password": password});
                } else {
                    if (req.body.data === "disconnect") {
                        req.session.regenerate(() => {
                            mysqlRequest('SELECT * FROM account WHERE session="' + req.session.session + '"', credentialsPOST, {req, res});
                        });
                    } else {
                        if (req.body.data === "settings") {
                            mysqlRequest('UPDATE account SET searchengine="' + req.body.searchengine + '" WHERE session="' + req.session.session + '"', updateSettings, {req, res});
                        } else {
                            if(req.body.data === "signup"){

                            }else{
                                res.status(400).send("400");
                            }
                        }
                    }
                }
            }
        })
        .use((req, res) => {
            res.status(404).send('404');
        });
    app.listen(8080);
}
