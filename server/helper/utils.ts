import DocumentType from '../model/documentType.type';

export const numberToWords = (n : number) : number | string => {
  const words = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  return words[n] || n;
};

export const handleLinkResolver = (doc : {[x:string] : unknown}) => {
  if (doc?.type === DocumentType.PRODUCT) {
    return `/detail/${doc?.uid}`;
  }
  if (doc?.type === DocumentType.ABOUT) {
    return '/about';
  }
  if (doc?.type === DocumentType.COLLECTIONS) {
    return '/collections';
  }
  return '/';
};
