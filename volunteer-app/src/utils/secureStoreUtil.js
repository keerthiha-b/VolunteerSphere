import * as SecureStore from 'expo-secure-store';

export function save(key, value) {
  SecureStore.setItem(key, value);
}
  
export function getValueFor(key) {
  let result = SecureStore.getItem(key);
  if (result) {
      return result;
  } else {
      alert('No values stored under that key.');
  }
}

export function remove(key) {
  SecureStore.deleteItemAsync(key);
}