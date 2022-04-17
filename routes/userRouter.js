const router = require('express').Router()
const {userController} = require('../controllers')
const {auth} = require('../middleware')

router.get('/infor', auth, userController.getUserInfor)

router.patch('/update', auth, userController.updateUser)

router.post("/borrow-book", auth, userController.borrowBook);

router.get("/get-order-by-user/:id", auth, userController.getOrderByUser);

router.patch("/give-back/:id", auth, userController.giveBookBack);


module.exports = router