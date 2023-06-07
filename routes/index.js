const router = require("express").Router();
const userRoutes = require("./users");
const cardRoutes = require("./cards");

router.use("/*", (req, res) =>
  res.status(404).send({ message: "Страница не найдена" })
);
router.use(userRoutes);
router.use(cardRoutes);

module.exports = router;
