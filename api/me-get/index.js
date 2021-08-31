const { getUserInfo, getRole } = require('../helpers/auth');

module.exports = async function (context, req) {
  const userInfo = getUserInfo(req);
  const { userDetails } = userInfo || {};
  const role = getRole(userDetails);

  if (!userInfo || !userInfo.userId) {
    return { status: 401, body: 'Unauthorized' };
  }

  return {
    body: {
      ...userInfo,
      admin: role === 'admin' || role === 'superadmin',
    },
  };
};
