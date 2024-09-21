const ENV = {
  dev: {
    apiUrl: 'http://192.168.18.5:9001/api', // Updated with your IP address
    jwtSecret: 'your_jwt_secret_here', // Substitua por uma chave secreta segura
  },
  prod: {
    apiUrl: 'https://seu-dominio-de-producao.com/api', // Update this when you have a production URL
    jwtSecret: 'your_production_jwt_secret_here', // Substitua por uma chave secreta segura para produção
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

export default getEnvVars();