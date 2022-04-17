const router = require("express").Router();
const { authorController } = require("../controllers");
const { auth } = require("../middleware");
const { authAdmin } = require("../middleware");

// -------------------Manage Author------------------------

router.post(
  "/create-author",
  auth,
  authAdmin,
  authorController.createAuthor
);

router.get("/get-all-author", authorController.getAllAuthor);

router.get("/get-author/:id", authorController.getAuthor);

router.patch(
  "/update-author/:id",
  auth,
  authAdmin,
  authorController.updateAuthor
);

router.delete(
  "/delete-author/:id",
  auth,
  authAdmin,
  authorController.deleteAuthor
);

module.exports = router;
