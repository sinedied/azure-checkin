const administrators = require('../administrators.json');

function getUserInfo(req) {
  try {
    const token = Buffer.from(
      req.headers['x-ms-client-principal'],
      'base64'
    ).toString('ascii');
    return (token && JSON.parse(token)) || null;
  } catch (error) {
    return null;
  }
}

function getRole(userDetails) {
  return (userDetails && administrators[userDetails.toLowerCase()]) || 'user';
}

module.exports = {
  getUserInfo,
  getRole,
};
