const fireDB = require('../db/connect.js').getDB();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client also delete access token
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No Content
    
    const refreshToken = cookies.jwt;
    console.log(refreshToken);
    
    //Is refresh token in DB
    const allUsers = await fireDB.collection('users').get();
    let userFound = false;
    allUsers.forEach( data => {
        if (data.data().refreshToken === refreshToken) {
            userFound = data.data();
        }
    });
    if (!userFound) {
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        return res.sendStatus(204); // No Content
    }
    const userRef = fireDB.collection('users').doc(userFound.username);
    
    // Delete refresh token in DB
    userRef.set({...userFound, refreshToken: '' }, {merge: true});

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000}); // In production you also want to add the flag secure: true This only serves on https
    res.sendStatus(204);

}

module.exports = { handleLogout };