
const fireDB = require('../db/connect.js').getDB();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    
    if (!cookies?.jwt) return res.sendStatus(401);
    
    const refreshToken = cookies.jwt;

    const allUsers = await fireDB.collection('users').get();
    // if (!reqUser.exists) return res.sendStatus(403); // Forbidden
    let userFound = false;
    allUsers.forEach( data => {
        if (data.data().refreshToken === refreshToken) {
            userFound = data.data();
        }
    });
    // const userFound = allUsers.find( data => data.data().refreshToken === refreshToken );
    if (!userFound) return res.sendStatus(403); // Forbidden

    // Evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || userFound.username !== decoded.username) return res.sendStatus(403); //Forbidden
            const roles = Object.values(userFound.roles)
            const accessToken = jwt.sign(
                    { 
                        "UserInfo": {
                            "username": userFound.username,
                            "roles": roles
                        }
                    },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m'}
            )

            res.json({ accessToken: accessToken, role: userFound.roles['Admin'] === 1030 ? 'A' : userFound.roles['Editor'] === 1020 ? 'E' : 'U' });
        }
    );


}

module.exports = { handleRefreshToken };