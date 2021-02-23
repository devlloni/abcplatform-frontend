import config from './env';
const getPathname = () => {
    return config.env === 'PROD ' ? 'https://abc-platform.netlify.app' : 'http://localhost:3000';
}
export {
    getPathname
}