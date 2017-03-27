import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import {
  cardinals,

  cornerPressed,
  hoverOverCorner,
  blurCorner
} from '../reducers';

const propTypes = {
  blurCorner: PropTypes.func,
  cornerPressed: PropTypes.func,
  hoverOverCorner: PropTypes.func
};

const mapStateToProps = null;
const mapDispatchToProps = {
  blurCorner,
  cornerPressed,
  hoverOverCorner
};

export class Corner extends Component {
  constructor(...props) {
    super(...props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
  }

  onMouseDown() {
    const { cornerPressed, corner, pane } = this.props;
    cornerPressed({ ...pane, corner });
  }

  onMouseEnter() {
    const { hoverOverCorner, corner, pane } = this.props;
    hoverOverCorner({
      paneId: pane.id,
      corner
    });
  }

  getStyles() {
    let { corner, color, size, subdivide, pane } = this.props;
    let { cornerHover } = subdivide;
    let offset = (size + 3) / 2;
    let outer = {
      width: size,
      height: size,
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0)',
      opacity: 1,
      display: subdivide.dividerDown ? 'none' : 'block'
    };

    if (corner === cardinals.ne) {
      outer = {
        ...outer,
        top: 0,
        right: 0,
        cursor: 'grab',
        transform: `translate3d(${offset}px, ${-offset}px, 0) rotate(225deg)`
      };
    } else if ( corner === cardinals.sw) {
      outer = {
        ...outer,
        bottom: 0,
        left: 0,
        cursor: 'grab',
        transform: `translate3d(${-offset}px, ${offset}px, 0) rotate(45deg)`
      };
    } else if ( corner === cardinals.se) {
      outer = {
        ...outer,
        bottom: 0,
        right: 0,
        cursor: 'grab',
        transform: `translate3d(${offset}px, ${offset}px, 0) rotate(315deg)`
      };
    } else if ( corner === cardinals.nw) {
      outer = {
        ...outer,
        top: 0,
        left: 0,
        cursor: 'grab',
        transform: `translate3d(${-offset}px, ${-offset}px, 0) rotate(135deg)`
      };
    }

    let hover = cornerHover &&
        cornerHover.paneId === pane.id &&
        cornerHover.corner === corner ?
        0 :
        offset;

    let inner = {
      border: '1px solid #c0c0d0',
      backgroundColor: color,
      width: '100%',
      height: '100%',
      transform: `translate3d(0,${hover}px,0)`,
      transition: 'transform .1s'
    };


    return { outer, inner };

  }

  render() {
    let styles = this.getStyles();
    return (
      <div
        key='outer'
        onMouseDown={ this.onMouseDown }
        onMouseEnter={ this.onMouseEnter }
        onMouseLeave={ this.props.blurCorner }
        style={ styles.outer }
        >
        <div style={ styles.inner } />
      </div>
    );
  }
}

Corner.propTypes = propTypes;
Corner.displayName = 'Corner';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Corner);
