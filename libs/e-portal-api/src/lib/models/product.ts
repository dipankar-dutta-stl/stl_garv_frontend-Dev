import { Manufacturer } from "./manufacturer";
import { ProductCategory } from "./product-category";

export class Product {

    product_id?: number;
    p_cat_id?: number;
    cat_id?: number;
    manufacturer_id?: number;
    date?: string;
    product_title?: string;
    product_url?: string;
    product_img1?: string;
    product_img2?: string;
    product_img3?: string;
    product_price?: number;
    product_psp_price?: number;
    product_desc?: string;
    product_features?: string;
    product_video?: string;
    product_keywords?: string;
    product_label?: string;
    status?: string;
    update_date?: string;
    belongs_to_prod_cat?: ProductCategory;
    belongs_to_manufacturer?: Manufacturer;
}
