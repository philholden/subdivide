import React, { PropTypes, Component } from 'react'
import Radium from 'radium'
import Table from './table'

export const RowFlex = Radium(({ children }) => (
  <div style={[ styles.row, styles.rowHover ]}>
    {children}
  </div>
))

export const HeadingsFlex = Radium(({ children }) => (
  <div style={styles.row}>
    {children}
  </div>
))

export const BodyFlex = Radium(({ children }) => (
  <div style={styles.body}>
    {children}
  </div>
))

export default class TableLeapfrog extends Component {
  static propTypes = {
    /**
     * The data you will map into a table
     */
    rows: PropTypes.arrayOf(React.PropTypes.object),
    /**
     * An array of objects one to represent each column.
     * Each object has two keys
     *
     * * `Heading`: a component that should render the column heading
     * * `Cell`: a component that accepts `row` as prop and maps
     * it onto the mark up for the desired column
     */
    cols: PropTypes.arrayOf(
      PropTypes.shape({
        Heading: PropTypes.element,
        Cell: PropTypes.element
      })
    ),
    /**
     * Template component for table body wrapper
     */
    Body: PropTypes.element,
    /**
     * Template component for row wrapper
     */
    Row: PropTypes.element,
    /**
     * Template component for headings row wrapper
     */
    Headings: PropTypes.element
  };

  static defaultProps = {
    Body: BodyFlex,
    Row: RowFlex,
    Headings: HeadingsFlex
  };

  render() {
    return <Table {...this.props} />
  }
}

export const colsFlex = cols => cols.map(({
  key, label, align
}, i) => ({
  Cell: Radium(({ row }) => (
    <div style={[
      styles.cell,
      i === 0 && styles.cellFirst,
      i === cols.length - 1 && styles.cellLast,
      align === 'right' && styles.cellAlignRight
    ]}>
      <div>{row[key]}</div>
    </div>
  )),
  Heading: Radium(() => (
    <div style={[
      styles.cell,
      styles.th,
      i === 0 && styles.cellFirst,
      i === cols.length - 1 && styles.cellLast,
      align === 'right' && styles.cellAlignRight
    ]}>
      {label}
    </div>
  ))
}))

export const styles = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    color: '#333',
    fontFamily: 'sans-serif',
    fontSize: 16
  },
  row: {
    display: 'flex',
    borderBottom: '1px solid #ccc'
  },
  rowHover: {
    ':hover': {
      backgroundColor: '#f1f3f1'
    }
  },
  cell: {
    display: 'flex',
    flex: 1,
    flexBasis: 0,
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 30,
    paddingRight: 30,
    minHeight: 52,
    boxSizing: 'border-box'

  },
  'cellFirst': {
    paddingLeft: 10
  },
  'cellLast': {
    paddingRight: 10
  },
  'cellAlignRight': {
    justifyContent: 'flex-end'
  },
  th: {
    fontWeight: 'bold'
  }
}
