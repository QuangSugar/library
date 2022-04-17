const router = require("express").Router();

router.use("/user", require("./userRouter"));

router.use("/category", require("./category"));

router.use("/author", require("./author"));

router.use("/company", require("./company"));

router.use("/book", require("./book"));

router.use("/auth", require("./auth"));

router.use("/admin", require("./adminRouter"));

router.use("/upload", require("./upload"));

module.exports = router;
