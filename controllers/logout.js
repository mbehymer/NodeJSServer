const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client also delete access token
    console.log(req.cookies);
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No Content
    
    const refreshToken = cookies.jwt;
    console.log(refreshToken);
    
    //Is refresh token in DB
    const userFound = usersDB.users.find( data => data.refreshToken === refreshToken );
    if (!userFound) {
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        return res.sendStatus(204); // No Content
    }
    
    // Delete refresh token in DB
    const otherUsers = usersDB.users.filter( data => data.refreshToken !== userFound.refreshToken);
    const currentUser = {...userFound, refreshToken: ''}
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000}); // In production you also want to add the flag secure: true This only serves on https
    res.sendStatus(204);

}

module.exports = { handleLogout };