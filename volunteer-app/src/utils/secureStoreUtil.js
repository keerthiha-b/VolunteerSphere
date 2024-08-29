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
// export async function getValueFor(key) {
//   try {
//     let result = await SecureStore.getItemAsync(key);  // Make this asynchronous
//     if (result) {
//       return result;
//     } else {
//       alert('No values stored under that key.');
//       return null;  // Return null if no value found
//     }
//   } catch (error) {
//     console.error('Error retrieving secure store value:', error);
//     return null;
//   }
// }