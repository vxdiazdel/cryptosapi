const express = require('express');
const { fetchRoutes, fetchAllCryptos, fetchCrypto } = require('./controller');

const router = express.Router();

router.get('/', (req, res) => fetchRoutes(req, res, router));

router.get('/cryptos', fetchAllCryptos);

router.get('/cryptos/:slug', fetchCrypto);

module.exports = router;
