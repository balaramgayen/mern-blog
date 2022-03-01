const jwt = require("jsonwebtoken");

//user authorization middleware
exports.authorization = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token)
    return res
      .status(403)
      .send({ message: "you have not proper permission to access this" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(403).send(error);
  }
};
