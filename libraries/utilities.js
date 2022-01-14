import _ from 'underscore'

export const biosampleOrganismNames = (biosamples) => {
    return _.uniq(biosamples.map((biosample) => biosample.organism.scientific_name));
}
