const DataGrid = ({ data, startingLine = 1 }) => {
  let rowLine = startingLine
  return data.reduce((acc, rowData) => {
    // Render the contents of the row.
    let colLine = 1
    const childCount = rowData.children ? rowData.children.length : 1
    const row = rowData.row.map((cell) => {
      const rowRender = (
        <div
          key={cell.id}
          style={{
            gridRow: `${rowLine} / ${rowLine + childCount}`,
          }}
          className="row-data"
        >
          <div className="cell">
            {cell.content}
          </div>
        </div>
      );
      colLine += cell.columns || 1
      return rowRender
    })

    // Render the child rows of the row, if any.
    const children = rowData.children ? <DataGrid data={rowData.children} startingLine={rowLine} /> : []
    rowLine += childCount
    return acc.concat(row).concat(children)
  }, [])
}

export default DataGrid
