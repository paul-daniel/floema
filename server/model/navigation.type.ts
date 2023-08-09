/* eslint-disable no-use-before-define */
export interface Navigation {
  list: List[];
}

export interface List {
  link: Link;
  text: string;
  url : string;
}

export interface Link {
  id: string;
  type: string;
  tags: unknown[];
  lang: string;
  slug: string;
  first_publication_date: string;
  last_publication_date: string;
  uid?: string;
  link_type: string;
  isBroken: boolean;
  url?: string;
}
