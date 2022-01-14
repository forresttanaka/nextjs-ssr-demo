import Link from 'next/link'

const SearchExperiments = ({ results }) => {
  return (
    <>
      {results.map(experiment => {
        return (
          <div key={experiment.accession}>
            <Link href={experiment['@id']}>
              <a>
                {experiment.accession}
              </a>
            </Link>
          </div>
        )
      })}
    </>
  )
}

export default SearchExperiments

export const getServerSideProps = async () => {
  const response = await fetch('https://test.encodedcc.org/search/?type=Experiment&limit=5&format=json')
  const data = await response.json()
  return {
    props: {
      results: data['@graph']
    }
  }
}
