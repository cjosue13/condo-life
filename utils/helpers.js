import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export const randomString = length => {
  const chars = '0123456789';
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];

  return result;
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    //console.log('Authorization status:', authStatus);
  }
}

export const viewNotification = (title, message) => {
  PushNotification.localNotification({
    // Android Only Properties
    channelId: 'VikingozApp_id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    channelName: 'Vikingoz_full', // (required),
    title: title,
    message: message,
    allowWhileIdle: false,
    repeatTime: 1,
    smallIcon: 'ic_notification',
  });
};

export const getValueElements = element => {
  const values = [];

  if (element) values.push(element);

  return values;
};

/**
 * Remove null and empty string values from an array.
 * @returns {Array} array without null or empty string spaces.
 */
export const removeEmpty = array => {
  const newArray = array.filter(
    element => !(!element && element !== undefined),
  );

  return newArray.length === 0 ? [''] : newArray;
};

/**
 * Get the value of the objects contained in an array of the select.
 * @param {Array} values
 */

export const getValueElementsId = array => {
  const values = [];

  array.forEach(element => {
    values.push(element.id);
  });

  return values;
};
/**
 * Get the object of the objects contained in an array of the select.
 * @param {Array} objects
 */
export const getObjectElements = array => {
  const objects = [];

  array.forEach(element => {
    objects.push(element.object);
  });

  return objects;
};

/**
 * Load options for the select.
 * @param {Array} opts
 */
export const loadOptionsSelect = array => {
  let opts = '';

  array?.forEach((element, index) => {
    opts += element + (index + 1 !== array.length ? ' ' : '');
  });

  return opts;
};

/**
 * Load filiales selected.
 * @param {Array} opts
 */
export const loadFilialesSelected = (array, accountId) => {
  const opts = [];

  array.map((element, index) => {
    if (element.id) {
      if (element.account.id === accountId) {
        opts.push({key: element.id, label: element.name, value: element.id});
      }
    } else opts.push({key: index, label: element, value: element});
  });

  return opts;
};

/**
 * Load restrictions selected.
 * @param {Array} opts
 */
export const loadRestrictionsSelected = array => {
  const opts = [];

  array.map((element, index) => {
    if (element.id) {
      opts.push({key: element.id, label: element.name, value: element.id});
    } else opts.push({key: index, label: element, value: element});
  });

  return opts;
};

/**
 * Replace accented characters with non accented.
 * @param {*} s string to remove accents.
 */
export const removeAccents = s => {
  var r = s.toLowerCase();
  r = r.replace(new RegExp(/\s/g), '');
  r = r.replace(new RegExp(/[àáâãäå]/g), 'a');
  r = r.replace(new RegExp(/[èéêë]/g), 'e');
  r = r.replace(new RegExp(/[ìíîï]/g), 'i');
  r = r.replace(new RegExp(/ñ/g), 'n');
  r = r.replace(new RegExp(/[òóôõö]/g), 'o');
  r = r.replace(new RegExp(/[ùúûü]/g), 'u');

  return r;
};

export const randomColor = () =>
  ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7);
