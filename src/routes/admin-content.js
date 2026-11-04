const express=require('express'); const path=require('path'); const {publicDirectory}=require('./page-content'); const router=express.Router();
router.get('/admin/contenu', (_req, res) => res.sendFile(path.join(publicDirectory, 'admin-contenu.html')));
module.exports=router;

