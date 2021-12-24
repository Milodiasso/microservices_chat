const router = require('express').Router();
const controller = require("../controllers/controllerCrud")

router.post("/create_chat", controller.createChat)

router.get("/channels", controller.channels)

router.get("/channel_master", controller.channel_master)

router.get("/channel/:name", controller.channel_id)

router.delete("/channel", controller.delete_channel)

router.get("/chat/:name", controller.chat)

router.post("/add_user", controller.addUser)

router.delete("/remove_user", controller.removeUser)

module.exports = router;
