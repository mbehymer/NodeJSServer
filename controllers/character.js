
const fsPromises = require('fs').promises;
const path = require('path');

const data = {};
const Character = require('../model/classes/character');
data.characters = require('../model/characters.json');
const fireDB = require('../db/connect').getDB();



const getAllCharacters = async (req, res) => {
    const allCharacters = await fireDB.collection('characters').get();
    let characterList = [];
    allCharacters.forEach(character => {
        characterList.push(character.data());
    });
    res.json(characterList);

}

const getSpecificCharacter = (req, res) => {
    res.json(data.characters.find(character => String(character.id) === String(req.params.id)));
    // res.json({"id": req.params.id})
}

const createNewCharacter = (req, res) => {
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
    console.log('============================== CHARACTER ==============================')
    console.log('req', req.body);
    let { character } = req.body;
    // character.id = data.characters.sort((character1, character2) => { character1.id < character2.id })[data.characters.length -1].id + 1
    // data.characters.push(character);
    let index = data.characters.findIndex(char => char.id === Number(character.id));
    data.characters[index] = character;
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'characters.json'),
        JSON.stringify(data.characters)
    );

    res.json(data.characters);
}

const deleteCharacter = (req, res) => {
    console.log(req.params.id);
    let index = data.characters.findIndex((character) => { String(character.id) === String(req.params.id) });
    console.log(index);
    console.log(data.characters[index]);
    console.log(data.characters.splice(index));
    res.json(data.characters);
}

module.exports = {
    getAllCharacters,
    getSpecificCharacter,
    createNewCharacter,
    updateCharacter,
    deleteCharacter
}