const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

let _db;

const initDB = (callback = () => {
    if (_db) {
        console.log("DB Already exists.");
        return callback(null, _db);
    }
    const serviceAccount = require('../gamestore_key.json');
    
    initializeApp({
        credential: cert(serviceAccount)
    });
        _db = getFirestore();
});



const getDB = () => {
    if (!_db) {
        throw Error("DB not initialized")
    }
    return _db;
} 


module.exports = {
    initDB,
    getDB
}