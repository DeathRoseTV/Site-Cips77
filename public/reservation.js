const $ = id => document.getElementById(id);
let services = [];
const params = new URLSearchParams(location.search);
const signatureDateInput = $("signatureDate");
if (signatureDateInput) signatureDateInput.value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,10);

function euro(n) { return new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n); }
function selectedService() { return services.find(s => s.id === $("service").value); }
function refreshSummary() {
  const s = selectedService();
  $("summaryName").textContent = s ? s.name : "Choisissez votre accompagnement";
  $("summaryDuration").textContent = s ? `Durée indicative : ${s.minutes} minutes` : "Un accompagnement adapté à votre duo.";
  const rank = Number($("childRank")?.value || 1);
  const finalPrice = s ? s.price - (rank >= 2 ? 15 : 0) : null;
  $("summaryPrice").textContent = s ? euro(finalPrice) : "— €";
}
async function init() {
  try {
    const res = await fetch("/api/config");
    const data = await res.json();
    services = data.services;
    $("service").innerHTML = '<option value="">Choisir une prestation</option>';
    services.forEach(s => { const o=document.createElement("option"); o.value=s.id; o.textContent=`${s.name} — ${euro(s.price)}`; $("service").append(o); });
    if (params.get("service") && services.some(s=>s.id===params.get("service"))) $("service").value=params.get("service");
    $("paymentNote").textContent = data.paymentEnabled ? "Paiement sécurisé par carte via Stripe après envoi du formulaire." : "Paiement en ligne non activé. La demande sera enregistrée et devra être confirmée.";
    refreshSummary();
  } catch {
    $("service").innerHTML = '<option value="">Le serveur est indisponible</option>';
    $("bookingMessage").textContent = "Impossible de charger les prestations. Vérifiez que le serveur est démarré.";
  }
}
$("service").addEventListener("change", refreshSummary);
$("childRank").addEventListener("change", refreshSummary);
const memberType = $("memberType");
const medicalInput = $("medicalCertificate");
const healthInput = $("healthAttestation");
function updateDocumentRequirements() {
  const type = memberType.value;
  const healthAnswers = document.querySelectorAll('input[name="healthAnswers"]');
  healthAnswers.forEach(input => { input.required = type === "renewal"; });
  // The CIPS form allows a certificate for first registrations, or the health questionnaire/parental attestation route.
  medicalInput.required = false;
  healthInput.required = false; // Le certificat médical peut remplacer le document questionnaire/attestation.
  $("insurance").required = true;
}
memberType.addEventListener("change", updateDocumentRequirements);
updateDocumentRequirements();

$("bookingForm").addEventListener("submit", async event => {
  event.preventDefault();
  const type = memberType.value;
  const healthAnswers = document.querySelector('input[name="healthAnswers"]:checked')?.value || "";
  if (type === "renewal" && healthAnswers === "yes" && !medicalInput.files.length) {
    $("bookingMessage").textContent = "Vous avez répondu OUI à au moins une question de santé : veuillez joindre un certificat médical.";
    return;
  }
  if (type === "new" && !medicalInput.files.length && !healthInput.files.length) {
    $("bookingMessage").textContent = "Pour une première inscription, joignez le certificat médical ou le questionnaire / attestation de santé.";
    return;
  }
  if (type === "renewal" && !healthInput.files.length && !medicalInput.files.length) {
    $("bookingMessage").textContent = "Pour un renouvellement, joignez le questionnaire de santé avec l’attestation parentale, ou un certificat médical si nécessaire.";
    return;
  }
  $("submitBooking").disabled = true;
  $("bookingMessage").textContent = "Enregistrement de votre demande…";
  const data = new FormData(event.currentTarget);
  try {
    const res = await fetch("/api/bookings", { method:"POST", body:data });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Une erreur est survenue.");
    if (result.checkoutUrl) { location.href = result.checkoutUrl; return; }
    $("bookingMessage").textContent = `${result.message} Référence : ${result.bookingId}.`;
    event.currentTarget.reset();
    refreshSummary();
  } catch (err) { $("bookingMessage").textContent = err.message; }
  finally { $("submitBooking").disabled = false; }
});
$("year").textContent = new Date().getFullYear();
if (params.get("payment")==="cancelled") $("bookingMessage").textContent = "Paiement annulé. Votre demande peut être renouvelée.";
init();