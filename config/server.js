module.exports = ({ env }) => ({
  host: env("API_HOST", "0.0.0.0"),
  port: env.int("API_PORT", 1337),
});
