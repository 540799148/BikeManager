import React from 'react';
import {Menu, Icon} from 'antd';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {switchMenu} from "../../redux/action";
import MenuConfig from './../../config/menuConfig';
import './index.css'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class NavLeft extends React.Component {
  state = {
    currentKey: ''
  }

  handleClick = ({item, key}) => {
    const {dispatch} = this.props;
    dispatch(switchMenu(item.props.title))
    this.setState({
      currentKey: key
    })
  }

  componentWillMount() {
    const MenuTreeNode = this.renderMenu(MenuConfig);
    let currentKey = window.location.hash.replace(/#|\?.*$/g, '')
    this.setState({
      currentKey,
      MenuTreeNode,
    })
  }

  //菜单渲染
  renderMenu = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
            <SubMenu title={item.title} key={item.key}>
              {this.renderMenu(item.children)}
            </SubMenu>
        )
      }
      return <Menu.Item title={item.title} key={item.key}>
        <NavLink to={item.key}>{item.title}</NavLink>
      </Menu.Item>
    })
  }

  render() {
    return (
        <div>
          <div className="logo">
            <img src="/assets/logo-ant.svg" alt=""/>
            <h1>Uuunion</h1>
          </div>
          <Menu
              onClick={this.handleClick}
              theme="dark"
              mode="vertical"
              selectedKeys={this.state.currentKey}
          >
            {this.state.MenuTreeNode}
          </Menu>
        </div>
    )
  }
}

export default connect()(NavLeft);