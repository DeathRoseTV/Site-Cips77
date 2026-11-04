require("dotenv").config();
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const Stripe = require("stripe");
const multer = require("multer");
const crypto = require("crypto");
const SERVICES = require("./src/config/services");
const { readBookings, writeBookings } = require("./src/db/registrations");
const { clean, isValidDate } = require("./src/utils/validation");
const requireAdmin = require("./src/middleware/require-admin");
const contentStore = require("./src/db/content");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const DATA_DIR = path.join(__dirname, "data");
const UPLOAD_DIR = path.join(DATA_DIR, "private-uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;



app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));

// Stripe webhook: must receive the untouched request body to verify its signature.
// Configure STRIPE_WEBHOOK_SECRET in .env before relying on webhook confirmations.
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).send("Stripe webhook is not configured.");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature error:", err.message);
    return res.status(400).send("Invalid Stripe signature.");
  }

  const checkout = event.data.object;
  const bookingId = checkout.metadata && checkout.metadata.bookingId;
  if (bookingId && [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.expired",
    "checkout.session.async_payment_failed"
  ].includes(event.type)) {
    const bookings = readBookings();
    const booking = bookings.find(item => item.id === bookingId && item.stripeSessionId === checkout.id);
    if (booking) {
      if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)
          && checkout.payment_status === "paid") {
        booking.paymentStatus = "paid";
        booking.status = "confirmed";
      } else if (["checkout.session.expired", "checkout.session.async_payment_failed"].includes(event.type)
          && booking.paymentStatus !== "paid") {
        booking.paymentStatus = "unpaid";
        booking.status = "cancelled";
      }
      writeBookings(bookings);
    }
  }

  return res.json({ received: true });
});

app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: false, limit: "30kb" }));
app.use(session({
  name: "educanin.sid",
  secret: process.env.SESSION_SECRET || "development-only-change-this-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 8 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 3 },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set(["application/pdf", "image/jpeg", "image/png"]);
    if (!allowed.has(file.mimetype)) return cb(new Error("Format refusé : utilisez un PDF, JPG ou PNG."));
    cb(null, true);
  }
});
app.get("/api/config", (req, res) => {
  res.json({
    paymentEnabled: Boolean(stripe),
    services: Object.entries(SERVICES).map(([id, s]) => ({ id, ...s })),
    location: "Cesson et Vert-Saint-Denis (77240)"
  });
});

app.get("/api/slots", (req, res) => {
  const date = clean(req.query.date, 10);
  if (!isValidDate(date)) return res.status(400).json({ error: "Date invalide." });
  const allSlots = ["10:00", "10:30"];
  const taken = readBookings()
    .filter(b => b.date === date && !["cancelled"].includes(b.status))
    .map(b => b.time);
  res.json({ slots: allSlots.filter(t => !taken.includes(t)) });
});

