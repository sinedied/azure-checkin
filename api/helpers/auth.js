function getUserInfo(req) {
  const token = Buffer.from(
    req.headers['x-ms-client-principal'],
    'base64'
  ).toString('ascii');
  try {
    return (token && JSON.parse(token)) || null;
  } catch (error) {
    return null;
  }
}

module.exports = {
  getUserInfo,
};
