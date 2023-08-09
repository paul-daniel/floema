/* eslint-disable no-use-before-define */
export interface Home {
  gallery: Gallery[];
  collection: string;
  button: string;
}

export interface Gallery {
  image: Image;
}

export interface Image {
  dimensions: Dimensions;
  alt: null;
  copyright: null;
  url: string;
}

export interface Dimensions {
  width: number;
  height: number;
}
