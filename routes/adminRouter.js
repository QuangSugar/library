const router = require("express").Router();
const { userController,categoryController } = require("../controllers");
const { auth } = require("../middleware");
const { authAdmin } = require("../middleware");

// -------------------Manage user-----------------------

router.get("/all-infor", auth, authAdmin, userController.getUsersAllInfor);

router.patch(
  "/update_role/:id",
  auth,
  authAdmin,
  userController.updateUsersRole
);

router.delete("/delete/:id", auth, authAdmin, userController.deleteUser);

router.patch("/accept-borrow/:id", auth, authAdmin, userController.acceptBorrowBook);

router.patch("/cancel-borrow/:id", auth, authAdmin, userController.cancelBorrowBook);

router.get("/all-order", auth, authAdmin, userController.getAllOrder);

router.get("/check-date-borrow", auth, authAdmin, userController.checkDateBorrow);

router.get(
  "/toggle-active-user/:id",
  auth,
  authAdmin,
  userController.toggleUser
);





module.exports = router;
