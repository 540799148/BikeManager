import React from 'react';
import {Row, Col} from 'antd';
import './index.css';
import Util from '../../utils/utils';
import axios from '../../axios';

export default class Header extends React.Component {
  state = {
    userName: '',
  };

  componentWillMount() {
    this.setState({
      userName: 'tutu',
    })
    setInterval(() => {
      let sysTime = Util.formateDate(new Date().getTime());
      this.setState({
        sysTime
      })
    }, 1000)
    this.getWeatherAPIData();
  }

  getWeatherAPIData = () => {
    let city = '北京';
    axios.jsonp({
      url: 'http://api.map.baidu.com/telematics/v3/weather?location=' + encodeURIComponent(city) + '&output=json&ak=G1XeD7Qw07a7VmfgpKm4QYqpSu'
    }).then((res) => {
      if (res.status === 'success') {
        let data = res.results[0].weather_date[0];
        this.setState({
          dayPictureUrl: data.dayPictureUrl,
          weather: data.weather
        })
      }
    })
  }

  render() {
    const {menuName, menuType} = this.props;
    return (
        <div className="header">
          <Row className="header-top">
            {
              menuType ?
                  <Col span={6} className="logo">
                    <img src="/assets/logo-ant.svg" alt=""/>
                    <span>Uuunion</span>
                  </Col>
                  : ''
            }
            <Col span={menuType ? 18 : 24}>
              <span>欢迎，{this.state.userName}</span>
              <a href="#">退出</a>
            </Col>
          </Row>
          {
            menuType ? '' :
                <Row className="breadcrumb">
                  <Col span={4} className="breadcrumb-title">
                    {menuName || '首页'}
                  </Col>
                  <Col span={20} className="weather">
                    <span className="date">{this.state.sysTime}</span>
                    <span className="weather-detail">
                <img src={this.state.dayPictureUrl} alt=""/>
                      {this.state.weather}
              </span>
                  </Col>
                </Row>
          }
        </div>
    )
  }
}