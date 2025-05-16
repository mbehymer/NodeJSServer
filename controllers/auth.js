const fireDB = require('../db/connect.js').getDB();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    console.log('===================== LOGIN =====================');
    // console.log('req',req.body);
    const { user, pwd} = req.body;
    if (!user || !pwd) return res.sendStatus(400).json({'message': 'Username and password are required.'});

    const userRef = fireDB.collection('users').doc(user);
    const reqUser =  await userRef.get();
    if (!reqUser.exists) return res.sendStatus(401); // Unauthorized
    const userFound = reqUser.data();
    // Evaluate password
    const match = await bcrypt.compare(pwd, userFound.password);
    
    if (match) {
        const roles = Object.values(userFound.roles);

        // create JWTs which are your tokens
        const accessToken = jwt.sign(
            { 
              "UserInfo": {
                    "username": userFound.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m'}
        ); // Dont pass in  sensitive data like passwords and the like. We will need to pass something in that is identifiable thus the username.
        const refreshToken = jwt.sign(
            { "username": userFound.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        ); // Dont pass in  sensitive data like passwords and the like. We will need to pass something in that is identifiable thus the username.
        
        //Saving refresh token with current user
        const currentUser = { ...userFound, refreshToken};
        userRef.set(currentUser, {merge: true});
        //We don't want to send the token in a place that can be accessed by JavaScript, so not in LOCAL STORAGE or in COOKIEs. Rather you want to store it in the memory. One thing we can do is set the COOKIE as HTTP Only and this will make it not accessible to JavaScript
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000}); // 24 for hours, 60 for minutes, 60 for seconds, 1000 for milliseconds, thus total being one day.

        res.json({ accessToken })
        // res.json({ 'success' : `User ${user} is logged in! `});

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };