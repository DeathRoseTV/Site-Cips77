const express=require('express'); const path=require('path'); const {publicDirectory}=require('./page-content'); const router=express.Router();
router.get('/confirmation', (_req, res) => res.sendFile(path.join(publicDirectory, 'confirmation.html')));
module.exports=router;
