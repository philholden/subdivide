Button
===========================

By default Button renders as a `secondary` button.

```playground
<Button>Hello</Button>
```

### Types

There are three `kind`s of Buttons `primary` | `secondary` | `tertiary`.

```playground
<div>
  <Button kind="primary">Submit</Button>
  <p />
  <Button kind="secondary">Back</Button>
  <p />
  <Button kind="tertiary">Cancel</Button>
</div>
```

### Disable

To disable set `disabled` prop to `true`.

```playground
<Button disabled={true}>
  Submit
</Button>

```

### Responsive

To make buttons stretch set `block` to `true`:

```playground
<Button block={true}>Hello</Button>
```

### Colors

Primary buttons can be themed. A single primary 

```playground
<div>
  <Button
    kind="primary"
    theme={{ primaryColor: '#5FB93D' }}
  >
    NCR
  </Button>
  {' '}
  <Button
    kind="primary"
    theme={{ primaryColor: '#0A4949' }}
  >
    Dark Theme
  </Button>
  {' '}
  <Button
    kind="primary"
    theme={{ primaryColor: '#F4B552' }}
  >
    Light Theme
  </Button>
</div>
```

Primary buttons color can be changed dynamically

```playground_norender
class App extends React.Component {
   constructor(props) {
    super(props);
    this.state = { theme: 
      { primaryColor: '#666666' }
    };
  }

  onChange(e) {
    const theme = {
      ...this.state.theme,
      primaryColor: e.target.value
    }
    this.setState({ theme })
  }

  render() {
    const theme = this.state.theme
    return (
      <div>
        <Button
          kind="primary"
          theme={theme}
        >
          NCR
        </Button>
        <p/>
        <input
          type="color"
          onChange={(e) => this.onChange(e)}
          value={theme.primaryColor}
        />
      </div>
    );
  }
}
ReactDOM.render(<App />, mountNode)
```

### Event Listeners

Event listenters will be passed on to button element. 

```playground
<Button onClick={()=> alert('click')}>
  Hello
</Button>
```
