/**
 * script-test-quizzes.js
 * node script-test-quizzes.js
 *
 * Requisitos:
 *   npm i axios jsonwebtoken
 *
 * Variables de entorno opcionales:
 *   API_BASE=http://localhost:4000
 *   AUTH_LOGIN_PATH=/api/auth/login
 */

const axios = require("axios");
const jwt = require("jsonwebtoken");

// ---------------- Config ----------------
const API_BASE = process.env.API_BASE || "http://localhost:4000";
const AUTH_LOGIN_PATH = process.env.AUTH_LOGIN_PATH || "/api/auth/login";
const QUIZZES_BASE = "/api/quizzes";

// Cuentas proporcionadas
const PASSWORD = "Demo1234*";
const USERS = {
  student: "estudiante.1756854575024@demo.edu",
  staff: "admin_institucion.1756854575024@demo.edu",
  // Si quieres probar otras:
  // orientador: "orientador.1756854575024@demo.edu",
  // psicologo: "psicologo.1756854575024@demo.edu",
  // super: "super_admin_nacional.1756854575024@demo.edu",
};

// ----------- Util: cliente axios con logs -----------
function makeClient(baseURL) {
  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    timeout: 20000,
  });

  instance.interceptors.request.use((config) => {
    const url = `${config.baseURL || ""}${config.url || ""}`;
    console.log(
      `\n➡️  [${String(config.method || "GET").toUpperCase()}] ${url}`
    );
    if (config.headers?.Authorization)
      console.log("   🔑 Authorization: Bearer <token>");
    if (config.data) {
      const preview = JSON.stringify(config.data);
      console.log(
        "   📦 Body:",
        preview.length > 500 ? preview.slice(0, 500) + " ..." : preview
      );
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => {
      // Mostrar resumen breve
      const { status, data } = res;
      let summary = data;
      try {
        summary = JSON.stringify(data);
        summary =
          summary.length > 800 ? summary.slice(0, 800) + " ..." : summary;
      } catch (_) {}
      console.log(`✅ Respuesta ${status}:`, summary);
      return res;
    },
    (err) => {
      if (err.response) {
        console.error(
          `❌ Error ${err.response.status}:`,
          typeof err.response.data === "object"
            ? JSON.stringify(err.response.data)
            : err.response.data
        );
      } else {
        console.error("💥 Error de request:", err.message);
      }
      throw err;
    }
  );

  return instance;
}

const http = makeClient(API_BASE);

// ----------- Login helper -----------
async function login(email, password) {
  console.log(`\n🔐 Login de ${email} ...`);
  const { data } = await http.post(AUTH_LOGIN_PATH, { email, password });
  // se asume data.data.accessToken
  const token = data?.data?.accessToken || data?.accessToken || data?.token;
  if (!token)
    throw new Error("No se recibió accessToken en la respuesta de login");
  console.log("   ✅ Token recibido.");

  let payload;
  try {
    payload = jwt.decode(token);
    console.log("   👤 Payload JWT:", {
      id: payload?.id,
      rol: payload?.rol,
      institucionId: payload?.institucionId,
      email: payload?.email,
    });
  } catch (_) {
    console.log("   (No se pudo decodificar el JWT; continuo de todos modos)");
  }

  return { token, payload };
}

// ----------- Helpers de prueba -----------
async function getPublicQuizzes(token) {
  const { data } = await http.get(`${QUIZZES_BASE}/public`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data || [];
}

async function getQuizDetail(token, quizId) {
  const { data } = await http.get(`${QUIZZES_BASE}/${quizId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data || {};
}

function buildDummyAnswers(preguntas) {
  // genera respuestas 0..3 (por ejemplo, todo 1 o aleatorio)
  return preguntas.map((p) => ({
    preguntaId: p.id,
    // valor: 1,
    valor: Math.floor(Math.random() * 4), // random 0..3
  }));
}

async function submitQuiz(token, quizId, respuestas) {
  const body = {
    respuestas,
    consentimientoAceptado: true,
    tiempoInicio: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // hace 3min
  };
  const { data } = await http.post(`${QUIZZES_BASE}/${quizId}/submit`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data || {};
}

async function getMyResults(token) {
  const { data } = await http.get(`${QUIZZES_BASE}/me/results`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data || [];
}

async function getInstitutionResults(token, opts = {}) {
  // Intento 1: sin institucionId (si tu middleware resuelve desde el JWT, funcionará)
  try {
    const { data } = await http.get(`${QUIZZES_BASE}/resultados`, {
      headers: {
        Authorization: `Bearer ${staff.token}`,
        "x-institution-id": "1", // 👈 fuerza institución
      },
      params: {
        codigo: opts.codigo || undefined,
        severidad: opts.severidad || undefined,
        page: 1,
        pageSize: 10,
      },
    });
    return data?.data || [];
  } catch (err) {
    // Si falla por 400 (falta institucionId), hacemos fallback con institucionId=1
    if (err.response && err.response.status === 400) {
      console.log(
        "↩️ Reintentando resultados con institucionId=1 (fallback)..."
      );
      const { data } = await http.get(`${QUIZZES_BASE}/resultados`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          institucionId: opts.institucionId || 1,
          codigo: opts.codigo || undefined,
          severidad: opts.severidad || undefined,
          page: 1,
          pageSize: 10,
        },
      });
      return data?.data || [];
    }
    throw err;
  }
}

// ----------- Flujo principal -----------
async function main() {
  try {
    console.log("🚀 Iniciando pruebas end-to-end del módulo de quizzes...");

    // 1) Login estudiante y staff
    const student = await login(USERS.student, PASSWORD);
    const staff = await login(USERS.staff, PASSWORD);

    // 2) Obtener quizzes públicos (con estudiante)
    const quizzes = await getPublicQuizzes(student.token);
    if (!quizzes.length) {
      console.log(
        "⚠️ No hay quizzes públicos. Revisa seeds/flags (publico=1, activo=1)."
      );
      return;
    }
    console.log(`📚 Quizzes públicos: ${quizzes.length}`);
    const selectedQuiz = quizzes[0];
    console.log(
      `🎯 Seleccionado: ${selectedQuiz.titulo} [${selectedQuiz.codigo}] (${selectedQuiz.id})`
    );

    // 3) Obtener detalle de quiz y preguntas
    const detail = await getQuizDetail(student.token, selectedQuiz.id);
    const preguntas = detail?.preguntas || [];
    console.log(`📝 Preguntas del quiz: ${preguntas.length}`);
    if (!preguntas.length) {
      console.log(
        "⚠️ El quiz no tiene preguntas. Inserta seeds en la tabla 'preguntas'."
      );
      return;
    }

    // 4) Enviar respuestas (dummy)
    const respuestas = buildDummyAnswers(preguntas);
    const submitResult = await submitQuiz(
      student.token,
      selectedQuiz.id,
      respuestas
    );
    console.log("📊 Submit OK:", submitResult);

    // 5) Ver resultados del estudiante
    const myResults = await getMyResults(student.token);
    console.log(`👤 Mis resultados (${USERS.student}):`, myResults);

    // 6) Ver resultados institucionales (staff)
    const instResults = await getInstitutionResults(staff.token, {
      codigo: selectedQuiz.codigo, // filtra por el quiz elegido
      // institucionId: 1, // si quieres forzar siempre
    });
    console.log(`🏫 Resultados institucionales (${USERS.staff}):`, instResults);

    console.log("\n🎉 Flujo completado sin errores.");
  } catch (err) {
    console.error("\n🚨 Falló el flujo de pruebas:", err?.message || err);
  }
}

main();
