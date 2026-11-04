const express=require('express'); const path=require('path'); const {publicDirectory}=require('./page-content'); const router=express.Router();
router.get(['/mentions-legales','/mentions-legales.html'], (_req, res) => res.sendFile(path.join(publicDirectory, 'mentions-legales.html')));
module.exports=router;
