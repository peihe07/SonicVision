interface ApiConfig {
    baseURL: string;
    timeout: number;
    headers: {
        'Content-Type': string;
        'Accept': string;
    };
}

const config: ApiConfig = {
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

export default config; 