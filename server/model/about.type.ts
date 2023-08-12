/* eslint-disable no-use-before-define */
export interface AboutData {
  gallery: Gallery[];
  body: Body[];
}

export interface Body {
  primary: Primary;
  items: Gallery[];
  id: string;
  slice_type: string;
  slice_label: null;
}

export interface Gallery {
  image?: Image;
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

export interface Primary {
  text?: string;
  label?: null | string;
  description?: Description[];
  image?: Image;
  type?: string;
  title?: string;
  'full_width'?: string;
}

export interface Description {
  type: 'paragraph';
  text: string;
  spans: unknown[];
}
