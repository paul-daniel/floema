/* eslint-disable no-use-before-define */
export interface MetaData {
  title: string;
  description: string;
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
