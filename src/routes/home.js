const express=require('express'); const path=require('path'); const {publicDirectory}=require('./page-content'); const router=express.Router();
router.get('/', (_req, res) => res.sendFile(path.join(publicDirectory, 'index.html')));
module.exports=router;
