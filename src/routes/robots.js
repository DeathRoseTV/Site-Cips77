const express=require('express'); const router=express.Router();
router.get('/robots.txt', (_req,res) => res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: '+(process.env.BASE_URL || 'http://localhost:3000')+'/sitemap.xml\n'));
module.exports=router;
