const router = require("express").Router();
const { companyController } = require("../controllers");
const { auth } = require("../middleware");
const { authAdmin } = require("../middleware");

// -------------------Manage Company------------------------

router.post(
  "/create-company",
  auth,
  authAdmin,
  companyController.createCompany
);

router.get("/get-all-company", companyController.getAllCompany);

router.get("/get-company/:id", companyController.getCompany);

router.patch(
  "/update-company/:id",
  auth,
  authAdmin,
  companyController.updateCompany
);

router.delete(
  "/delete-company/:id",
  auth,
  authAdmin,
  companyController.deleteCompany
);

module.exports = router;
