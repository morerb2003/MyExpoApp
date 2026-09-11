const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getAllMembers);
router.post('/', teamController.addMember);

router.get('/:id', teamController.getMemberById);
router.put('/:id', teamController.updateMember);
router.delete('/:id', teamController.deleteMember);

module.exports = router;
