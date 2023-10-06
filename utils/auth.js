import AsyncStorage from '@react-native-async-storage/async-storage';
import decode from 'jwt-decode';

/**
 * Verify if a user is authenticated.
 * @returns {Boolean} True if the user
 * is authenticated, false if it is not.
 */
export const isAuth = async () => {
  const data = await AsyncStorage.getItem('user');
  const user = data ? JSON.parse(data) : {};

  const token = Object.keys(user).length !== 0 ? user.access_token : user;

  let isValid = true;

  try {
    isValid = decode(token);
  } catch (error) {
    return false;
  }

  return isValid;
};

/**
 * Verify if a user is authenticated.
 * @returns {Boolean} True if the user
 * is authenticated, false if it is not.
 */
export const Token = async () => {
  const user = JSON.parse(await AsyncStorage.getItem('user'));

  return await user;
};

export const defaultInitialState = async () => {
  return {
    token: JSON.parse(await AsyncStorage.getItem('token')),

    user: JSON.parse(await AsyncStorage.getItem('user')),
  };
};

/**
 * Verify if the user has the owner role.
 * @returns {Boolean} True if it is user,
 * false if it is not.
 */
export const isOwner = async () => {
  const user = JSON.parse(await AsyncStorage.getItem('user')) || {};
  const roles = Object.keys(user).length !== 0 ? user.roles : {};

  return havePermissions(['owner'], roles);
};

/**
 * Verify if the user has the owner role.
 * @returns {Boolean} True if it is user,
 * false if it is not.
 */
export const isVoter = async () => {
  const user = JSON.parse(await AsyncStorage.getItem('user')) || {};
  const roles = Object.keys(user).length !== 0 ? user.roles : {};

  return havePermissions(['voter'], roles);
};

/**
 * Verify if the user has the tenant role.
 * @returns {Boolean} True if it is user,
 * false if it is not.
 */
export const isTenant = async () => {
  const user = JSON.parse(await AsyncStorage.getItem('user')) || {};
  const roles = Object.keys(user).length !== 0 ? user.roles : {};

  return havePermissions(['tenant'], roles);
};

/**
 * Verify if a user has at least one allowed role.
 * @param {Object[]} allowedRoles Authorized or allowed roles.
 * @param {Object[]} roles User roles.
 * @returns {Boolean} True if it has at least one
 * allowed role, false if it has no allowed roles.
 */
export const havePermissions = (allowedRoles, roles) => {
  for (let i = 0; i < roles.length; i++) {
    const name = roles[i].name;

    if (allowedRoles.includes(name)) return true;
  }

  return false;
};

/**
 * Verify if a user has the restriction.
 * @param {Object[]} restriction
 * @param {Object[]} restrictions User restrictions.
 * @returns {Boolean} True if it has the restriction,
 * false if it has no the restriction.
 */
export const haveRestrictions = (restriction, restrictions) => {
  for (let i = 0; i < restrictions.length; i++) {
    const name = restrictions[i].name;

    if (restriction === name) return true;
  }

  return false;
};
