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

const getRole = (userDetails) =>
  (userDetails && administrators[userDetails.toLowerCase()]) || 'user';

const isAdmin = (userDetails, event, role = getRole(userDetails)) =>
  role === 'superadmin' || (role === 'admin' && event.owner === userDetails);

module.exports = {
  getUserInfo,
  getRole,
  isAdmin,
};
