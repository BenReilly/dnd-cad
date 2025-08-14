const fourDropOne = () => {
  const results = [];
  for (let i = 0; i < 4; i++) {
    results.push(Math.ceil(Math.random() * 6));
  }
  results.sort((a, b) => b - a).pop();
  return results.reduce((acc, el) => el + acc, 0);
};

const validStats = (statSet: number[]): boolean => {
  // adaapted from PHB p 13 Ability Score Point Cost
  const pointVals = [
    -55, -9, -7, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 7, 9, 11, 14, 17,
  ];
  return statSet.reduce((acc, el) => pointVals[el] + acc, 0) >= 27;
};

export const generateStatSet = (): number[] => {
  const statSet = [];
  for (let i = 0; i < 6; i++) {
    statSet.push(fourDropOne());
  }
  return validStats(statSet) ? statSet : generateStatSet();
};

// export function randomArrayElement<T>(anArray: T[]): T {
//   return anArray[Math.floor(Math.random() * anArray.length)];
// }

// Overload: no property given -> return T
export function randomArrayElement<T>(arr: T[]): T;

// Overload: property key given -> return that property's type
export function randomArrayElement<T, K extends keyof T>(
  arr: T[],
  prop: K,
): T[K];

export function randomArrayElement<T, K extends keyof T>(
  arr: T[],
  prop?: K,
): T | T[K] {
  const el = arr[Math.floor(Math.random() * arr.length)];
  return prop ? el[prop] : el;
}
