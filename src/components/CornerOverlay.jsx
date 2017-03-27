import React, { Component } from 'react';
import {
  cardinals,
  directions,
  joinTypes
} from '../reducers';

export default class CornerOverlay extends Component {

  componentDidMount() {
    this.updateJoinOverlay();
    this.updateDivideOverlay();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.width === nextProps.width &&
      this.props.height === nextProps.height;
  }

  componentDidUpdate() {
    this.updateJoinOverlay();
    this.updateDivideOverlay();
  }

  updateDivideOverlay() {
    const { pane, subdivide } = this.props;
    if (!pane.canSplit || !subdivide.cornerDown) {
      return null;
    }
    const { corner } = subdivide.cornerDown;

    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    let { width, height, top, left } = pane;
    height = Math.round(height + top - (top || 0));
    width = Math.round(width + left - (left || 0));
    let dashRatio = 0.5;
    let dashWidth = 3;
    let dashSpacing = 20;
    let dashLength = dashRatio * dashSpacing;
    let offset = 34;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    if (corner === cardinals.sw) {
      for (let x = 0; x < width; x += dashSpacing) {
        ctx.rect(x, height - offset - dashWidth, dashLength, dashWidth);
      }

      for (let y = 0; y < height; y += dashSpacing) {
        ctx.rect(offset, height - y - dashLength, dashWidth, dashLength);
      }
    } else if (corner === cardinals.ne) {
      for (let x = 0; x < width; x += dashSpacing) {
        ctx.rect(width - x - dashLength, offset, dashLength, dashWidth);
      }

      for (let y = 0; y < height; y += dashSpacing) {
        ctx.rect(width - offset - dashWidth, y, dashWidth, dashLength);
      }
    } else if (corner === cardinals.nw) {
      for (let x = 0; x < width; x += dashSpacing) {
        ctx.rect(x, offset, dashLength, dashWidth);
      }

      for (let y = 0; y < height; y += dashSpacing) {
        ctx.rect(offset, y, dashWidth, dashLength);
      }
    } else if (corner === cardinals.se) {
      for (let x = 0; x < width; x += dashSpacing) {
        ctx.rect(
          width - x - dashLength,
          height - offset - dashWidth,
          dashLength,
          dashWidth
        );
      }

      for (let y = 0; y < height; y += dashSpacing) {
        ctx.rect(
          width - offset - dashWidth,
          height - y - dashLength,
          dashWidth,
          dashLength
        );
      }
    }

    ctx.fillStyle = '#999';
    ctx.closePath();
    ctx.fill('evenodd');
  }

  updateJoinOverlay() {
    const { pane } = this.props;
    if (!pane.joinDirection) {
      return null;
    }
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    let { width, height, top, left, joinDirection } = pane;
    height = Math.round(height + top - (top || 0));
    width = Math.round(width + left - (left || 0));
    let size = Math.min(width, height);
    let bodyHeight = ((size / 3) / 2) || 0;
    let bodyWidth = ((size / 3) / 2) || 0;
    let w2 = (width / 2) || 0;
    let h2 = (height / 2) || 0;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, 0);

    if (joinDirection === joinTypes.right) {
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.lineTo(0, h2 + bodyHeight);
      ctx.lineTo(bodyWidth, h2 + bodyHeight);
      ctx.lineTo(bodyWidth, h2 + bodyHeight * 2);
      ctx.lineTo(size / 2, h2);
      ctx.lineTo(bodyWidth, h2 - bodyHeight * 2);
      ctx.lineTo(bodyWidth, h2 - bodyHeight);
      ctx.lineTo(0, h2 - bodyHeight);
    }

    if (joinDirection === joinTypes.left) {
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.lineTo(width, h2 - bodyHeight);
      ctx.lineTo(width - bodyWidth, h2 - bodyHeight);
      ctx.lineTo(width - bodyWidth, h2 - bodyHeight * 2);
      ctx.lineTo(width - size / 2, h2);
      ctx.lineTo(width - bodyWidth, h2 + bodyHeight * 2);
      ctx.lineTo(width - bodyWidth, h2 + bodyHeight);
      ctx.lineTo(width, h2 + bodyHeight);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
    }

    if (joinDirection === joinTypes.up) {
      ctx.lineTo(0, height);
      ctx.lineTo(width, height);
      ctx.lineTo(w2 - bodyWidth, height);
      ctx.lineTo(w2 - bodyWidth, height - bodyHeight);
      ctx.lineTo(w2 - bodyWidth * 2, height - bodyHeight);
      ctx.lineTo(w2, height - size / 2);
      ctx.lineTo(w2 + bodyWidth * 2, height - bodyHeight);
      ctx.lineTo(w2 + bodyWidth, height - bodyHeight);
      ctx.lineTo(w2 + bodyWidth, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, 0);
    }

    if (joinDirection === joinTypes.down) {
      ctx.lineTo(0, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, 0);
      ctx.lineTo(w2 + bodyWidth, 0);
      ctx.lineTo(w2 + bodyWidth, bodyHeight);
      ctx.lineTo(w2 + bodyWidth * 2, bodyHeight);
      ctx.lineTo(w2, size / 2);
      ctx.lineTo(w2 - bodyWidth * 2, bodyHeight);
      ctx.lineTo(w2 - bodyWidth, bodyHeight);
      ctx.lineTo(w2 - bodyWidth, 0);
    }

    ctx.fillStyle = '#999';
    ctx.closePath();

    ctx.fill();
  }

  render() {
    let { subdivide } = this.props;
    let { joinDirection, canSplit } = this.props.pane;
    if (!subdivide.cornerDown && !subdivide.dividerDown) {
      return false;
    }

    if (!(joinDirection || canSplit)) {
      const { dividerDown } = subdivide;
      let cursor = null;
      if (!dividerDown) {
        cursor = dividerDown.direction === directions.row ?
          'col-resize' :
          'row-resize';
      }
      return (
        <div style={{
          cursor,
          height: '100%',
          position: 'absolute',
          top: 0,
          width: '100%'
        }}/>
      );
    }

    let { width, height, top, left } = this.props.pane;
    height = Math.round(height + top - (top || 0));
    width = Math.round(width + left - (left || 0));
    return (
      <canvas
        height={height}
        ref='canvas'
        style={{
          background: '#fff',
          left: 0,
          opacity: 0.9,
          position: 'absolute',
          top: 0
        }}
        width={ width }
      />
    );
  }
}