app.post("/api/bookings", upload.fields([{ name: "medicalCertificate", maxCount: 1 }, { name: "insurance", maxCount: 1 }, { name: "healthAttestation", maxCount: 1 }]), async (req, res) => {
  const name = clean(req.body.name, 100);
  const secondParent = clean(req.body.secondParent, 100);
  const address = clean(req.body.address, 200);
  const postalCode = clean(req.body.postalCode, 10);
  const city = clean(req.body.city, 100);
  const homePhone = clean(req.body.homePhone, 40);
  const otherParentPhone = clean(req.body.otherParentPhone, 40);
  const email = clean(req.body.email, 160);
  const phone = clean(req.body.phone, 40);
  const childName = clean(req.body.childName, 100);
  const childFirstName = clean(req.body.childFirstName, 100);
  const gender = clean(req.body.gender, 1);
  const school = clean(req.body.school, 120);
  const className = clean(req.body.className, 40);
  const memberType = clean(req.body.memberType, 20);
  const healthNotes = clean(req.body.healthNotes, 1500);
  const emergencyName = clean(req.body.emergencyName, 120);
  const emergencyFirstName = clean(req.body.emergencyFirstName, 120);
  const emergencyHomePhone = clean(req.body.emergencyHomePhone, 40);
  const emergencyPhone = clean(req.body.emergencyPhone, 40);
  const healthAnswers = clean(req.body.healthAnswers, 3);
  const signatureName = clean(req.body.signatureName, 160);
  const signatureDate = clean(req.body.signatureDate, 10);
  const emergencyAddress = clean(req.body.emergencyAddress, 200);
  const emergencyWorkPhone = clean(req.body.emergencyWorkPhone, 40);
  const doctorName = clean(req.body.doctorName, 120);
  const doctorPhone = clean(req.body.doctorPhone, 40);
  const photoConsent = clean(req.body.photoConsent, 3);
  const rulesAccepted = req.body.rulesAccepted === "yes";
  const dataNoticeAccepted = req.body.dataNoticeAccepted === "yes";
  const childBirthDate = clean(req.body.childBirthDate, 10);
  const commune = clean(req.body.commune, 120);
  const serviceId = clean(req.body.service, 30);
  const childRank = Math.min(3, Math.max(1, Number.parseInt(req.body.childRank || "1", 10) || 1));
  const date = "";
  const time = "";
  const message = clean(req.body.message, 1500);
  const service = SERVICES[serviceId];

  if (!name || !address || !postalCode || !city || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || !childName || !childFirstName || !emergencyName || !emergencyFirstName || !emergencyPhone || !signatureName || !/^\d{4}-\d{2}-\d{2}$/.test(signatureDate) || !["yes", "no"].includes(photoConsent) || !rulesAccepted || !dataNoticeAccepted || !service) {
    return res.status(400).json({ error: "Vérifiez les champs obligatoires du formulaire." });
  }

  const files = req.files || {};
  if (!files.insurance?.[0]) return res.status(400).json({ error: "Veuillez joindre l’attestation d’assurance demandée." });
  if (memberType === "new" && !files.medicalCertificate?.[0] && !files.healthAttestation?.[0]) {
    return res.status(400).json({ error: "Pour une première inscription, joignez le certificat médical de moins de 3 mois ou l’attestation/questionnaire de santé prévu par le CIPS." });
  }
  if (memberType === "renewal" && !["yes", "no"].includes(healthAnswers)) {
    return res.status(400).json({ error: "Pour un renouvellement, indiquez si vous avez répondu NON à toutes les questions de santé ou OUI à au moins une question." });
  }
  if (memberType === "renewal" && healthAnswers === "yes" && !files.medicalCertificate?.[0]) {
    return res.status(400).json({ error: "Vous avez répondu OUI à au moins une question de santé : veuillez joindre un certificat médical." });
  }
  if (memberType === "renewal" && !files.healthAttestation?.[0] && !files.medicalCertificate?.[0]) {
    return res.status(400).json({ error: "Pour un renouvellement, joignez le questionnaire de santé et l’attestation parentale, ou un certificat médical si nécessaire." });
  }

  const price = service.price - (childRank >= 2 ? 15 : 0);
  const bookings = readBookings();
  const booking = {
    id: `CIPS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
    createdAt: new Date().toISOString(),
    name, secondParent, address, postalCode, city, homePhone, otherParentPhone, email, phone,
    childName, childFirstName, gender, childBirthDate, school, className, commune,
    memberType, healthNotes, healthAnswers, emergencyName, emergencyFirstName, emergencyHomePhone, emergencyPhone, emergencyAddress, emergencyWorkPhone, signatureName, signatureDate,
    doctorName, doctorPhone, photoConsent, rulesAccepted, dataNoticeAccepted,
    serviceId, service: service.name, childRank, price, date, time, message,
    documents: {
      medicalCertificate: files.medicalCertificate?.[0] ? { filename: files.medicalCertificate[0].filename, originalName: path.basename(files.medicalCertificate[0].originalname), uploadedAt: new Date().toISOString() } : null,
      insurance: files.insurance?.[0] ? { filename: files.insurance[0].filename, originalName: path.basename(files.insurance[0].originalname), uploadedAt: new Date().toISOString() } : null,
      healthAttestation: files.healthAttestation?.[0] ? { filename: files.healthAttestation[0].filename, originalName: path.basename(files.healthAttestation[0].originalname), uploadedAt: new Date().toISOString() } : null
    },
    status: "pending",
    paymentStatus: "unpaid",
    stripeSessionId: null
  };
  bookings.push(booking);
  writeBookings(bookings);

  if (stripe) {
    try {
      const checkout = await stripe.checkout.sessions.create({
        mode: "payment",
        // Apple Pay and Google Pay may appear as wallet options under "card"
        // when supported by the customer's device/browser and enabled in Stripe.
        payment_method_types: ["card"],
        locale: "fr",
        customer_email: email,
        line_items: [{
          price_data: {
            currency: "eur",
            product_data: { name: service.name, description: `Inscription annuelle CIPS77` },
            unit_amount: price * 100
          },
          quantity: 1
        }],
        metadata: { bookingId: booking.id },
        payment_intent_data: { metadata: { bookingId: booking.id } },
        success_url: `${BASE_URL}/confirmation.html?session_id={CHECKOUT_SESSION_ID}&ref=${encodeURIComponent(booking.id)}` ,
        cancel_url: `${BASE_URL}/reservation.html?payment=cancelled`
      });
      booking.stripeSessionId = checkout.id;
      writeBookings(bookings);
      return res.json({ checkoutUrl: checkout.url, bookingId: booking.id, paymentRequired: true });
    } catch (err) {
      console.error("Stripe checkout error:", err.message);
      // Remove the pending registration if checkout fails.
      const current = readBookings().filter(item => item.id !== booking.id);
      writeBookings(current);
      return res.status(502).json({ error: "Le paiement en ligne est momentanément indisponible. Réessayez plus tard ou contactez-nous." });
    }
  }

  res.status(201).json({
    bookingId: booking.id,
    paymentRequired: false,
    message: "Demande enregistrée. Le paiement en ligne n’est pas encore configuré ; votre dossier reste en attente de validation."
  });
});

app.get("/api/payment-status", async (req, res) => {
  if (!stripe) return res.json({ enabled: false });
  const sessionId = clean(req.query.session_id, 200);
  if (!sessionId) return res.status(400).json({ error: "Session de paiement manquante." });
  try {
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);
    const bookingId = checkout.metadata && checkout.metadata.bookingId;
    const bookings = readBookings();
    const booking = bookings.find(item => item.id === bookingId && item.stripeSessionId === checkout.id);
    if (!booking) return res.status(404).json({ error: "Réservation introuvable pour cette session." });

    const paid = checkout.payment_status === "paid"
      && checkout.currency === "eur"
      && checkout.amount_total === booking.price * 100;
    if (paid) {
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      writeBookings(bookings);
    }
    res.json({ enabled: true, paid, bookingId: booking.id });
  } catch {
    res.status(400).json({ error: "Impossible de vérifier le paiement." });
  }
});

// Public content feeds. Only items explicitly published by an administrator are exposed.
app.get("/api/content/:type", (req, res) => {
  if (!["news", "event", "gallery"].includes(req.params.type)) return res.status(404).json({ error: "Rubrique inconnue." });
  res.set("Cache-Control", "public, max-age=60");
  res.json(contentStore.list(req.params.type, true));
});

// Family portal: return only minimal status data after matching the reference,
// parent email and child's date of birth. Never expose uploaded documents here.
app.post("/api/famille/dossier", (req, res) => {
  const id = clean(req.body.reference, 40).toUpperCase();
  const email = clean(req.body.email, 160).toLowerCase();
  const birth = clean(req.body.childBirthDate, 10);
  if (!id || !email || !/^\d{4}-\d{2}-\d{2}$/.test(birth)) return res.status(400).json({ error: "Renseignez la référence, l’e-mail du responsable et la date de naissance de l’enfant." });
  const booking = readBookings().find(b => b.id === id && String(b.email || "").toLowerCase() === email && b.childBirthDate === birth);
  if (!booking) return res.status(404).json({ error: "Dossier introuvable. Vérifiez les informations saisies." });
  res.json({ reference: booking.id, child: `${booking.childFirstName || ""} ${booking.childName || ""}`.trim(), createdAt: booking.createdAt, status: booking.status, paymentStatus: booking.paymentStatus, service: booking.service, price: booking.price, documentsReceived: { insurance: Boolean(booking.documents?.insurance), medicalCertificate: Boolean(booking.documents?.medicalCertificate), healthAttestation: Boolean(booking.documents?.healthAttestation) } });
});

app.post("/api/admin/login", (req, res) => {
  const username = clean(req.body.username, 100);
  const password = String(req.body.password || "");
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD ||
      username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Identifiants incorrects. Vérifiez aussi le fichier .env." });
  }
  req.session.isAdmin = true;
  res.json({ ok: true });
});
app.post("/api/admin/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});
app.get("/api/admin/me", (req, res) => res.json({ authenticated: Boolean(req.session?.isAdmin) }));
app.get("/api/admin/bookings", requireAdmin, (req, res) => {
  res.json(readBookings().sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time)));
});
app.patch("/api/admin/bookings/:id", requireAdmin, (req, res) => {
  const status = clean(req.body.status, 20);
  if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
    return res.status(400).json({ error: "Statut invalide." });
  }
  const bookings = readBookings();
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Réservation introuvable." });
  booking.status = status;
  writeBookings(bookings);
  res.json({ ok: true });
});

// Administration: content management for news, events and gallery.
app.get("/api/admin/content/:type", requireAdmin, (req, res) => {
  if (!["news", "event", "gallery"].includes(req.params.type)) return res.status(400).json({ error: "Type de contenu invalide." });
  res.json(contentStore.list(req.params.type, false));
});
app.post("/api/admin/content", requireAdmin, (req, res) => {
  const type = clean(req.body.type, 20);
  const title = clean(req.body.title, 160);
  const body = clean(req.body.body, 5000);
  const date = clean(req.body.date, 10);
  const image_url = clean(req.body.image_url, 500);
  const published = req.body.published === true || req.body.published === "true";
  if (!["news", "event", "gallery"].includes(type) || !title) return res.status(400).json({ error: "Choisissez une rubrique et saisissez un titre." });
  if (image_url && !/^https:\/\//i.test(image_url) && !image_url.startsWith("/uploads/public/")) return res.status(400).json({ error: "L’image doit utiliser une URL HTTPS ou un chemin public autorisé." });
  const id = contentStore.save({ type, title, body, date, image_url, published, id: Number(req.body.id) || undefined });
  res.json({ ok: true, id });
});
app.delete("/api/admin/content/:id", requireAdmin, (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id < 1 || !contentStore.remove(id)) return res.status(404).json({ error: "Contenu introuvable." });
  res.json({ ok: true });
});

app.get("/api/admin/stats", requireAdmin, (_req, res) => {
  const items = readBookings();
  const count = (fn) => items.filter(fn).length;
  res.json({ total: items.length, pending: count(b => b.status === "pending"), confirmed: count(b => b.status === "confirmed"), cancelled: count(b => b.status === "cancelled"), paid: count(b => b.paymentStatus === "paid"), unpaid: count(b => b.paymentStatus !== "paid"), paidRevenue: items.filter(b => b.paymentStatus === "paid").reduce((sum,b) => sum + (Number(b.price)||0),0), byService: Object.values(items.reduce((acc,b) => { const key=b.service || "Non précisé"; acc[key] ||= { service:key, count:0 }; acc[key].count++; return acc; },{})) });
});

function csvCell(value) { const s = String(value ?? ""); return '"' + s.replace(/"/g,'""') + '"'; }
app.get("/api/admin/export.csv", requireAdmin, (_req, res) => {
  const items = readBookings();
  const headers = ["Référence","Date de demande","Enfant","Prénom enfant","E-mail","Téléphone","Ville","Activité","Tarif EUR","Statut dossier","Statut paiement"];
  const rows = items.map(b => [b.id,b.createdAt,b.childName,b.childFirstName,b.email,b.phone,b.city,b.service,b.price,b.status,b.paymentStatus]);
  const csv = "\uFEFF" + [headers,...rows].map(row => row.map(csvCell).join(";")).join("\r\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="cips77-inscriptions.csv"');
  res.send(csv);
});
app.get("/api/admin/export.xls", requireAdmin, (_req, res) => {
  const items = readBookings();
  const headers = ["Référence","Date de demande","Nom enfant","Prénom enfant","E-mail","Téléphone","Ville","Activité","Tarif EUR","Statut dossier","Statut paiement"];
  const escXml = v => String(v ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const rows = [headers,...items.map(b => [b.id,b.createdAt,b.childName,b.childFirstName,b.email,b.phone,b.city,b.service,b.price,b.status,b.paymentStatus])];
  const xml = '<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Inscriptions"><Table>' + rows.map(r => '<Row>' + r.map(v => '<Cell><Data ss:Type="String">'+escXml(v)+'</Data></Cell>').join('') + '</Row>').join('') + '</Table></Worksheet></Workbook>';
  res.setHeader("Content-Type", "application/vnd.ms-excel; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="cips77-inscriptions.xls"');
  res.send(xml);
});

app.use(require("./src/routes/pages"));

app.get("/api/admin/documents/:id/:type", requireAdmin, (req, res) => {
  const type = req.params.type;
  if (!["medicalCertificate", "insurance", "healthAttestation"].includes(type)) return res.status(400).send("Type de document invalide.");
  const booking = readBookings().find(item => item.id === req.params.id);
  const document = booking?.documents?.[type];
  if (!document) return res.status(404).send("Document introuvable.");
  const filePath = path.join(UPLOAD_DIR, path.basename(document.filename));
  if (!fs.existsSync(filePath)) return res.status(404).send("Fichier introuvable.");
  res.download(filePath, document.originalName);
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.code === "LIMIT_FILE_SIZE" ? "Chaque document doit faire 8 Mo maximum." : "Téléversement invalide. Trois documents maximum." });
  if (err) return res.status(400).json({ error: err.message || "Erreur de téléversement." });
  res.status(500).json({ error: "Erreur serveur." });
});

app.listen(PORT, () => console.log(`CIPS77 est disponible sur ${BASE_URL}`));
