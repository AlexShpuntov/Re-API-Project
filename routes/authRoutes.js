const { Router } = require("express");
const authController = require("../controllers/authController");
const currController = require("../controllers/currController");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");
const router = Router();

router.get("*", checkUser);

router.get("/", (req, res) => res.render("home"));

router.get("/account", requireAuth, (req, res) => res.render("account"));

router.get("/edit", requireAuth, (req, res) => res.render("edit"));

router.get("/send-money", requireAuth, (req, res) => res.render("send-money"));

router.get("/checkout", requireAuth, (req, res) => res.render("checkout"));

router.get("/buy-currency", requireAuth, (req, res) => res.render("buy-currency"));

router.delete("/delete-account/:id", requireAuth, authController.delete_account);

router.put("/update-profile/:id", requireAuth, authController.update_profile);

router.get("/convert", currController.get_currencies);

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

router.get("/signin", authController.signin_get);
router.post("/signin", authController.signin_post);

router.get("/logout", authController.logout_get);

module.exports = router;