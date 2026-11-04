const express = require('express');
const { pages, renderPage } = require('../page-content');
const router = express.Router();
const route = '/reglement-interieur';
router.get(route, (_req, res) => res.type('html').send(renderPage(route, pages[route])));
module.exports = router;
