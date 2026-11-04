const express=require('express'); const path=require('path'); const {publicDirectory}=require('./page-content'); const router=express.Router();
router.get(['/reservation','/inscription'], (_req, res) => res.sendFile(path.join(publicDirectory, 'reservation.html')));
module.exports=router;
