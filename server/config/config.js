// ========================
// PORT
// ========================

process.env.PORT = process.env.PORT || 8000;


// ========================
// ENVIROMENT
// ========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ========================
// DATABASE
// ========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;