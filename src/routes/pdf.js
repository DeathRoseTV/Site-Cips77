const express=require('express'); const path=require('path'); const {publicDirectory}=require('./page-content'); const router=express.Router();
router.get('/documents/fiche-inscription-cips-2025-2026.pdf', (_req, res) => res.sendFile(path.join(publicDirectory, 'documents','fiche-inscription-cips-2025-2026.pdf')));
module.exports=router;
