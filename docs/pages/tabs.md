Tabs
===========================

Tabs receive an array of `tabs` as `props`. Where each `tab` is an object containing a `label` and a `component`. Labels are displayed in tabs buttons. When these tabs are clicked the corresponding component is displayed.

```playground_norender
const tabs = [
  {
    label: 'one',
    component: <div>One content</div>
  },
  {
    label: 'two',
    component: <div>Two content</div>
  },
  {
    label: 'three',
    component: <div>Three content</div>
  }
]

ReactDOM.render(
  <Tabs tabs={tabs}/>,
  mountNode
)
```

Tabs uses `flexbox` but some old browsers do not have proper support for this in these cases it falls back to an implementation that uses `table-cell`. In the example below we force this behaviour.

```playground_norender
const tabs = [
  {
    label: 'one',
    component: <div>One content</div>
  },
  {
    label: 'two',
    component: <div>Two content</div>
  },
  {
    label: 'three',
    component: <div>Three content</div>
  }
]

ReactDOM.render(
  <Tabs tabs={tabs} useTable={true} />,
  mountNode
)
```

We can wrap tabs in an outer component to create a custom tabs component that always adds a settings tab as the last tab.

```playground_norender
const ExtendedTabs = props => {
  const props2 = {
    ...props,
    tabs: [
      ...props.tabs,
      {
        label: 'settings',
        component: <div>Settings always added</div>
      }
    ]
  }
  return <Tabs {...props2} /> 
}

const tabs = [
  {
    label: 'one',
    component: <div>One content</div>
  }
]

ReactDOM.render(
  <ExtendedTabs tabs={tabs} />,
  mountNode
)
```

