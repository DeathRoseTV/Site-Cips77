const express=require('express'); const path=require('path'); const {publicDirectory}=require('./page-content'); const router=express.Router();
router.get(['/famille','/espace-familles'], (_req, res) => res.sendFile(path.join(publicDirectory, 'famille.html')));
module.exports=router;

