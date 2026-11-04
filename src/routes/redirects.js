const express=require('express'); const router=express.Router();
router.get('/adhesion/en-ligne', (_req,res) => res.redirect(301, '/inscription'));
router.get('/inscription/etapes', (_req,res) => res.redirect(301, '/comment-sinscrire'));
module.exports=router;
