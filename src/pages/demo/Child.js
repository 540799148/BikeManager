import React from 'react';

export default class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    console.log('did mount');
  }

  componentWillReceiveProps(newProps) {
    console.log('receive props' + newProps.name);
  }

  shouldComponentUpdate() {
    console.log('should update')
  }

  componentWillUpdate() {
    console.log('will update')
  }

  componentDidUpdate() {
    console.log('did update')
  }

  render() {
    return <div>
      <p>这里是测试子组件的生命周期</p>
      <p>{this.props.name}</p>
    </div>
  }
}