import React from 'react'
import BaseForm from './../../components/BaseForm/index';
import {Card, Button} from 'antd';
import axios from './../../axios/index';

export default class BikeMap extends React.Component {
  state = {
    bikeInfo: {}
  }

  map = {}

  formList = [
    {
      type: 'SELECT',
      label: '城市',
      field: 'city',
      initialValue: '1',
      width: 100,
      list: [{id: '0', name: '全部'}, {id: '1', name: '北京'}, {id: '2', name: '天津'}, {id: '3', name: '上海'}]
    },
    {
      type: '时间查询',
    },
    {
      type: 'SELECT',
      label: '订单状态',
      field: 'status',
      initialValue: '1',
      width: 100,
      list: [{id: '0', name: '全部'}, {id: '1', name: '进行中'}, {id: '2', name: '结束行程'}]
    }
  ];

  params = [];

  require = () => {
    axios.ajax({
      url: '/map/bike_list',
      data: {
        params: this.params,
      }
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          total_count: res.result.total_count
        })
        this.renderMap(res);
      }
    })
  }

  // 渲染地图数据
  renderMap = (res) => {
    let list = res.result.route_list;
    this.map = new window.BMap.Map('container');
    let gps1 = list[0].split(',');
    let startPoint = new window.BMap.Point(gps1[0], gps1[1]);
    let gps2 = list[list.length - 1].split(',');
    let endPoint = new window.BMap.Point(gps2[0], gps2[1]);

    this.map.centerAndZoom(endPoint, 11);

    //添加起始图标
    let startPointIcon = new window.BMap.Icon("/assets/start_point.png", new window.BMap.Size(36, 42), {
      imageSize: new window.BMap.Size(36, 42),
      anchor: new window.BMap.Size(18, 42)
    });

    let bikeMarkerStart = new window.BMap.Marker(startPoint, {icon: startPointIcon});
    this.map.addOverlay(bikeMarkerStart);

    let endPointIcon = new window.BMap.Icon("/assets/end_point.png", new window.BMap.Size(36, 42), {
      imageSize: new window.BMap.Size(36, 42),
      anchor: new window.BMap.Size(18, 42)
    });
    let bikeMarkerEnd = new window.BMap.Marker(endPoint, {icon: endPointIcon});
    this.map.addOverlay(bikeMarkerEnd);

    // 绘制行驶路线
    let routeList = [];
    list.forEach((item) => {
      let p = item.split(",");
      let point = new window.BMap.Point(p[0], p[1]);
      routeList.push(point);
    })

    let polyLine = new window.BMap.Polyline(routeList, {
      strokeColor: "#ef4136",
      strokeWeight: 2,
      strokeOpacity: 1
    });
    this.map.addOverlay(polyLine);

    // 服务区路线
    let serviceList = res.result.service_list;
    let servicePointist = [];
    serviceList.forEach((item) => {
      let point = new window.BMap.Point(item.lon, item.lat);
      servicePointist.push(point);
    })

    // 画线
    let polyServiceLine = new window.BMap.Polyline(servicePointist, {
      strokeColor: "#ef4136",
      strokeWeight: 3,
      strokeOpacity: 1
    });
    this.map.addOverlay(polyServiceLine);

    // 添加地图中的自行车
    let bikeList = res.result.bike_list;
    let bikeIcon = new window.BMap.Icon("/assets/bike.jpg", new window.BMap.Size(36, 42), {
      imageSize: new window.BMap.Size(36, 42),
      anchor: new window.BMap.Size(18, 42)
    });
    bikeList.forEach((item) => {
      let p = item.split(",");
      let point = new window.BMap.Point(p[0], p[1]);
      let bikeMarker = new window.BMap.Marker(point, {icon: bikeIcon});
      this.map.addOverlay(bikeMarker);
    })

    // 添加地图控件
    this.addMapControl();
  }

  // 添加地图控件
  addMapControl = () => {
    let map = this.map;
    // 左上角，添加比例尺
    let top_right_control = new window.BMap.ScaleControl({anchor: window.BMAP_ANCHOR_TOP_RIGHT});
    let top_right_navigation = new window.BMap.NavigationControl({anchor: window.BMAP_ANCHOR_TOP_RIGHT});
    //添加控件和比例尺
    map.addControl(top_right_control);
    map.addControl(top_right_navigation);
    map.enableScrollWheelZoom(true);
    // legend.addLegend(map);
  };

  componentWillMount() {
    this.require();
  }

  // 查询表单
  handleFilterSubmit = (filterParams) => {
    this.params = filterParams;
    this.require();
  }

  render() {
    return (
        <div>
          <Card className="card-wrap">
            <BaseForm formList={this.formList} filterSubmit={this.handleFilterSubmit}/>
          </Card>
          <Card className="card-wrap">
            <div>共100辆车</div>
            <div id="container" style={{height: 500}}></div>
          </Card>
        </div>
    )
  }
}