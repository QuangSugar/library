const router = require("express").Router();
const { categoryController } = require("../controllers");
const { auth } = require("../middleware");
const { authAdmin } = require("../middleware");


// -------------------Manage Category------------------------

router.post(
  "/create-category",
  auth,
  authAdmin,
  categoryController.createCategory
);

router.get("/get-all-category", categoryController.getAllCategory);

router.get("/get-category/:id", categoryController.getCategory);

router.patch(
  "/update-category/:id",
  auth,
  authAdmin,
  categoryController.updateCategory
);

router.delete("/delete-category/:id", auth, authAdmin, categoryController.deleteCategory);

module.exports = router;
