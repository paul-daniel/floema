/* eslint-disable no-use-before-define */
export interface Collection {
  id: string;
  uid: string;
  url: null;
  type: string;
  href: string;
  tags: unknown[];
  first_publication_date: string;
  last_publication_date: string;
  slugs: string[];
  linked_documents: unknown[];
  lang: string;
  alternate_languages: unknown[];
  data: DataCollection;
}

export interface DataCollection {
  title: string;
  description: string;
  products: Product[];
}

export interface Product {
  products_product: ProductsProduct;
}

export interface ProductsProduct {
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
  data : {
    title : string,
    image : {
      alt : unknown,
      url : string
    }
  }
}
