import React from 'react'

const Table = ({
  rows,
  cols=[],
  Body=TableBody,
  Row=TableRow,
  Headings=Row
}) => {

  return (
    <Body>
      <Headings>
        { cols.map(({ Heading }, i) => <Heading key={i} />) }
      </Headings>
      {
        rows.map((row, i) => (
          <Row key={i} row={row} cols={cols}>
            {cols.map(({ Cell }, i) => <Cell row={row} key={i}/>)}
          </Row>
        ))
      }
    </Body>
  )
}

const TableRow = ({ children }) => (
  <tr>
    {children}
  </tr>
)

const TableBody = ({ children }) => (
  <table>
    <tbody>
      {children}
    </tbody>
  </table>
)

export default Table
