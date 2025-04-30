const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    // console.log('refreshToken - req',req);
    // for (let key in cookies) {
    //     console.log('key', key);
    //     console.log('value', cookies[key]);
    // }
    console.log('refreshToken - cookies', cookies);
    if (!cookies?.jwt) return res.sendStatus(401);
    
    console.log("COOKIES", cookies.jwt);

    const refreshToken = cookies.jwt;

    usersDB.users.forEach(user => {
        console.log('user', user);
        console.log('userRefToken', user.refreshToken);
        console.log('refToken', refreshToken);

        console.log(user.refreshToken, '===', refreshToken);
    });

    const userFound = usersDB.users.find( data => data.refreshToken === refreshToken );
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
                { expiresIn: '30s'}
            )

            res.json({ accessToken });
        }
    );


}

module.exports = { handleRefreshToken };