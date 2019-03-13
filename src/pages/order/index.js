import React from 'react';
import {Card, Form, Select, DatePicker, Button, Table, Modal} from 'antd';
import axios from './../../axios/index';
import Utils from './../../utils/utils';
// import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';

// moment.locale('zh-cn');

const Option = Select.Option;
const {RangePicker} = DatePicker;

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '订单编号',
          dataIndex: 'order_sn',
          align: 'center'
        },
        {
          title: '车辆编号',
          dataIndex: 'user_id',
          align: 'center'
        },
        {
          title: '用户名',
          dataIndex: 'user_name',
          align: 'center'
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          align: 'center'
        },
        {
          title: '里程',
          dataIndex: 'distance',
          align: 'center',
          render(distance) {
            return distance / 1000 + 'Km'
          }
        },
        {
          title: '行驶时长',
          dataIndex: 'total_time',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          render(status) {
            return status === 1 ? "行驶中" : "已完成"
          }
        },
        {
          title: '开始时间',
          dataIndex: 'start_time',
          align: 'center'
        },
        {
          title: '结束时间',
          dataIndex: 'end_time',
          align: 'center'
        },
        {
          title: '订单金额',
          dataIndex: 'total_fee',
          align: 'center'
        },
        {
          title: '实付金额',
          dataIndex: 'user_pay',
          align: 'center'
        }],
      list: [],
      seletedItem: ''
    }
  }

  componentDidMount() {
    const data = [];
    data.map((item, index) => {
      item.key = index
    })
    this.setState({
      data
    })
    this.request();
  }

  params = {page: 1}

  request = () => {
    let _this = this;
    axios.ajax({
      url: '/order/list',
      data: {
        params: {
          page: this.params.page
        }
      }
    }).then((res) => {
      this.setState({
        list: res.result.item_list.map((item, index) => {
          item.key = index;
          return item;
        }),
        pagination: Utils.pagination(res, (current) => {
          // console.log(current);
          _this.params.page = current;
          _this.request();
        })
      })
    })
  }

  info = () => {
    Modal.info({
      title: '温馨提示',
      content: (
          <div>
            <p>该行程订单已结束</p>
          </div>
      ),
    });
    this.request();
  }

  openOrderDetail = () => {
    let item = this.state.selectedRowKeys;
    if (!item) {
      Modal.info({
        title: '信息',
        content: '请选择一条订单进行结束'
      })
      return
    }
    window.open(`/#/common/order/detail/${item.id}`, '_blank')
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    // const selectedRowKeys = this.state.selectedRowKeys;
    const rowSelection = {
      columnWidth: '60px',
      type: 'radio',
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys
        })
      }
    };

    return (
        <div>
          <Card className="card-wrap">
            <Form layout="inline">
              <Form.Item label="城市">
                {
                  getFieldDecorator('city')(
                      <Select placeholder="北京" style={{width: 90}}>
                        <Option value="1">北京</Option>
                        <Option value="2">上海</Option>
                        <Option value="3">天津</Option>
                        <Option value="4">杭州</Option>
                      </Select>
                  )
                }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('time')(
                      <RangePicker locale={locale}/>
                  )
                }
              </Form.Item>
              <Form.Item label="订单状态">
                {
                  getFieldDecorator('orderState', {
                    initialValue: '行程结束'
                  })(
                      <Select defaultValue="2" style={{width: 120}}>
                        <Option value="1">进行中</Option>
                        <Option value="2">临时锁车</Option>
                        <Option value="3">行程结束</Option>
                      </Select>
                  )
                }
              </Form.Item>
              <Form.Item>
                <Button type="primary">查询</Button>
                <Button>重置</Button>
              </Form.Item>
            </Form>
          </Card>
          <Card>
            <Button type="primary" style={{marginRight: 20}} onClick={this.openOrderDetail}>订单详情</Button>
            <Button type="primary" onClick={this.info}>结束订单</Button>
            <Table
                style={{marginTop: 20}}
                bordered
                rowSelection={rowSelection}
                columns={this.state.columns}
                dataSource={this.state.list}
                pagination={this.state.pagination}
            />
          </Card>
        </div>
    )
  }
}

export default Order = Form.create({})(Order);