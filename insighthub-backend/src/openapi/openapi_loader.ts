import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const loadOpenApiFile = (prefix: string) => {
    try {
        const swaggerPath = path.join(__dirname, 'swagger.yaml');
        const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');
        const swaggerDoc = yaml.load(swaggerContent) as object;

        if (prefix) {
            swaggerDoc.basePath = prefix;
        }

        return swaggerDoc;
    } catch (error) {
        console.error('Error loading OpenAPI file:', error);
        return error;
    }
};

export default loadOpenApiFile;