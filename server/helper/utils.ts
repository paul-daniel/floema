import DocumentType from '../model/documentType.type';
import { COLOR_CONTESSA, COLOR_CADET_BLUE, COLOR_QUICKSAND } from './color';

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

export const backgroundColorResolver = (currentPage : string) : string => {
  if (currentPage === 'about') {
    return COLOR_CADET_BLUE;
  } if (currentPage === 'home') {
    return COLOR_CONTESSA;
  }
  return COLOR_QUICKSAND;
};
