const fireDB = require('../db/connect').getDB();



const getUserData = async (req, res) => {
    let id = req.params.id;
    const userDataRef = await fireDB.collection('userData').doc(id).get()
    
    if (!userDataRef.exists) return res.sendStatus('204') // No Content
    const userData = userDataRef.data();


    console.log('========================USER DATA RETRIEVED==================')
    console.log('userData', userData);
    res.json(userData);

}



module.exports = {
    getUserData
}