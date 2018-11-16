import React, { Component } from "react";
import {
  Subdivide,
  SubdivideProvider,
  usePane,
  useSubdivide
} from "./components";
import { render, createRoot } from "react-dom";

const urls = [
  { url: "https://twitter.com", label: "NCR" },
  { url: "http://coenraets.org/present/react/#0", label: "Slide Show" },
  { url: "http://jsbin.com/vexawi/2/edit?js", label: "jsbin" },
  {
    url:
      "http://www.hccs.edu/media/houston-community-college/district/academic-affairs/4_Approved_Faculty_CurriculumVitae_Sample_02Feb2011.pdf?js",
    label: "CV"
  }
];
const colors = [
  { url: "red", label: "Red" },
  { url: "green", label: "Green" },
  { url: "blue", label: "Blue" },
  {
    url: "hotpink",
    label: "HotPink"
  }
];

const Iframe = ({ src }) => (
  <iframe
    title="me"
    src={src}
    frameBorder={"0"}
    style={{
      width: "100%",
      height: "100%"
    }}
  />
);

const Color = ({ src }) => {
  const pane = usePane();
  const { state, actions } = useSubdivide();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: src
      }}
    >
      color: {src}
      {pane.id}
      <button
        onClick={() =>
          actions.setDividerStyles({
            borderSize: 1,
            cellSpacing: 7,
            touchMargin: 2,
            borderColor: "#c0c0d0",
            cellSpaceColor: "#e0e0e0"
          })
        }
      >
        divider styles
      </button>
      {JSON.stringify(Object.keys(actions), null, 2)}
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

const Link = ({ onSelect, children }) => (
  <div onClick={onSelect} style={styles.linkOuter}>
    <div>{children}</div>
  </div>
);

const Menu = ({ urls, onSelect }) => (
  <div style={styles.menu}>
    {urls.map(({ url, label }, i) => (
      <Link onSelect={() => onSelect(url)} key={"n" + i}>
        {label}
      </Link>
    ))}
  </div>
);

class Chooser extends Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = { url: "" };
  }

  onSelect(url) {
    this.setState({ url });
  }

  render() {
    const { url } = this.state;

    return url === "" ? (
      <Menu urls={colors} onSelect={this.onSelect.bind(this)} />
    ) : (
      <Color src={url} />
    );
  }
}

const App = () => (
  <SubdivideProvider>
    <Subdivide DefaultComponent={Chooser} />
  </SubdivideProvider>
);

const styles = {
  menu: {
    display: "flex",
    flexDirection: "column",
    margin: 2,
    fontFamily: "sans-serif",
    colof: "#333"
  },
  linkOuter: {
    display: "flex",
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
    cursor: "pointer",
    transition: "color .3s",
    margin: 2
  }
};

const rootElement = document.getElementById("root");
render(<App />, rootElement);
