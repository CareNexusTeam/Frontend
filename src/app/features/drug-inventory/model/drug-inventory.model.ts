export interface Drug{
    drugId?:number;
    drugName:number;
    category:string;
    quantityInStock:number;
    reorderLevel:number;
    pricePerUnit:number;
    expiryDate:string;
    status:'Available'| 'OutOfStock';
}