import React from 'react';
import {Card, Tabs, message, Icon} from 'antd';
import './ui.css'

const TabPane = Tabs.TabPane;

export default class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
  }
  callback = (key) => {
    message.info("您选择了" + key);
  };

  componentWillMount() {
    const panes = [
      {
        title: 'Tab 1',
        content: 'Content of Tab Pane 1',
        key: '1'
      },
      {
        title: 'Tab 2',
        content: 'Content of Tab Pane 2',
        key: '2'
      },
      {
        title: 'Tab 3',
        content: 'Content of Tab Pane 3',
        key: '3'
      }
    ];
    this.setState({
      activeKey: panes[0].key,
      panes
    })
  }

  onChange = (activeKey) => {
    this.setState({
      activeKey
    })
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const panes = this.state.panes;
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push({title: activeKey, content: 'Content of new Tab', key: activeKey});
    this.setState({panes, activeKey});
  }

  remove = (targetKey) => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({panes, activeKey});
  }

  render() {
    return (
        <div>
          <Card title="Tab页签" className="card-wrap">
            <Tabs defaultActiveKey="1" onChange={this.callback}>
              <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
              <TabPane tab="Tab 2" key="2" disabled>Content of Tab Pane 2</TabPane>
              <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
            </Tabs>
          </Card>
          <Card title="Tab页签" className="card-wrap">
            <Tabs defaultActiveKey="1" onChange={this.callback}>
              <TabPane tab={<span><Icon type="plus"/>Tab 1</span>} key="1">Content of Tab Pane 1</TabPane>
              <TabPane tab={<span><Icon type="edit"/>Tab 1</span>} key="2">Content of Tab Pane 2</TabPane>
              <TabPane tab={<span><Icon type="delete"/>Tab 1</span>} key="3">Content of Tab Pane 3</TabPane>
            </Tabs>
          </Card>
          <Card title="Tab页签" className="card-wrap">
            <Tabs
                onChange={this.onChange}
                activeKey={this.state.activeKey}
                onEdit={this.onEdit}
                type="editable-card"
            >
              {
                this.state.panes.map((panel) => {
                  return <TabPane
                      tab={panel.title}
                      key={panel.key}
                  />
                })
              }
            </Tabs>
          </Card>
        </div>
    )
  }
}