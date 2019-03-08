import React from 'react';
import {Row, Col} from 'antd';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/home';
import NavLeft from "./components/NavLeft";
import './style/common.css';

export default class Admin extends React.Component {

  render() {
    return (
        <div>
          <Row className="container">
            <Col span={3} className="nav-left">
              <NavLeft>NavLeft</NavLeft>
            </Col>
            <Col span={21} className="main">
              <Header>Header</Header>
              <Row className="content">
                {/*<Home></Home>*/}
                {this.props.children}
              </Row>
              <Footer>Footer</Footer>
            </Col>
          </Row>
        </div>
    );
  }
}