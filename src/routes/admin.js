const express=require('express'); const path=require('path'); const {publicDirectory}=require('./page-content'); const router=express.Router();
router.get('/admin', (_req, res) => res.sendFile(path.join(publicDirectory, 'admin.html')));
module.exports=router;
