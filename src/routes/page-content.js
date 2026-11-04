const path = require('path');
const publicDirectory = path.join(__dirname, '..', '..', 'public');
const nav = [
  ['/','Accueil'], ['/association','L’association'], ['/activites','Activités'], ['/famille','Espace familles'],
  ['/horaires','Horaires'], ['/lieux','Lieux de pratique'], ['/tarifs','Tarifs'],
  ['/inscription','Inscription'], ['/actualites','Actualités'], ['/calendrier','Calendrier'], ['/equipe','Équipe'], ['/faq','FAQ'], ['/documents','Documents'], ['/reglement-interieur','Règlement intérieur'], ['/contact','Contact']
];
const pages = {
  '/association': {title:'Le CIPS77', lead:'Une école multisports pour découvrir, essayer et partager.', sections:[
    ['Notre mission','Le Centre d’Initiation à la Pratique Sportive (CIPS) est une association loi 1901 qui propose aux enfants une découverte de différentes pratiques sportives. L’objectif est de développer les capacités motrices, l’autonomie, le respect des autres et le plaisir de pratiquer ensemble.'],
    ['Pour qui ?','L’école multisports accueille les enfants de la moyenne section de maternelle au CM1, dans la limite des places disponibles. Les niveaux et conditions d’admission doivent être confirmés au moment de l’inscription.'],
    ['Une association locale','Le CIPS est référencé à Cesson et Vert-Saint-Denis. Les séances se déroulent dans différents équipements selon l’activité et le planning communiqué aux familles.'] ]},
  '/activites': {title:'Les activités sportives',lead:'Une découverte multisports qui varie au fil de l’année.',sections:[
    ['Jeux collectifs et jeux traditionnels','Jeux de ballon, coopération, opposition et jeux collectifs adaptés à l’âge des enfants.'],
    ['Raquettes et précision','Découverte de jeux de raquettes comme le tennis ou le badminton, ainsi que d’activités de précision selon le programme.'],
    ['Gymnastique et expression','Gymnastique, danse, cirque ou acrosport peuvent faire partie des cycles proposés.'],
    ['Athlétisme, roller et autres découvertes','Le programme peut aussi inclure l’athlétisme, le roller pour les plus grands et différentes activités de découverte. La liste définitive dépend du planning annuel.'] ]},
  '/horaires': {title:'Horaires et organisation',lead:'Les séances ont lieu le mercredi, hors vacances scolaires.',sections:[
    ['Maternelles','Créneau indicatif : mercredi de 10 h 30 à 12 h.'],
    ['Élémentaires CP à CM1','Créneau indicatif : mercredi de 10 h à 12 h.'],
    ['Planning annuel','Les lieux changent selon l’activité. Le planning définitif est communiqué aux familles en début de saison. Vérifiez les horaires et dates directement auprès du CIPS avant de vous déplacer.'] ]},
  '/lieux': {title:'Lieux de pratique',lead:'Les rendez-vous se font sur le lieu de l’activité.',sections:[
    ['Complexe sportif Colette-Besson','Avenue de la Zibeline, 77240 Cesson.'],
    ['Complexe sportif Jean-Vilar','2 rue de la Fontaine Ronde, 77240 Vert-Saint-Denis.'],
    ['Autres équipements','Selon le cycle, d’autres gymnases ou espaces sportifs peuvent être utilisés. Référez-vous au planning transmis par l’association.'] ]},
  '/tarifs': {title:'Tarifs et réductions',lead:'Les montants doivent être vérifiés pour la saison d’inscription en cours.',sections:[
    ['Tarifs figurant sur la fiche 2025–2026','Maternelles résidant à Cesson ou Vert-Saint-Denis : 182 €. Élémentaires CP/CE1/CE2/CM1 résidant à Cesson ou Vert-Saint-Denis : 192 €. Enfants domiciliés hors des deux communes : majoration de 10 €.'],
    ['Réduction fratrie','Réduction indiquée sur la fiche : 15 € à partir du deuxième enfant inscrit, dans la limite prévue par l’association.'],
    ['Paiement','La fiche fournie indique un paiement possible en trois chèques maximum. Les chèques-vacances et coupons sport ne sont pas acceptés. Confirmez les modalités actuelles avec le CIPS.'] ]},
  '/documents': {title:'Documents d’inscription',lead:'Préparez les documents avant de valider le dossier.',sections:[
    ['Documents à fournir','Fiche d’inscription complétée, photo d’identité de l’enfant, certificat médical de moins de trois mois ou questionnaire de santé et attestation parentale selon la situation, attestation d’assurance individuelle accident et extra-scolaire, et règlement de la cotisation.'],
    ['Télécharger la fiche officielle','La fiche d’inscription fournie est disponible au format PDF ci-dessous. Elle concerne la saison 2025–2026 ; demandez au CIPS la version à jour avant de l’utiliser pour une nouvelle saison.'] ]},
  '/reglement-interieur': {title:'Règlement intérieur',lead:'Prenez connaissance du règlement avant de confirmer l’inscription.',sections:[
    ['Règlement officiel','Le règlement intérieur est consultable dans le document officiel fourni par l’association. La version jointe porte la date du 1er septembre 2022. Le document complet doit être lu et accepté par le représentant légal.'],
    ['Engagement des familles','Les familles s’engagent à respecter les consignes des éducateurs, les horaires, les règles de sécurité et les modalités communiquées pour chaque activité. Pour toute question sur une disposition, contactez l’association.'] ]},
  '/contact': {title:'Contacter le CIPS77',lead:'Pour une question sur les inscriptions, les horaires ou les documents.',sections:[
    ['Courriel','cips77@free.fr'],['Adresse postale','CIPS – 5 rue Aimé Césaire, 77240 Vert-Saint-Denis.'],['Avant de venir','Les lieux et horaires peuvent changer selon le cycle sportif. Merci de vérifier le planning transmis par l’association.'] ]},
  '/actualites': {title:'Actualités du CIPS77',lead:'Retrouvez les informations importantes de l’association.',sections:[
    ['Informations de rentrée','Les dates de reprise, documents à préparer et informations d’organisation sont communiqués par l’association aux familles. Cette page pourra accueillir les prochaines actualités validées par le CIPS.'],
    ['Planning sportif','Le planning peut varier selon les activités et les équipements. Vérifiez les informations transmises par l’association avant chaque séance.'],
    ['Nous transmettre une information','Pour signaler une correction ou demander une information, contactez cips77@free.fr.'] ]},
  '/equipe': {title:'L’équipe associative',lead:'Une association locale portée par des bénévoles et des encadrants.',sections:[
    ['Le bureau','Le CIPS est une association loi 1901. Les noms et fonctions des membres du bureau doivent être ajoutés après validation par l’association.'],
    ['Les encadrants','Les activités sont encadrées selon l’organisation et les qualifications prévues par l’association. Pour toute question, contactez le CIPS.'] ]},
  '/calendrier': {title:'Calendrier de la saison',lead:'Les périodes et dates importantes à retenir.',sections:[
    ['Séances','Les séances sont généralement organisées le mercredi hors vacances scolaires, selon le planning annuel communiqué aux familles.'],
    ['Vacances et jours fériés','Les dates exactes de fermeture et les éventuelles modifications doivent être confirmées dans le calendrier officiel de la saison.'] ]},
  '/faq': {title:'Questions fréquentes',lead:'Les réponses aux questions courantes des familles.',sections:[
    ['À partir de quel âge inscrire mon enfant ?','La fiche fournie mentionne les enfants de la moyenne section de maternelle au CM1, sous réserve de places disponibles.'],
    ['Quels documents préparer ?','Préparez la fiche d’inscription, les justificatifs de santé demandés selon la situation, l’attestation d’assurance et le règlement de la cotisation. Consultez la page Documents.'],
    ['Comment connaître le lieu de la séance ?','Le lieu dépend de l’activité. Référez-vous au planning transmis par le CIPS.'],
    ['Comment contacter l’association ?','Écrivez à cips77@free.fr ou consultez la page Contact.'] ]},
  '/comment-sinscrire': {title:'Comment inscrire son enfant',lead:'Les étapes pour préparer un dossier complet.',sections:[
    ['Étape 1 — Préparer les informations','Rassemblez les coordonnées des représentants légaux, les informations de l’enfant, le contact d’urgence et les coordonnées du médecin.'],
    ['Étape 2 — Joindre les documents','Ajoutez l’attestation d’assurance et les documents de santé demandés selon votre situation.'],
    ['Étape 3 — Lire et valider','Prenez connaissance du règlement intérieur, vérifiez les informations et envoyez le formulaire. Les conditions et tarifs doivent être confirmés pour la saison en cours.'] ]},
  '/politique-confidentialite': {title:'Confidentialité et données personnelles',lead:'Informations sur les données saisies dans le formulaire.',sections:[
    ['Données collectées','Le formulaire peut contenir des coordonnées familiales, des informations concernant l’enfant et des pièces justificatives. Ces données ne doivent être accessibles qu’aux personnes autorisées.'],
    ['Documents sensibles','Les documents de santé nécessitent une protection renforcée, une durée de conservation définie et des accès limités. L’association doit valider la base légale, les destinataires et les modalités d’exercice des droits avant mise en production.'],
    ['Contacter le responsable','Pour une demande relative aux données personnelles, contactez le CIPS à cips77@free.fr en attendant la publication des coordonnées officielles du responsable de traitement.'] ]},
  '/accessibilite': {title:'Accessibilité',lead:'Un site conçu pour rester lisible sur ordinateur, tablette et mobile.',sections:[
    ['Navigation','Les pages sont accessibles depuis les liens de navigation et les liens de pied de page.'],
    ['Signaler une difficulté','Si vous rencontrez un problème d’affichage ou de navigation, contactez cips77@free.fr. Une déclaration de conformité officielle devra être publiée après audit.'] ]},
  '/partenaires': {title:'Partenaires',lead:'Les partenaires et acteurs locaux du CIPS77.',sections:[
    ['Partenaires locaux','Les noms, logos et liens des partenaires doivent être publiés uniquement après validation de l’association et avec les autorisations nécessaires.'],
    ['Proposer un partenariat','Contactez le CIPS par courriel pour toute proposition de partenariat.'] ]},
  '/galerie': {title:'Galerie photos',lead:'Les activités du CIPS en images, avec autorisation des représentants légaux.',sections:[
    ['Respect du droit à l’image','Aucune photographie d’enfant ne doit être publiée sans autorisation valable et vérification des consignes de l’association. Cette page est prête à recevoir des images autorisées.'] ]},
  '/adhesion': {title:'Adhésion au CIPS77',lead:'Informations pratiques pour rejoindre l’association.',sections:[
    ['Conditions','L’admission dépend des niveaux concernés, des places disponibles et des conditions fixées pour la saison.'],
    ['Dossier','Consultez les étapes d’inscription et les documents requis avant de transmettre votre demande.'] ]}
};
function esc(s='') { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function renderPage(url, page) {
  const menu = nav.map(([href,label]) => `<a href="${href}"${href===url?' aria-current="page"':''}>${esc(label)}</a>`).join('');
  const sections = page.sections.map(([heading,body]) => `<section class="content-card"><h2>${esc(heading)}</h2><p>${esc(body)}</p></section>`).join('');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.title)} | CIPS77</title><meta name="description" content="${esc(page.lead)}"><link rel="stylesheet" href="/styles.css"><style>
  .site-header{position:sticky;top:0;z-index:20;background:#fff;border-bottom:1px solid #e5e7eb}.site-nav{max-width:1240px;margin:auto;padding:14px 22px;display:flex;align-items:center;gap:7px;flex-wrap:wrap}.site-brand{font-weight:800;color:#153e75;text-decoration:none;margin-right:auto;font-size:1.1rem}.site-nav a:not(.site-brand){padding:8px 10px;border-radius:9px;color:#27364b;text-decoration:none;font-size:.88rem}.site-nav a[aria-current="page"],.site-nav a:not(.site-brand):hover{background:#eaf2ff;color:#164a91}.route-main{max-width:1050px;margin:0 auto;padding:44px 22px 70px}.route-hero{padding:34px;border-radius:20px;background:linear-gradient(120deg,#123c72,#2877b9);color:white;margin-bottom:22px}.route-hero h1{font-size:clamp(2rem,4vw,3.2rem);margin:0 0 12px}.route-hero p{font-size:1.12rem;max-width:720px;margin:0;line-height:1.6}.route-sections{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:18px}.content-card{padding:24px;border:1px solid #e1e7ef;border-radius:16px;background:#fff}.content-card h2{margin-top:0;color:#163f76;font-size:1.25rem}.content-card p{line-height:1.75;margin-bottom:0}.route-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.route-button{display:inline-block;padding:12px 18px;border-radius:10px;background:#fff;color:#153e75;font-weight:700;text-decoration:none}.route-button.secondary{background:#eaf2ff;color:#164a91}.site-footer{padding:24px;text-align:center;background:#102f56;color:#fff}.site-footer a{color:#fff;margin:0 8px}@media(max-width:650px){.site-nav{gap:4px;padding:12px}.site-nav a:not(.site-brand){font-size:.85rem;padding:7px}.route-main{padding:26px 14px 48px}.route-hero{padding:24px}}
  </style></head><body><header class="site-header"><nav class="site-nav" aria-label="Navigation principale"><a class="site-brand" href="/">CIPS77 · Multisports</a>${menu}</nav></header><main class="route-main"><header class="route-hero"><h1>${esc(page.title)}</h1><p>${esc(page.lead)}</p><div class="route-actions"><a class="route-button" href="/inscription">Faire une inscription</a><a class="route-button secondary" href="/contact">Nous contacter</a></div></header><div class="route-sections">${sections}</div>${url==='/documents'?'<section class="content-card" style="margin-top:18px"><h2>Fiche d’inscription officielle</h2><p><a href="/documents/fiche-inscription-cips-2025-2026.pdf" target="_blank" rel="noopener">Ouvrir ou télécharger la fiche PDF 2025–2026</a></p></section>':''}${url==='/reglement-interieur'?'<section class="content-card" style="margin-top:18px"><h2>Consulter la fiche et le règlement</h2><p><a href="/documents/fiche-inscription-cips-2025-2026.pdf" target="_blank" rel="noopener">Ouvrir le PDF officiel fourni</a></p></section>':''}${['/actualites','/calendrier','/galerie'].includes(url)?`<section class="content-card" style="margin-top:18px"><h2>${url==='/actualites'?'Dernières actualités':url==='/calendrier'?'Événements à venir':'Galerie du CIPS77'}</h2><div id="cms-content">Chargement des contenus publiés…</div></section><script>fetch('/api/content/${url==='/actualites'?'news':url==='/calendrier'?'event':'gallery'}').then(r=>r.json()).then(items=>{const root=document.getElementById('cms-content');if(!items.length){root.textContent='Aucun contenu publié pour le moment.';return;}root.innerHTML=items.map(x=>'<article style="padding:14px 0;border-bottom:1px solid #e5e7eb">'+(x.image_url?'<img src="'+String(x.image_url).replace(/"/g,'&quot;')+'" alt="" style="max-width:100%;max-height:320px;border-radius:12px">':'')+'<h3>'+String(x.title).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</h3><p>'+String(x.body||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</p><small>'+String(x.date||'')+'</small></article>').join('')}).catch(()=>document.getElementById('cms-content').textContent='Les contenus ne sont pas disponibles actuellement.');</script>`:''}</main><footer class="site-footer">CIPS77 · Centre d’Initiation à la Pratique Sportive<br><a href="/mentions-legales">Mentions légales</a><a href="/politique-confidentialite">Confidentialité</a><a href="/accessibilite">Accessibilité</a><a href="/partenaires">Partenaires</a><a href="/galerie">Galerie</a><a href="/faq">FAQ</a><a href="/documents">Documents</a><a href="/contact">Contact</a><p>Contact : cips77@free.fr · 5 rue Aimé Césaire, 77240 Vert-Saint-Denis</p></footer></body></html>`;
}

module.exports = { nav, pages, renderPage, publicDirectory, esc };
