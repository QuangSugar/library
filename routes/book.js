const router = require("express").Router();
const { bookController } = require("../controllers");
const { auth } = require("../middleware");
const { authAdmin } = require("../middleware");

// -------------------Manage Category------------------------

router.post(
  "/create-book",
  auth,
  authAdmin,
  bookController.createBook
);

router.get("/get-all-book", bookController.getAllBook);

router.get("/get-book/:id", bookController.getBook);

router.patch(
  "/update-book/:id",
  auth,
  authAdmin,
  bookController.updateBook
);

router.delete(
  "/delete-book/:id",
  auth,
  authAdmin,
  bookController.deleteBook
);

module.exports = router;
