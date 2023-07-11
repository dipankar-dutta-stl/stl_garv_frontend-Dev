import { Product } from "./product";

export class ProductCategory {

    p_cat_id?: number;
    p_cat_title?: string;
    p_cat_top?: string;
    p_cat_image?: string;
    has_product?: Product[];
}
