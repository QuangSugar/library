const router = require("express").Router();
const { userController } = require("../controllers");
const { auth } = require("../middleware");
const { authAdmin } = require("../middleware");

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/refresh-token", userController.getAccessToken);

router.post("/forgot", userController.forgotPassword);

router.post("/reset", auth, userController.resetPassword);

router.get("/logout", userController.logout);

// Social Login
router.post("/google_login", userController.googleLogin);

router.post("/facebook_login", userController.facebookLogin);

module.exports = router;
