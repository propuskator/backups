const fs                     = require('fs');
const path                   = require('path');
const dotenv                 = require('dotenv');
const { initLogger, LEVELS } = require('./extensions/Logger');

const logger = initLogger();

/**
 * Sets the default values for environment variables that are exported but have empty('') value
 * @param {String} defaultEnvsFilePath - The path to file with defaults for environment variables
 */
function setDefaultValuesForEmptyEnvs(defaultEnvsFilePath = '.env.defaults') {
    try {
        const envsFileBuffer = fs.readFileSync(path.resolve(__dirname, `../${defaultEnvsFilePath}`)); // eslint-disable-line no-sync
        const envsDefaults = dotenv.parse(envsFileBuffer);

        Object
            .entries(process.env)
            .forEach(([ envName, envValue ]) => {
                if (envValue === '' && envsDefaults[envName]) process.env[envName] = envsDefaults[envName];
            });

        Object
            .entries(envsDefaults)
            .forEach(([ key, value ]) => {
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            });
    } catch (error) {
        logger.log({
            level   : LEVELS.ERROR,
            message : error.message
        });
    }
}

module.exports = setDefaultValuesForEmptyEnvs;
