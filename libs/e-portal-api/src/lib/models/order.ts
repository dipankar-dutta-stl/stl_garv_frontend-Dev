import { CustomerOrder } from "./cust-order";
import { Product } from "./product";
import { UserEcomm } from "./user";

export class Order {

    order_id?: number;
    customer_id?: number;
    invoice_no?: number;
    product_id?: number;
    qty?: number;
    size?: string;
    order_status?: string;
    order_date?: string;
    has_prod?: Product;
    belongs_to_customer?: UserEcomm;
    has_cust_ord?: CustomerOrder
}