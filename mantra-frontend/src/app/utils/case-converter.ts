/**
 * Converts an object's keys from camelCase to snake_case
 */
export function camelToSnakeCase(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => camelToSnakeCase(item));
    }

    return Object.keys(obj).reduce((result, key) => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

        const value = obj[key];
        result[snakeKey] = camelToSnakeCase(value);

        return result;
    }, {} as any);
}