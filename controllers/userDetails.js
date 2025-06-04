const fireDB = require('../db/connect').getDB();


const getUserIfNotProvided = async (req, res) => {
    
        const cookies = req.cookies;
        
        if (!cookies?.jwt) return { status: 401, userFound: userFound };
        
        const refreshToken = cookies.jwt;
    
        const allUsers = await fireDB.collection('users').get();
        // if (!reqUser.exists) return res.sendStatus(403); // Forbidden
        let userFound = false;
        allUsers.forEach( data => {
            if (data.data().refreshToken === refreshToken) {
                userFound = data.data();
                console.log('============================USERFOUND=========================')
                console.log(userFound);
                console.log(userFound.userDataID);
            }
        });
        // const userFound = allUsers.find( data => data.data().refreshToken === refreshToken );
        if (!userFound) return {status: 403, userFound: undefined}; // Forbidden

        return { status: 200, userFound: userFound }
}


const getUserData = async (req, res) => {
    let id = req.params.id;
    const userDataRef = await fireDB.collection('userData').doc(id).get()
    
    if (!userDataRef.exists) return res.sendStatus('204') // No Content
    const userData = userDataRef.data();


    console.log('========================USER DATA RETRIEVED==================')
    console.log('userData', userData);
    res.json(userData);

}

const updateUserData = async (req, res) => {
    let id = req.params.id;
    let userData = req.body;

    console.log('========================USER DATA STOREABLE==================')
    console.log('userData', userData);
    console.log('id', id);

    if (!id || id === 'false') {
        
        let userResponse = await getUserIfNotProvided(req, res);
        if (userResponse.status !== 200) return res.sendStatus(response.status);

        if (!userResponse.userFound.userDataID) {

            let newID = crypto.randomUUID();


            // updateUser to have the new id

            userResponse.userFound.userDataID = newID;
            
            console.log('========================USER DATA NEW DATA==================');
            console.log(userResponse.userFound);
            let userCollection = fireDB.collection('users').doc(userResponse.userFound.username);
            let response = await userCollection.set(userResponse.userFound, {merge: true});

            id = newID;
            console.log('========================USER DATA ID==================');
            console.log(id)
        } else {
            id = userResponse.userFound.userDataID;
        }

    }
    
    const userDataRef = fireDB.collection('userData').doc(id);
    
    // Set data
    await userDataRef.set(userData, {merge: true});

    res.json({userData: userData, id: id});

}


module.exports = {
    getUserData,
    updateUserData
}