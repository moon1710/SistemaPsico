const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Protects routes by verifying JWT.
 * Attaches the user object to the request if authentication is successful.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "No autorizado. Se requiere un token." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await prisma.usuario.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return res
        .status(401)
        .json({
          message: "El usuario perteneciente a este token ya no existe.",
        });
    }

    // Check if user is active
    if (currentUser.status !== "ACTIVO") {
      return res.status(403).json({ message: "El usuario no está activo." });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};

/**
 * Restricts access to specific roles.
 * Must be used after the 'protect' middleware.
 * @param {...string} roles - The roles allowed to access the route.
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        message: "No tiene permiso para realizar esta acción.",
      });
    }
    next();
  };
};
