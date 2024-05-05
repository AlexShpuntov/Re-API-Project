const { Router } = require("express");
const authController = require("../controllers/authController");
const currController = require("../controllers/currController");
const payController = require("../controllers/payController");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");
const router = Router();

router.get("*", checkUser);

router.get("/", (req, res) => res.render("home"));

router.get("/account", requireAuth, (req, res) => res.render("account"));

router.get("/edit", requireAuth, (req, res) => res.render("edit"));
router.put("/update-profile/:id", requireAuth, authController.update_profile);

router.get("/send-money", requireAuth, (req, res) => res.render("send-money"));
router.post("/send-money/:id", requireAuth, authController.send_money_post);

router.get("/checkout", requireAuth, (req, res) => res.render("checkout"));

router.get("/buy-currency", requireAuth, (req, res) => res.render("buy-currency"));
router.get("/convert", currController.get_currencies);

router.delete("/delete-account/:id", requireAuth, authController.delete_account);

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

router.get("/signin", authController.signin_get);
router.post("/signin", authController.signin_post);

router.get("/logout", requireAuth, authController.logout_get);

router.post('/buy-currency/pay/:id', requireAuth, payController.payment);

module.exports = router;