import React from 'react';
import {Card, Button, Radio} from 'antd';
import './ui.css'

export default class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      size: 'default'
    }
  }

  handleCloseLoading = () => {
    this.setState({
      loading: false
    })
  };

  handleChange = (e) => {
    this.setState({
      size: e.target.value,
    })
  }

  render() {
    return (
        <div>
          <Card title="基础按钮" className="card-wrap">
            <Button type="primary">button</Button>
            <Button>button</Button>
            <Button type="dashed">button</Button>
            <Button type="danger">button</Button>
            <Button disabled>button</Button>
          </Card>
          <Card title="图形按钮" className="card-wrap">
            <Button icon="plus">add</Button>
            <Button icon="edit">edit</Button>
            <Button icon="delete">delete</Button>
            <Button shape="circle" icon="search"></Button>
            <Button icon="search">search</Button>
            <Button icon="download">download</Button>
          </Card>
          <Card title="Loading按钮" className="card-wrap">
            <Button type="primary" loading>Loading</Button>
            <Button type="primary" size="small" loading={false}>Loading</Button>
            <Button type="primary" loading={this.state.loading}>Click me!</Button>
            <Button type="primary" icon="poweroff" onClick={this.handleCloseLoading}>Click me!</Button>
            <Button shape="circle"/>
          </Card>
          <Card title="按钮组" style={{marginBottom:'10px'}}>
            <Button.Group>
              <Button type="primary" icon="left">Go back</Button>
              <Button type="primary" icon="right">Go forward</Button>
            </Button.Group>
          </Card>
          <Card title="按钮尺寸" className="card-wrap">
            <Radio.Group value={this.state.size} onChange={this.handleChange}>
              <Radio value="small">small</Radio>
              <Radio value="default">default</Radio>
              <Radio value="large">large</Radio>
            </Radio.Group>
            <Button type="primary" size={this.state.size}>button</Button>
            <Button size={this.state.size}>button</Button>
            <Button type="dashed" size={this.state.size}>button</Button>
            <Button type="danger" size={this.state.size}>button</Button>
          </Card>
        </div>
    )
  }
}