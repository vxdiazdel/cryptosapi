const path = require('path');
const rp = require('request-promise');
const { CMC_LISTINGS_URL, CMC_LATEST_URL, EXPIRATION_TIME } = require(path.join(
  process.cwd(),
  'constants'
));

const fetchRoutes = (req, res, router) => {
  const routes = router.stack.map(route => {
    const { path, methods } = route.route;
    return { path, methods };
  });
  res.status(200).json({ routes });
};

const fetchAllCryptos = async (req, res) => {
  const cryptos = await client.get('cryptos');

  if (cryptos) return res.status(200).json({ data: JSON.parse(cryptos) });
  try {
    const requestOptions = {
      method: 'GET',
      uri: CMC_LISTINGS_URL,
      qs: {
        start: '1',
        limit: '5000',
        convert: 'USD',
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
      },
      json: true,
      gzip: true,
    };
    const json = await rp(requestOptions);

    await client.set('cryptos', JSON.stringify(json), 'EX', EXPIRATION_TIME);
    return res.status(200).json({ data: json });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, data: null });
  }
};

const fetchCrypto = async (req, res) => {
  const { slug } = req.params;
  const crypto = await client.get(`crypto:${slug}`);

  if (crypto) return res.status(200).json({ data: JSON.parse(crypto) });
  try {
    const requestOptions = {
      method: 'GET',
      uri: CMC_LATEST_URL,
      qs: {
        slug,
        convert: 'USD',
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
      },
      json: true,
      gzip: true,
    };
    const json = await rp(requestOptions);

    await client.set(
      `crypto:${slug}`,
      JSON.stringify(json),
      'EX',
      EXPIRATION_TIME
    );
    return res.status(200).json({ data: json });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, data: null });
  }

  res.status(200).json({ data: json });
};

module.exports = {
  fetchRoutes,
  fetchAllCryptos,
  fetchCrypto,
};
