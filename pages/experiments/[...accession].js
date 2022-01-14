import React from 'react'
import { requestObject, requestObjectList, requestSearch } from '../../libraries/server/request'
import QueryString from '../../libraries/query-string'
import DataGrid from '../../components/data-grid'

const Summary = (props) => {
  const { experiment, organismScientificNames } = props
  return (
    <section>
      <h2>Summary</h2>
      <div className="data-section">
        <h3>Status</h3>
        <div className="data-item__data">{experiment.status}</div>

        <h3>Assay</h3>
        <div className="data-item__data">
          {experiment.assay_term_name}
          {experiment.assay_term_name !== experiment.assay_title &&
            <span>{` (${experiment.assay_title})`}</span>
          }
        </div>

        {experiment.target &&
          <>
            <h3>Target</h3>
            <div className="data-item__data">
              <a href={experiment.target['@id']}>{experiment.target.label}</a>
            </div>

            {experiment.target_expression_range_minimum !== undefined && experiment.target_expression_range_maximum !== undefined &&
              <>
                <h3>Target expression range minimum &ndash; maximum</h3>
                <div className="data-item__data">
                  {experiment.target_expression_range_minimum}% &ndash; {context.target_expression_range_maximum}%
                </div>
              </>
            }

            {experiment.target_expression_percentile !== undefined &&
              <>
                <h3>Target expression percentile</h3>
                <div className="data-item__data">{experiment.target_expression_percentile}</div>
              </>
            }
          </>
        }

        {experiment.control_type &&
          <div className="data-item">
            <h3>Control type</h3>
            <div className="data-item__data">{experiment.control_type}</div>
          </div>
        }

        {organismScientificNames.length > 0 &&
          <>
            <h3>Organisms</h3>
            <div className="data-item__data">
              {organismScientificNames.length > 0 &&
                <>
                  {organismScientificNames.map((name, i) => (
                    <React.Fragment key={name}>
                      {i > 0 ? <span> and </span> : null}
                      <i>{name}</i>
                    </React.Fragment>
                  ))}
                </>
              }
            </div>
          </>
        }
      </div>
    </section >
  )
}

const FileTable = ({ files }) => {
  const fileData = files.map(file => {
    return {
      id: file.title,
      row: [
        { id: 'title', content: file.title },
        { id: 'file_format', content: file.file_format },
        { id: 'assembly', content: file.assembly },
        { id: 'output_type', content: file.output_type },
        { id: 'status', content: file.status },
      ]
    }
  })

  return (
    <div className="file-grid">
      <DataGrid data={fileData} />
    </div>
  )
}

const Experiment = ({ experiment, organismScientificNames, files }) => {
  return (
    <main className="page page--experiment">
      {experiment &&
        <>
          <h1>Experiment {experiment.accession}</h1>
          <Summary experiment={experiment} organismScientificNames={organismScientificNames} />
          <FileTable files={files} />
        </>
      }
    </main>
  )
}

export default Experiment

export const getServerSideProps = async ({ params }) => {
  const { accession } = params
  const experiment = await requestObject('experiments', accession)
  const replicates = await requestObjectList('Replicate', experiment.replicates, ['library.biosample.donor.organism.scientific_name'])
  const organismScientificNames = [...new Set(replicates.map(replicate => replicate.library.biosample.donor.organism.scientific_name))]
  const fileQuery = new QueryString()
  fileQuery.addKeyValue('dataset', experiment['@id'])
  const files = await requestSearch('File', fileQuery, ['title', 'file_format', 'assembly', 'output_type', 'status', 'href'])
  return {
    props: { experiment, organismScientificNames, files },
  }
}
