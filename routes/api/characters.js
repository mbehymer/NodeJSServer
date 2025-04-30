const app = require('express');
const router = app.Router();
const path = require('path');
const controller = require('../../controllers/character');
const verifyJWT = require('../../middleware/verifyJWT');
const ROLES_LIST = require('../../config/rolesList');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
    .get(verifyJWT, controller.getAllCharacters)
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), controller.creatNewCharacter)
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),controller.updateCharacter)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), controller.deleteCharacter);

router.route('/:id')
    .get(verifyJWT, controller.getSpecificCharacter)
.delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), controller.deleteCharacter);
    
module.exports = router;