import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Pane from './Pane.jsx';
import Dividers from './Dividers.jsx';
import AnimationFrame from '../helpers/AnimationFrame';
import {
  cardinals,
  directions,
  downDividerSelector,
  splitTypes,

  cornerReleased,
  dividerReleased,
  dividerMoved,
  split,
  windowResize
} from '../reducers';

const minRatioChange = 20;
const mapStateToProps = null;
const mapDispatchToProps = {
  cornerReleased,
  dividerReleased,
  dividerMoved,
  split,
  windowResize
};

const propTypes = {
  DefaultComponent: PropTypes.element,
  cornerReleased: PropTypes.func,
  dividerReleased: PropTypes.func,
  dividerMoved: PropTypes.func,
  split: PropTypes.func,
  windowResize: PropTypes.func
};

export class Layout extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    const {
      cornerReleased,
      dividerReleased,
      dividerMoved,
      split,
      windowResize
    } = props;
    this.animationFrame = new AnimationFrame();

    this.onMouseMove = this.animationFrame.throttle(({ clientX, clientY }) => {
      const { subdivide } = this.props;

      if (subdivide.dividerDown) {
        const divider = subdivide.dividerDown;
        const {
          beforePaneId,
          afterPaneId,
          direction,
          parentSize,
          startX,
          startY
        } = downDividerSelector(subdivide);

        const delta = direction === directions.row ?
          clientX - startX :
          clientY - startY;
        const deltaRatio = delta / parentSize;
        const afterRatio = divider.afterRatio - deltaRatio;
        const beforeRatio = divider.beforeRatio + deltaRatio;
        if (
          beforeRatio * parentSize > minRatioChange &&
          afterRatio * parentSize > minRatioChange
        ) {
          dividerMoved(beforePaneId, afterPaneId, beforeRatio, afterRatio);
        }
      }

      if (subdivide.cornerDown) {
        const pane = subdivide.cornerDown;
        const { width, height, left, top, id, corner } = pane;

        if (clientX > left && clientX < left + width &&
          clientY > top && clientY < top + height) {

          if (corner === cardinals.sw) {
            if (clientX - left > 25) {
              split(id, splitTypes.left, clientX, clientY);
            } else if (top + height - clientY > 25) {
              split(id, splitTypes.below, clientX, clientY);
            }
          }

          if (corner === cardinals.ne) {
            if (left + width - clientX > 25) {
              split(id, splitTypes.right, clientX, clientY);
            } else if (clientY - top > 25) {
              split(id, splitTypes.above, clientX, clientY);
            }
          }

          if (corner === cardinals.se) {
            if (left + width - clientX > 25) {
              split(id, splitTypes.right, clientX, clientY);
            } else if (top + height - clientY > 25) {
              split(id, splitTypes.below, clientX, clientY);
            }
          }

          if (corner === cardinals.nw) {
            if (clientX - left > 25) {
              split(id, splitTypes.left, clientX, clientY);
            } else if (clientY - top > 25) {
              split(id, splitTypes.above, clientX, clientY);
            }
          }
        }
      }

    });

    this.onMouseUp = () => {
      const { subdivide } = this.props;
      if (subdivide.dividerDown) {
        dividerReleased();
      }
      // give pane onMouseUp a chance to fire
      setTimeout(()=>{
        if (subdivide.cornerDown) {
          cornerReleased();
        }
      }, 10);
    };

    window.addEventListener('resize', () => {
      windowResize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);


    windowResize(window.innerWidth, window.innerHeight);
  }

  componentWillUnmount() {
    this.animationFrame.stop();
  }

  render() {
    const { subdivide, DefaultComponent } = this.props;
    const panes = Object.keys(subdivide.panesById)
      .map(key => subdivide.panesById[key])
      .filter(pane => !pane.isGroup)
      .map(pane => {
        return (
          <Pane
            DefaultComponent={ DefaultComponent }
            key={ pane.id }
            pane={ pane }
            subdivide={ subdivide }
          />
        );
      });

    return (
      <div>
        { panes }
        <Dividers
          dividers={ subdivide.dividers }
          subdivide={ subdivide }
        />
      </div>
    );
  }
}

Layout.propTypes = propTypes;
Layout.displayName = 'Layout';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
