export const BASE = "https://iostore.fivesolutions.net/api";

// login
export const LOGIN = `${BASE}/auth/login`;

// products
export const PRODUCTS = `${BASE}/admin/products`;
export const PRODUCTS_SEARCH = `${BASE}/admin/products/search`;
export const PENDING_PRODUCTS = `${BASE}/admin/products/pending`;
export const UPDATE_PRODUCT_STATUS = `${BASE}/admin/products/updatestatus`
export const DELETE_PRODUCT = `${BASE}/admin/products/delete`;


// orders
export const ORDERS = `${BASE}/admin/orders`
export const ORDER_DETIALS= `${BASE}/admin/orders/show`
export const UPDATE_ORDER_STATUS = `${BASE}/admin/orders/updatestatus`
export const FILTER_ORDERS_BY_DATE = `${BASE}/admin/orders/daterange`