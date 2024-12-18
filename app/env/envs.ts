import "dotenv/config";
import Joi from 'joi';

interface EnvVars {
    API_HTTP_BASE_URL: string;
    API_WS_BASE_URL: string;
}

const envsSchema = Joi.object({
    API_HTTP_BASE_URL: Joi.string().uri().required(),
    API_WS_BASE_URL: Joi.string().uri().required(),
  })
    .unknown(true);

const { error, value } = envsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const envVars: EnvVars = value;

export const envs = {
    apiHttpBaseUrl: envVars.API_HTTP_BASE_URL,
    apiWsBaseUrl: envVars.API_WS_BASE_URL,
};
