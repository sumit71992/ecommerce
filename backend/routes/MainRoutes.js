const express = require("express");
const mainController = require("../controller/MainController");
const postController = require("../controller/PostController");
const middle = require("../controller/middle");
const router = express.Router();
const app = express();
const path = require("path");
const multer = require("multer");



//MULTER START

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname + "../../../client/assets/images/uploads"));
  },
  filename: (req, file, cb) => {
      console.log(file);
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  console.log("multer file filter")
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}
let upload  = multer({ storage: storage , fileFilter : fileFilter });

//MULTER END
/**********************************************LOAD PAGE*************************************************
 ******************************************************************************************************/
router.route("/").get(middle.notloggedin,mainController.product, mainController.index);
router.route("/index").get(middle.notloggedin,mainController.product, mainController.index);
router.route("/cart").get( mainController.cart);
router.route("/logout").get(middle.notloggedin, mainController.logout);
router.route("/myorder").get(middle.notloggedin, postController.myorder, mainController.myorder);





router.route("/login").get(middle.loggedin, mainController.login);
router.route("/signup").get(middle.loggedin, mainController.signup);
router.route("/seller").get(middle.notloggedin, mainController.seller);






/**********************************************POST METHOD*************************************************
 ******************************************************************************************************/
router.route("/signup").post(middle.loggedin, postController.signup);
router.route("/login").post(middle.loggedin, postController.login);
router.route("/add").post(middle.notloggedin, upload.single("Image"), postController.add);
router.route("/update-cart").post(middle.notloggedin, postController.update);
router.route("/checkout").post(middle.notloggedin, postController.order);



router.route("/clearToaster").put(middle.clearToaster);

module.exports = router;