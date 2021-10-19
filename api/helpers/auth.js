const admins = require('../administrators.json');

const superadmins = ['sinedied'];
const roles = generateRolesMap();

function generateRolesMap() {
  const roles = {};
  for (let user of admins) roles[user] = 'admin';
  for (let user of superadmins) roles[user] = 'superadmin';
  return roles;
}

function getUserInfo(req) {
  try {
    const token = Buffer.from(req.headers['x-ms-client-principal'], 'base64').toString('ascii');
    return (token && JSON.parse(token)) || null;
  } catch (error) {
    return null;
  }
}

const getRole = (userDetails) => (userDetails && roles[userDetails.toLowerCase()]) || 'user';

const isAdmin = (userDetails, event, role = getRole(userDetails)) =>
  role === 'superadmin' || (role === 'admin' && (!event || event.owner === userDetails));

module.exports = {
  getUserInfo,
  getRole,
  isAdmin,
};
