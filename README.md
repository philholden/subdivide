# Subdivide Layout

[![travis build](https://img.shields.io/travis/philholden/subdivide.svg?style=flat-square)](https://travis-ci.org/philholden/subdivide)
[![codecov coverage](https://img.shields.io/codecov/c/github/philholden/subdivide.svg?style=flat-square)](https://codecov.io/github/philholden/subdivide)
[![version](https://img.shields.io/npm/v/subdivide.svg?style=flat-square)](http://npm.im/subdivide)
[![downloads](https://img.shields.io/npm/dm/subdivide.svg?style=flat-square)](http://npm-stat.com/charts.html?package/subdivide&from=2015-08-01)
[![CC0 License](https://img.shields.io/npm/l/subdivide.svg?style=flat-square)](https://creativecommons.org/publicdomain/zero/1.0/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

[![Video](http://img.youtube.com/vi/3ePrvrx9otk/0.jpg)](http://www.youtube.com/watch?v=3ePrvrx9otk)

_(Click image to watch video)_

Split pane layout system for React. Each pane can be subdivided and any widget assigned to any pane allowing users define layout. Panes can be:

* infinitively subdivided
* subdivided horizontally or vertically
* subdivided by dragging corners
* resized by dragging edges
* merged by dragging corners onto adjacent panes 

When a new pane is created the user can chose which component to display in that pane. The result is an application where the user can decide on an interface that suits their work flow.

It should also be possible to quickly mash up applications out of preexisting parts.

----

## Run Example
```bash
git clone git@github.com:philholden/subdivide.git
npm install
npm start
```

Open the following link in a browser:

http://localhost:3000/examples/

----

## Usage

You can install Subdivide with `npm` and then use WebPack or Browserify to import / require it. 

```bash
npm install subdivide
```

Subdivide exposes the Subdivide component and its reducer.

`<Subdivide>` acts like a chameleon, `reducer` is a named export of the package.

* If you use it directly, it will create its own store and use it;
* If you `connect()` it to some part of the app's state, it will assume you have mounted the reducer there.

The reason for these two modes is because Subdivide should be usable as is, but it would also be nice to mount its state to an existing reducer tree.

For example:

## Normal usage

```js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Subdivide from 'subdivide';

class IframeComponent extends Component {
  render() {
    return (
      <iframe src="index2.html" frameBorder={'0'} style={{
         width: '100%',
         height: '100%'
      }} />
    );
  }
}

ReactDOM.render(
  <Subdivide DefaultComponent={IframeComponent} iframeSafe={true} />,
  document.getElementById('root')
);
```

NOTE: In Chrome iframes are reloaded whenever a sibling element that appears above them is removed from the DOM. If `iframeSafe` is set to `true` then when a pane is removed it will be replaced by an empty `<div></div>` this will prevent iframes reloading when panes are deleted (i.e. merged).

## Usage with `connect()`

```js
import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import ReactDOM from 'react-dom';
import Subdivide, { reducer as subdivide } from 'subdivide';
import {connect, Provider} from 'react-redux';

const store = createStore(combineReducers({
  subdivide,
  // you app's reducers
}), {
  // haha! you can pass persisted state
  subdivide: {"rootId":"1","borderSize":1,"cellSpacing":3,"touchMargin":2,"width":612,"height":658,"panes":{"0":{"id":"0","childIds":[],"isGroup":false,"parentId":"1","splitRatio":0.7026143790849673,"top":0,"left":0,"width":429.99999999999994,"height":658,"joinDirection":false},"1":{"id":"1","childIds":["0","3"],"isGroup":true,"direction":"ROW","splitRatio":1,"top":0,"left":0,"width":612,"height":658},"2":{"id":"2","childIds":[],"isGroup":false,"parentId":"3","splitRatio":0.5136778115501519,"top":323,"left":432.99999999999994,"width":179.00000000000003,"height":334.99999999999994,"joinDirection":false},"3":{"id":"3","childIds":["4","2"],"isGroup":true,"direction":"COL","parentId":"1","splitRatio":0.29738562091503273,"top":0,"left":432.99999999999994,"width":179.00000000000003,"height":658,"joinDirection":false},"4":{"id":"4","childIds":[],"isGroup":false,"parentId":"3","splitRatio":0.48632218844984804,"top":0,"left":432.99999999999994,"width":179.00000000000003,"height":320,"joinDirection":false}},"dividers":{"0n3":{"id":"0n3","top":0,"left":429.99999999999994,"width":3,"height":658,"beforePaneId":"0","afterPaneId":"3","beforeRatio":0.7026143790849673,"afterRatio":0.29738562091503273,"direction":"ROW","parentSize":612},"4n2":{"id":"4n2","top":320,"left":432.99999999999994,"width":179.00000000000003,"height":3,"beforePaneId":"4","afterPaneId":"2","beforeRatio":0.48632218844984804,"afterRatio":0.5136778115501519,"direction":"COL","parentSize":658}}}
});

class IframeComponent extends Component {
  render() {
    return (
      <iframe src="index2.html" frameBorder={'0'} style={{
         width: '100%',
         height: '100%'
      }} />
    );
  }
}

const ConnectedSubdivide = connect(
  // Tell where to grab the relevant state
  state => ({ subdivide: state.subdivide })
)(Subdivide);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedSubdivide DefaultComponent={IframeComponent} />
  </Provider>,
  document.getElementById('root')
);
```

----

## Thanks

Subdivide was inspired by [Blender's](http://blender.org) subdividable UI. I have wanted to implement this on the web for ages. Final kick to get it done was seeing [this discussion](https://github.com/gaearon/redux-devtools/issues/41#issuecomment-129898889) on the `redux-devtools` repo.

Subdivide uses [Redux](https://github.com/rackt/redux) to manage state. Thanks to [@gaearon](https://github.com/gaearon) for the great library, talks, docs and feedback.

Work began in a hackathon at [NCR Edinburgh](http://ncredinburgh.com). A big thanks to them for allowing it to be open sourced so I can continue to work on it in my own time. NCR is [hiring](http://ncredinburgh.com/jobs/vacancies/java-javascript-software_engineer) if you like React and Redux (and Scotland) they are a great place to work. 
