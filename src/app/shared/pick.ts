//obj=====  req.query,  { page: '1', limit: '7' }
//Keys ======  paginationsFields,  [ 'page', 'limit', 'sortBy', 'sortOrdetr' ]

const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  Keys: K[],
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of Keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  return finalObj;
};

export default pick;
