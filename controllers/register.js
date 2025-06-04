const fireDB = require('../db/connect.js').getDB();

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd} = req.body;
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password are required.'});

    //check for duplicate usernames in the db
    
    const userRef = fireDB.collection('users').doc(user);
    const reqUser =  await userRef.get();
    if (reqUser.exists) return res.sendStatus(409); //Conflict

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10); // 10 rounds of salt which is the default
        //store the new user
        const newUser = { 
            "username": user, 
            "roles": {
                "User": 1010
            },
            "password": hashedPwd 
        }

        await userRef.set(newUser); // I don't set merge to true as this should be a new user


        return res.status(201).json({ 'success': `New user ${user} created!`});
    } catch (err) {
        return res.status(500).json({ 'message': err.message });
    }
};

module.exports = { handleNewUser }