const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

/**
 * Registers a new user in the database.
 * Hashes the password before saving.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
exports.register = async (req, res) => {
  const {
    email,
    password,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    rol,
    institucionId,
  } = req.body;

  // Basic validation
  if (
    !email ||
    !password ||
    !nombre ||
    !apellidoPaterno ||
    !rol ||
    !institucionId
  ) {
    return res
      .status(400)
      .json({
        message: "Todos los campos requeridos deben ser proporcionados.",
      });
  }

  try {
    // Check if institution exists
    const institution = await prisma.institucion.findUnique({
      where: { id: institucionId },
    });
    if (!institution) {
      return res
        .status(404)
        .json({ message: "La institución especificada no existe." });
    }

    // Check if user already exists in the institution
    const existingUser = await prisma.usuario.findUnique({
      where: {
        institucionId_email: {
          institucionId: institucionId,
          email: email,
        },
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({
          message:
            "El correo electrónico ya está registrado en esta institución.",
        });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create full name
    const nombreCompleto = `${nombre} ${apellidoPaterno} ${
      apellidoMaterno || ""
    }`.trim();

    // Create user
    const newUser = await prisma.usuario.create({
      data: {
        email,
        passwordHash,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        nombreCompleto,
        rol,
        institucion: {
          connect: { id: institucionId },
        },
        // Default values from schema will be applied
        // e.g., status: PENDIENTE, requiereCambioPassword: true
      },
    });

    // Respond without the password hash
    const { passwordHash: _, ...userResponse } = newUser;
    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

/**
 * Logs a user in.
 * Validates credentials and returns a JWT.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
exports.login = async (req, res) => {
  const { email, password, institucionId } = req.body;

  if (!email || !password || !institucionId) {
    return res
      .status(400)
      .json({
        message: "Email, contraseña e ID de institución son requeridos.",
      });
  }

  try {
    // Find user by email and institution
    const user = await prisma.usuario.findUnique({
      where: {
        institucionId_email: {
          institucionId: institucionId,
          email: email,
        },
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // Check user status
    if (user.status !== "ACTIVO") {
      return res
        .status(403)
        .json({
          message: `El acceso del usuario está ${user.status}. Contacte al administrador.`,
        });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      // Optional: Implement failed login attempt tracking here
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // Create JWT payload
    const payload = {
      id: user.id,
      rol: user.rol,
      institucionId: user.institucionId,
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    // Update last access
    await prisma.usuario.update({
      where: { id: user.id },
      data: { ultimoAcceso: new Date() },
    });

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      user: {
        id: user.id,
        nombre: user.nombreCompleto,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
