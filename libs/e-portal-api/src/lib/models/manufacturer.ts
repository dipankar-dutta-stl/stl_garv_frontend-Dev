import { Product } from "./product";

export class Manufacturer {
    manufacturer_id?: number;
    manufacturer_title?: string;
    manufacturer_top?: string;
    manufacturer_image?: string;
    has_product?: Product[];
}
