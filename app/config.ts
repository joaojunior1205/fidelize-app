const ENV = {
  dev: {
    apiUrl: 'http://192.168.1.24:9001/api', // Update this with your actual development API URL
    jwtSecret: 'your_development_secret_key', // Adicione esta linha
  },
  prod: {
    apiUrl: 'https://your-production-api-url.com/api', // Update this with your actual production API URL
    jwtSecret: 'your_production_secret_key', // Adicione esta linha
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

export default getEnvVars();