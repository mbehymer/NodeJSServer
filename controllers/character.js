
const fsPromises = require('fs').promises;
const path = require('path');

// const data = {};
const Character = require('../model/classes/character');
// data.characters = require('../model/characters.json');
const fireDB = require('../db/connect').getDB();



const getAllCharacters = async (req, res) => {
    const allCharacters = await fireDB.collection('characters').get();
    let characterList = [];
    allCharacters.forEach(character => {
        characterList.push(character.data());
    });
    res.json(characterList);

}

const getSpecificCharacter = async (req, res) => {

    console.log('========================== GET SPECIFIC CHARACTER ==============================')
    console.log('req', req.params);
    let id = req.params.id;
    
    // TODO Find a way to only edit the fields in question...
    let character = await fireDB.collection('characters').doc(id).get();
    // co
    console.log('character',character.data());
    res.json(character.data());
    // res.json({"id": req.params.id})
}

const createNewCharacter = (req, res) => {
    console.log('============================== CHARACTER CREATE ==============================')
    console.log('req', req.body);
    let character = new Character(
        req.body.character.name,
        req.body.character.level,
        req.body.character.power,
        req.body.character.health,
        req.body.character.weapon
    ).getJSON()
    console.log(req.body.character);
    const uniqueID = crypto.randomUUID();
    const characterRef = fireDB.collection('characters').doc(uniqueID);
    character.id = uniqueID;
    // data.characters.push(character);
    characterRef.set(character);

    res.json(character);
}


const updateCharacter = async (req, res) => {
    console.log('============================== CHARACTER UPDATE ==============================')
    console.log('req', req.body);
    let { character } = req.body;
    // TODO Find a way to only edit the fields in question...
    let characterRef = fireDB.collection('characters').doc(character.id);
    let response = await characterRef.set(character, {merge: true});
    console.log('==== response ====', response);
    
    res.json(character);
}

const deleteCharacter = async (req, res) => {
    console.log(req.params.id);
    // let index = data.characters.findIndex((character) => { String(character.id) === String(req.params.id) });
    // console.log(index);
    // console.log(data.characters[index]);
    // console.log(data.characters.splice(index));
    
    let id = req.params.id;
    
    // TODO Find a way to only edit the fields in question...
    let characterRef = fireDB.collection('characters').doc(id);
    let response = await characterRef.delete(); // THIS WILL NOT DELETE SUBCOLLECTIONS!!
    console.log('==== response ====', response);
    
    res.json({id});
}

module.exports = {
    getAllCharacters,
    getSpecificCharacter,
    createNewCharacter,
    updateCharacter,
    deleteCharacter
}