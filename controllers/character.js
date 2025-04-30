
const fsPromises = require('fs').promises;
const path = require('path');

const data = {};
const Character = require('../model/classes/character')
data.characters = require('../model/characters.json');




const getAllCharacters = (req, res) => {
    res.json(data.characters);
}

const getSpecificCharacter = (req, res) => {
    res.json(data.characters.find(character => String(character.id) === String(req.params.id)));
    // res.json({"id": req.params.id})
}

const creatNewCharacter = (req, res) => {
    let character = new Character(
        req.body.name,
        req.body.level,
        req.body.power,
        req.body.health,
        req.body.weapon
    ).getJSON()
    character.id = data.characters.sort((char1, char2) => { char1.id < char2.id })[data.characters.length -1].id + 1
    data.characters.push(character);

    res.json(data.characters);
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
    creatNewCharacter,
    updateCharacter,
    deleteCharacter
}