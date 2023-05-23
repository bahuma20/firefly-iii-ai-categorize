class MissingEnvironmentVariableException extends Error {
    variableName;

    constructor(variableName) {
        super(`The required environment variable '${variableName}' is missing`);

        this.variableName = variableName;
    }
}

export function getConfigVariable(name, defaultValue = null) {
    if (!process.env.hasOwnProperty(name) || process.env[name] == null) {
        if (defaultValue == null) {
            throw new MissingEnvironmentVariableException(name)
        }

        return defaultValue;
    }

    return process.env[name];
}