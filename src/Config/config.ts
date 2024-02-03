// Environment variable values fetched from .env file
export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    urlShortenerDomain: process.env.URL_SHORTENER_DOMAIN,
    mongodbUri: process.env.MONGODB_URI
  });