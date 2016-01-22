TableLeapfrog
===========================

TableLeapfrog renders a table in a Leapfrog style.

```playground_norender
const data = [
  { name: 'Luke Skywalker','height':'172', mass: '77' },
  { name: 'C-3PO',height: '167', mass: '75' },
  { name: 'R2-D2',height: '96', mass: '32' },
  { name: 'Darth Vader',height: '202', mass: '136' },
  { name: 'Leia Organa',height: '150', mass: '49' }
]

const cols = [
  { key: 'name', label: 'Name', align: 'left' },
  { key: 'mass', label: 'Mass', align: 'right' },
  { key: 'height', label: 'Height', align: 'right' }
]

ReactDOM.render(
  <TableLeapfrog
    rows={data}
    cols={colsFlex(cols)}
  />,
  mountNode
)
```
