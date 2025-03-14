import loadOpenApiFile from '../openapi/openapi_loader';
import fs from 'fs';

jest.mock('fs');

describe('loadOpenApiFile', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeAll(() => {
        // Suppress console.error during tests
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        // Restore console.error after tests
        consoleErrorSpy.mockRestore();
    });

    it('should return an error when the OpenAPI file cannot be loaded', () => {
        // Arrange: Mock fs.readFileSync to throw an error
        (fs.readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('File not found');
        });

        // Act: Call the function
        const result = loadOpenApiFile();

        // Assert: Check if the error is returned
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('File not found');
    });

}); 