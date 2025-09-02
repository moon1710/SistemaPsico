#!/usr/bin/env node
/**
 * Smoke test API-only: register -> profile -> login -> profile
 * Verifica que /login actualice lastLogin sin conectarse directo a MySQL.
 * Requiere: npm i axios dotenv
 */

const path = require("path");
const dotenv = require("dotenv");

// Cargar .env (intenta raíz y luego /scripts)
let loaded = dotenv.config({ path: path.resolve(__dirname, "../.env") });
if (!loaded.parsed)
  loaded = dotenv.config({ path: path.resolve(__dirname, "./.env") });

// --- Config ---
const BASE_URL = process.env.BASE_URL || "http://localhost:4000";
const INSTITUCION_ID = String(process.env.TEST_INSTITUCION_ID || "1");
const PASSWORD = process.env.SEED_PASSWORD || "Demo1234*";

const axios = require("axios").create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

(async () => {
  const ts = Date.now();
  const email = `test${ts}@une.edu`;

  console.log("=== Smoke test: registro → login → profile (API-only) ===");
  console.log({
    BASE_URL,
    TEST_ROLE: "ESTUDIANTE",
    TEST_INSTITUCION_ID: INSTITUCION_ID,
    email,
  });

  // 1) Registro
  console.log("\n→ 1) Registrando usuario...");
  let regUser, token1;
  try {
    const { data } = await axios.post("/api/auth/register", {
      nombre: "Test",
      apellidoPaterno: "Smoke",
      email,
      password: PASSWORD,
      rol: "ESTUDIANTE",
      institucionId: INSTITUCION_ID,
      carreraId: null,
    });
    token1 = data?.data?.accessToken;
    regUser = data?.data?.user;
    console.log("✅ Registro OK");
  } catch (e) {
    console.error(
      "❌ Registro falló:",
      e.response?.status,
      e.response?.data || e.message
    );
    process.exit(1);
  }

  // 2) Profile post-register (lastLogin debe estar null)
  console.log("\n→ 2) Profile después de registro...");
  let lastLoginBefore = null;
  try {
    const { data } = await axios.get("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token1}` },
    });
    lastLoginBefore = data?.data?.lastLogin ?? null;
    console.log(
      "✅ Profile OK (post-register). perfilCompletado:",
      data?.data?.perfilCompletado
    );
    console.log("   lastLogin (antes de login):", lastLoginBefore);
  } catch (e) {
    console.error(
      "❌ Profile post-register falló:",
      e.response?.status,
      e.response?.data || e.message
    );
    process.exit(1);
  }

  // 3) Login (debe disparar UPDATE lastLogin = NOW())
  console.log("\n→ 3) Login...");
  let token2;
  try {
    const { data } = await axios.post("/api/auth/login", {
      email,
      password: PASSWORD,
      institucionId: INSTITUCION_ID,
    });
    token2 = data?.data?.accessToken;
    console.log("✅ Login OK");
  } catch (e) {
    console.error(
      "❌ Login falló:",
      e.response?.status,
      e.response?.data || e.message
    );
    process.exit(1);
  }

  // 4) Profile post-login (lastLogin debe estar definido y diferente)
  console.log("\n→ 4) Profile después de login...");
  try {
    const { data } = await axios.get("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token2}` },
    });
    const lastLoginAfter = data?.data?.lastLogin ?? null;
    console.log("✅ Profile OK (post-login).");
    console.log("   lastLogin (antes):", lastLoginBefore);
    console.log("   lastLogin (después):", lastLoginAfter);

    if (!lastLoginAfter) {
      console.error(
        "⚠️ lastLogin sigue NULL. Revisa el UPDATE en /api/auth/login."
      );
      process.exitCode = 1;
    } else {
      console.log("🎯 lastLogin actualizado correctamente.");
    }
  } catch (e) {
    console.error(
      "❌ Profile post-login falló:",
      e.response?.status,
      e.response?.data || e.message
    );
    process.exit(1);
  }
})().catch((e) => {
  console.error("❌ Error general:", e?.message || e);
  process.exit(1);
});
