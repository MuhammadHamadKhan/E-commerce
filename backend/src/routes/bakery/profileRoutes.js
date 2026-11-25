const { Router } = require("express");
const { getMyProfile, updateMyProfile } = require("../../controllers/bakery/profileController");

const router = Router();

router.get("/", getMyProfile);
router.put("/", updateMyProfile);

module.exports = router;
