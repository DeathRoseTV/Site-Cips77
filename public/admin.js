const $ = id => document.getElementById(id);
async function api(url, options={}) {
  const res = await fetch(url, {headers:{"Content-Type":"application/json"}, ...options});
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.error || "Erreur serveur.");
  return data;
}
function showDashboard() { $("loginPanel").hidden=true; $("dashboard").hidden=false; $("logout").hidden=false; }
function showLogin() { $("loginPanel").hidden=false; $("dashboard").hidden=true; $("logout").hidden=true; }
async function loadBookings() {
  try {
    const items = await api("/api/admin/bookings");
    $("bookingCount").textContent = `${items.length} demande(s) d’inscription enregistrée(s).`;
    const body = $("bookingsBody"); body.replaceChildren();
    if (!items.length) { const tr=document.createElement("tr"), td=document.createElement("td"); td.colSpan=5; td.className="empty-state"; td.textContent="Aucune réservation pour le moment."; tr.append(td); body.append(tr); return; }
    items.forEach(b => {
      const tr=document.createElement("tr");
      const date=document.createElement("td"); date.textContent=`${new Date(b.date+"T12:00:00").toLocaleDateString("fr-FR")} · ${b.time}`;
      const client=document.createElement("td"); client.textContent=`${b.name}\n${b.email}\n${b.phone}`;
      const dog=document.createElement("td"); dog.textContent=`Enfant : ${b.childName || "—"} ${b.childFirstName || ""}\nNaissance : ${b.childBirthDate || "—"} · Classe : ${b.className || "—"} · École : ${b.school || "—"}\nRang fratrie : ${b.childRank || 1}\nAdresse : ${b.address || ""}, ${b.postalCode || ""} ${b.city || ""}\nCommune : ${b.commune || ""}\nAdhésion : ${b.memberType === "new" ? "Nouvelle" : "Renouvellement"}\nUrgence : ${b.emergencyName || "—"} / ${b.emergencyPhone || "—"}\nMédecin : ${b.doctorName || "—"} / ${b.doctorPhone || "—"}\nAutorisation photo : ${b.photoConsent === "yes" ? "Oui" : "Non"}\nSanté / remarques : ${b.healthNotes || "—"}\n${b.service}\n${b.message || ""}`;
      const docWrap=document.createElement("div");
      [["medicalCertificate","Certificat médical"],["healthAttestation","Questionnaire / attestation santé"],["insurance","Attestation d’assurance"]].forEach(([key,label])=>{
        const doc=b.documents && b.documents[key];
        const line=document.createElement("div");
        if(doc){const a=document.createElement("a");a.href=`/api/admin/documents/${encodeURIComponent(b.id)}/${key}`;a.textContent=`📎 ${label}`;a.target="_blank";a.rel="noopener";line.append(a);} else {line.textContent=`${label} : non fourni`;}
        docWrap.append(line);
      });
      dog.append(document.createElement("br"),docWrap);
      const pay=document.createElement("td"); pay.textContent=`${b.price} €\n${b.paymentStatus==="paid"?"Payé":"Non payé"}`;
      const status=document.createElement("td"); const select=document.createElement("select");
      [["pending","En attente"],["confirmed","Confirmé"],["completed","Terminé"],["cancelled","Annulé"]].forEach(([v,label])=>{const o=document.createElement("option");o.value=v;o.textContent=label;select.append(o)});
      select.value=b.status; select.addEventListener("change",async()=>{try{await api(`/api/admin/bookings/${encodeURIComponent(b.id)}`,{method:"PATCH",body:JSON.stringify({status:select.value})});$("dashboardMessage").textContent="Statut mis à jour.";}catch(e){$("dashboardMessage").textContent=e.message;}});
      status.append(select); tr.append(date,client,dog,pay,status); body.append(tr);
    });
  } catch(e) { $("dashboardMessage").textContent=e.message; if(e.message.includes("Connexion")) showLogin(); }
}
async function checkAuth() { try { const r=await api("/api/admin/me"); if(r.authenticated){showDashboard();await loadBookings();}else showLogin(); } catch {showLogin();} }
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();$("loginMessage").textContent="Connexion…";try{await api("/api/admin/login",{method:"POST",body:JSON.stringify({username:$("username").value,password:$("password").value})});$("password").value="";showDashboard();await loadBookings();}catch(err){$("loginMessage").textContent=err.message;}});
$("logout").addEventListener("click",async()=>{await api("/api/admin/logout",{method:"POST",body:"{}"});showLogin();});
$("reload").addEventListener("click",loadBookings);
checkAuth();