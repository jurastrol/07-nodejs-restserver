// =========
//  Puerto
// =========
process.env.PORT = process.env.PORT || 3000;

// =========
//  Entorno
// =========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============
//  Base de datos
// ===============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://julufc6:hDNgr7ldeS0UmRoy@cluster0-jj1qq.mongodb.net/cafe';
}

process.env.URLDB = urlDB;