// const apiUrl = 'https://gembanking.com/api/v1';
const apiUrl = 'http://localhost:7474/api/v1';

const formatCurrency = amount => {
  return `$${amount.toFixed(2)}`;
};

const callApi = async (endPoint, method = 'GET', body) => {

  const options = {
    method,
    body,
    headers: { 'Content-Type': 'application/json' },
  };

  return await fetch(`${apiUrl}/${endPoint}`, options)
};

const regexAmount = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/g;

export {
    formatCurrency,
    callApi,
    regexAmount
}