import {
	IExecuteFunctions,
	IHookFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeParameters
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';
import { Person, SaplingError, SaplingUser, SaplingUsers } from './Sapling.types';

/**
 * Check if value returned by API is an error
 * @param response response obtained from Sapling API
 */
function isResponseError(response: SaplingUser | SaplingUsers | SaplingError): response is SaplingError {
	const err = (response as SaplingError)
	return (err.message !== undefined && err.status >= 300)
}

/**
 * Make an API request to Sapling REST API
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function saplingSingleRequest(this: IHookFunctions | IExecuteFunctions, transformer: (element: SaplingUser) => Person, method: string, endpoint: string, body?: IDataObject, query: INodeParameters = {}): Promise<Person> {
	const credentials = this.getCredentials('sapling');
	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}

	let options: OptionsWithUri = {
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${credentials.apiKey}`,
		},
		method: method,
		uri: `https://${credentials.subdomain}.saplingapp.io/api/v1/beta/${endpoint}`,
		json: true,
		body: body,
		qs: query,
	};

	try {
		console.log('options', options)
		const response: SaplingUser | SaplingError = await this.helpers.request(options);
		if (isResponseError(response)) {
			// Return a clear error
			console.error(response);
			throw new Error(response.message + ` HTTP Status: ${response.status}`);
		}
		return transformer(response)

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

/**
 * Make an API request to Sapling REST API
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function saplingCollectionRequest(this: IHookFunctions | IExecuteFunctions, transformer: (element: SaplingUsers) => Person[], method: string, endpoint: string, body?: IDataObject, query: INodeParameters = {}): Promise<any[]> {
	const credentials = this.getCredentials('sapling');
	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}

	let options: OptionsWithUri = {
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${credentials.apiKey}`,
		},
		method: method,
		uri: `https://${credentials.subdomain}.saplingapp.io/api/v1/beta/${endpoint}`,
		json: true,
		body: body,
		qs: query,
	};

	try {
		const responseBuffer: Person[] = [];
		let current_page = 0;
		let total_pages = 1;
		do {
			// Setup paging on top other filters
			let querystring = query
			if (current_page >= 1)
				querystring = Object.assign(query, { page: current_page + 1 })

			options = Object.assign(options, { qs: querystring })
			const response: SaplingUsers | SaplingError = await this.helpers.request(options);

			if (isResponseError(response)) {
				// Return a clear error
				console.error(response);
				throw new Error(response.message + ` HTTP Status: ${response.status}`);
			}
			responseBuffer.push(... (transformer(response)))

			// move cursor forward
			current_page = response.current_page
			total_pages = response.total_pages
		} while (current_page < total_pages);

		return responseBuffer

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
