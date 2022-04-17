const router = require('express').Router()
const {uploadImage} = require('../middleware')
const {uploadController} = require('../controllers')
const {auth} = require('../middleware')

router.post("/upload_avatar", uploadImage, auth, uploadController.uploadAvatar);

module.exports = router