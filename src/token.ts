export default class Token {
    address: string;
    decimals: number;
    constructor(address: string, decimals: number) {
        this.address = address;
        this.decimals = decimals;
    }
}
