export const numberToWords = (n : number) : number | string => {
  const words = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  return words[n] || n;
};

export const handleLinkResolver = (doc : {[x:string] : unknown}) => {
  if (doc?.type === 'product') {
    return `/detail/${doc?.uid}`;
  }
  if (doc?.type === 'about') {
    return '/about';
  }
  if (doc?.type === 'collections') {
    return '/collections';
  }
  return '/';
};
