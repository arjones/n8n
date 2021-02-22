import {
	IExecuteFunctions,
	IHookFunctions,
} from 'n8n-core';

import {
	IDataObject,
  INodeExecutionData,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export function getItemCopy(items: INodeExecutionData[], properties: string[]): IDataObject[] { 
  return []
}

/**
 * Make an API request to Split REST API
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function splitRequest(this: IHookFunctions | IExecuteFunctions, method: string, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('split');
	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}

	if (query === undefined) {
		query = {};
	}

  if (body === undefined) {
		body = {};
	}

	const options: OptionsWithUri = {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${credentials.apiKey}`,
    },
    method: method,
    uri: `https://api.split.io/internal/api/v2/${endpoint}`,
    json: true,
    body: body,
    		// method,
		// form: body,
		// qs: query,
		// uri: `https://api.split.com/2010-04-01/Accounts/${credentials.accountSid}${endpoint}`,
		// auth: {
		// 	user: credentials.accountSid as string,
		// 	pass: credentials.authToken as string,
		// },
		// json: true,
	};

	try {
		return await this.helpers.request(options);

	} catch (error) {
		if (error.statusCode === 401) {
			// Return a clear error
      console.error(error);
			throw new Error('Credentials are not valid!');
		}

		if (error.response && error.response.body && error.response.body.message) {
			// Try to return the error prettier
			let errorMessage = `Error response [${error.statusCode}]: ${error.response.body.message}`;
			if (error.response.body.more_info) {
				errorMessage = `errorMessage (${error.response.body.more_info})`;
			}

			throw new Error(errorMessage);
		}

		// If that data does not exist for some reason return the actual error
		throw error;
	}
}
