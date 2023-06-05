const router = require("express").Router();
const { getUsers, getUser, createUser, updateUserInfo, updateAvatar } = require("../controllers/users");
const { getCards, createCard, deleteCard } = require("../controllers/cards");

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.post("/users", createUser);
router.patch("/users/me", updateUserInfo)
router.patch("/users/me/avatar", updateAvatar)

router.get('/cards', getCards)
router.post('/cards', createCard)
router.delete('/cards/:cardId', deleteCard)

module.exports = router;
