/* eslint-disable no-use-before-define */
export interface Product {
  collection: Collection;
  title: string;
  image: Image;
  model: Image;
  highlights: Highlight[];
  informations: Information[];
  link_text: string;
  link_url: LinkURL;
}

export interface Collection {
  id: string;
  type: string;
  tags: unknown[];
  lang: string;
  slug: string;
  first_publication_date: string;
  last_publication_date: string;
  uid: string;
  link_type: string;
  isBroken: boolean;
  data : {[x:string] : unknown}
}

export interface Highlight {
  highlights_icon: string;
  highlights_text: string;
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

export interface Information {
  information_label: string;
  information_description: string;
}

export interface LinkURL {
  link_type: string;
  url: string;
}
