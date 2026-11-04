// Vérifications locales sans afficher de secrets ni lire le contenu des dossiers.
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const problems = [];
if (process.env.NODE_ENV === "production") {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) problems.push("SESSION_SECRET doit contenir au moins 32 caractères en production.");
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) problems.push("Définissez ADMIN_USERNAME et ADMIN_PASSWORD via un gestionnaire de secrets.");
  if (String(process.env.ADMIN_PASSWORD || "").toLowerCase().includes("change-this")) problems.push("Le mot de passe administrateur par défaut est interdit en production.");
  if (!process.env.BASE_URL || !process.env.BASE_URL.startsWith("https://")) problems.push("BASE_URL doit être une URL HTTPS en production.");
}
const uploadDir = path.join(__dirname, "..", "data", "private-uploads");
if (fs.existsSync(path.join(__dirname, "..", "public", "private-uploads"))) problems.push("Un dossier d'uploads privé ne doit pas être placé sous public/.");
if (problems.length) {
  for (const problem of problems) console.error(`ERREUR: ${problem}`);
  process.exitCode = 1;
} else {
  console.log("Contrôles préalables réussis pour l'environnement courant. Cela ne remplace pas les tests d'intégration.");
}
