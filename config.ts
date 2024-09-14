const ENV = {
  dev: {
    apiUrl: 'http://192.168.1.77:9001/api', // Updated with your IP address
  },
  prod: {
    apiUrl: 'https://seu-dominio-de-producao.com/api', // Update this when you have a production URL
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

export default getEnvVars();