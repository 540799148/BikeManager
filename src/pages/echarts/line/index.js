import React from 'react';
import {Card} from 'antd';
import ReactEcharts from 'echarts-for-react';
// 导入主题
import echartTheme from './../echartTheme';
// 按需加载
import echarts from 'echarts/lib/echarts';
// 导入饼图
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';

export default class Line extends React.Component {
  componentWillMount() {
    echarts.registerTheme('TU', echartTheme);
  }

  getOption = () => {
    let option = {
      title: {
        text: '用户骑行订单',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单量',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        }
      ]
    }
    return option;
  }
  getOption2 = () => {
    let option = {
      title: {
        text: '用户骑行订单',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['OFO订单量', '摩拜订单量']
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'OFO订单量',
          type: 'line',
          data: [1800, 3600, 4800, 8000, 9000, 16000, 20000],
        },
        {
          name: '摩拜订单量',
          type: 'line',
          data: [600, 2000, 3500, 5000, 7000, 10000, 12000],
        }
      ]
    }
    return option;
  }
  getOption3 = () => {
    let option = {
      title: {
        text: '用户骑行订单',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'OFO订单量',
          type: 'line',
          data: [100, 932, 601, 834, 1290, 1330, 220],
          areaStyle: {}
        }
      ]
    }
    return option;
  }

  render() {
    return (
        <div>
          <Card title="饼图表之一" className="card-wrap">
            <ReactEcharts option={this.getOption()} theme="TU" style={{height: 500}}/>
          </Card>
          <Card title="饼图表之二" className="card-wrap">
            <ReactEcharts option={this.getOption2()} theme="TU" style={{height: 500}}/>
          </Card>
          <Card title="饼图表之二" className="card-wrap">
          <ReactEcharts option={this.getOption3()} theme="TU" style={{height: 500}}/>
          </Card>
        </div>
    )
  }
}