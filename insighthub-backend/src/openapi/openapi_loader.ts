import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import {JsonObject} from "swagger-ui-express";

const loadOpenApiFile = (prefix: string) => {
    try {
        const swaggerPath = path.join(__dirname, 'swagger.yaml');
        const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');
        const swaggerDoc = yaml.load(swaggerContent) as JsonObject;

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