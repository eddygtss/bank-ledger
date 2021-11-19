// const apiUrl = 'https://gembanking.com/api/v1';
const apiUrl = 'http://localhost:8081/api/v1';

const formatCurrency = amount => {
  return `$ ${amount.toFixed(2)}`;
};

const callApi = (endPoint, method = 'GET', body) => {

  const options = {
    method,
    body,
    headers: { "Content-Type": "application/json" },
  };

  return fetch(`${apiUrl}/${endPoint}`, options);
};

export {
  formatCurrency,
  callApi,
}