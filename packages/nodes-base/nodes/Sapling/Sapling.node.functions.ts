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
 * Make an API request to Sapling REST API
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function saplingRequest(this: IHookFunctions | IExecuteFunctions, method: string, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('sapling');
	const subdomain = this.getNodeParameter('subdomain', 0)

	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}

	if (query === undefined) {
		query = {};
	}

	let options: OptionsWithUri = {
		headers: {
			'Accept': 'application/json',
			'Authorization': `Token ${credentials.apiKey}`,
		},
		method: method,
		uri: `https://${subdomain}.saplingapp.io/api/v1/beta/${endpoint}`,
		json: true,
		body: body,
		qs: query,
	};

	try {
		let response;
		let current_page = 1;
		const responseBuffer = new Array();
		do {
			console.log('================ options ================ \n', options)

			response = await this.helpers.request(options);
			console.log('\n\n================ response ================ \n', response)

			responseBuffer.push(...response.users)
			current_page = response['current_page']

			console.log('current_page', current_page)
			console.log('total_pages', response['total_pages'])

			// move cursor forward
			options = Object.assign(options, { qs: { page: current_page + 1 } })

		} while (current_page < response['total_pages']);

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
