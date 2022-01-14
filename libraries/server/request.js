import { SERVER_DOMAIN } from './constants';

/**
 * Request an individual object from the server specified by `SERVER_DOMAIN`.
 * @param  {string} collectionType - The type of collection to get, e.g. 'experiments'
 * @param  {string} accession - The accession of the object to get
 * @return {Promise} - The requested object from the server
 */
export const requestObject = async (collectionType, accession) => {
  const response = await fetch(`https://${SERVER_DOMAIN}/${collectionType}/${accession}/?frame=object&format=json`)
  return response.json()
}

/**
 * Request a list of objects from the server specified by `SERVER_DOMAIN`.
 * @param  {string} type - The type to request, e.g. 'Experiment'
 * @param  {array} paths - Paths of objects to request
 * @param  {array} fields - Fields to request for each object
 * @return {Promise} - Array of requested objects from the server
 */
export const requestObjectList = async (type, paths, fields) => {
  // Generate the query strings for the list of object paths and the requested fields.
  const pathQueries = paths.map(path => `@id=${path}`).join('&')
  const fieldQueries = fields.map(field => `field=${field}`).join('&')

  const response = await fetch(`https://${SERVER_DOMAIN}/search/?type=${type}&${pathQueries}&${fieldQueries}&limit=all&format=json`)
  const responseObject = await response.json()
  return responseObject['@graph']
}

// export const requestSearch('File', experiment.files, ['file_format', 'assembly', 'output_type', 'status', 'href'])
export const requestSearch = async (type, query, fields) => {
  const fieldQueries = fields.map(field => `field=${field}`).join('&')
  const url = `https://${SERVER_DOMAIN}/search/?type=${type}${query ? `&${query.format()}` : ''}&${fieldQueries}&limit=all&format=json`
  const response = await fetch(url)
  const responseObject = await response.json()
  return responseObject['@graph']
}
