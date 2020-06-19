module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("API_PORT", "PORT", 1337),
});
