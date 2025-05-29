const app = require('express');
const router = app.Router();
const path = require('path');
const controller = require('../../controllers/userDetails');
const verifyJWT = require('../../middleware/verifyJWT');
// const ROLES_LIST = require('../../config/rolesList');
// const verifyRoles = require('../../middleware/verifyRoles');



router.route('/:id')
    .get(verifyJWT, controller.getUserData);
    // .post(verifyJWT, controller.createNewCharacter)
    // .put(verifyJWT, controller.updateCharacter)
    // .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), controller.deleteCharacter);

// router.route('/:id')
//     .get(verifyJWT, controller.getSpecificCharacter)
//     .delete(verifyJWT, controller.deleteCharacter);
    
module.exports = router;