import CustomException from "src/application/exceptions/CustomException";
import { BaseEntity } from "./BaseEntity";
import { ERROR_CARD000002 } from "src/application/exceptions/ErrorConstants";

export interface DataCardModel {
    email: string,
    card_number: string,
    cvv?: string,
    expiration_month: string,
    expiration_year: string
}

export class DataCard extends BaseEntity<DataCardModel> {
    public email: string;
    public card_number: string;
    public cvv: string;
    public expiration_month: string;
    public expiration_year: string;

    constructor(data: DataCardModel) {
        super();
        this.email = data.email;
        this.card_number = data.card_number;
        this.cvv = data.cvv;
        this.expiration_month = data.expiration_month;
        this.expiration_year = data.expiration_year;
    }
    private validateExpirationCard(expiration_year: string, expiration_month: string): void {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const expirationYear = parseInt(expiration_year, 10);
        const expirationMonth = parseInt(expiration_month, 10);
        if (expirationYear < currentYear || (expirationYear === currentYear && expirationMonth < currentMonth)) {
            throw new CustomException({...ERROR_CARD000002, details: `La tarjeta con fecha de expiración ${expiration_month}/${expiration_year} es inválida`});
        }
    }
    public toData(): DataCardModel {
        this.validateExpirationCard(this.expiration_year, this.expiration_month);
        return {
            email: this.email,
            card_number: this.card_number,
            // cvv: this.cvv,
            expiration_month: this.expiration_month,
            expiration_year: this.expiration_year
        };
    }
}