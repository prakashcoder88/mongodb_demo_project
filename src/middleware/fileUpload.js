const multer = require("multer");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    var ext = file.originalname.split(".");
    cb(null, Date.now() + "." + ext[ext.length - 1]);
  },
});
var upload = multer({ storage: storage }).single("profileImage");

module.exports = function (req, res, next) {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send("Something went wrong!");
    }
    if (req.file) {
      var path = req.file.filename;

      req.fileurl = path;
      next();
    } else {
      if (req.fileurl) {
        req.fileurl = req.body.img;
        next();
      } else {
        req.fileurl = "";
        next();
      }
    }
  });
};
