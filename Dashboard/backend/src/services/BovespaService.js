import { doGetRequest } from "helpers/apiHelper";
import { SYMBOL_BRL, format } from "helpers/currencyHelper";

const TOKEN = "1pUWLRzvCHJYLs57qKDuhj"
const API_URL = "https://brapi.dev/api/quote/"

const getPrice = async (code) =>{
    const url = `${API_URL}${code}?token=${TOKEN}`;
    const resolver = data => format(data.results[0].regularMarketPrice, SYMBOL_BRL);
    const price = await doGetRequest(url, {}, resolver);
    return {code, price};
};

const fetchData = async () =>{
    const result = await Promise.all([
        getPrice('MGLU3'),
        getPrice('PETR4'),
        getPrice('EVEN3')
    ]);
    return result;
};

export default {fetchData}