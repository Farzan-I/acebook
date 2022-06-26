const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

router.get("/", UsersController.Index);
router.get("/new", UsersController.New);
router.post("/", UsersController.Create);
router.post("/add-friend", UsersController.AddFriend);

module.exports = router;
