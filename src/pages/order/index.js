import React from 'react';
import {Card, Form, Button, Table, Modal, message} from 'antd';
import axios from './../../axios/index';
import Utils from './../../utils/utils';
import BaseForm from './../../components/BaseForm/index';
// import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';

// moment.locale('zh-cn');

class Order extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          title: '订单编号',
          dataIndex: 'order_sn',
        },
        {
          title: '车辆编号',
          dataIndex: 'user_id',
        },
        {
          title: '用户名',
          dataIndex: 'user_name',
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
        },
        {
          title: '里程',
          dataIndex: 'distance',
          render(distance) {
            return distance / 1000 + 'Km'
          }
        },
        {
          title: '行驶时长',
          dataIndex: 'total_time',
        },
        {
          title: '状态',
          dataIndex: 'status',
          render(status) {
            return status === 1 ? "行驶中" : "已完成"
          }
        },
        {
          title: '开始时间',
          dataIndex: 'start_time',
        },
        {
          title: '结束时间',
          dataIndex: 'end_time',
        },
        {
          title: '订单金额',
          dataIndex: 'total_fee',
        },
        {
          title: '实付金额',
          dataIndex: 'user_pay',
        }
      ],
      list: [],
      seletedItem: '',
      orderInfo: [],
      orderConfirmVisble: false,
      selectedRow: {}
    }
  }

  params = {page: 1}

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
  ]

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

  handleFilter = (params) => {
    this.params = params;
    this.request();
  }

  request = () => {
    let _this = this;
    axios.ajax({
      url: '/order/list',
      data: {
        params: this.params
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

  openOrderDetail = () => {
    let item = this.state.selectedRowKeys;
    if (!item) {
      Modal.info({
        title: '信息',
        content: '请选择一条订单查看详情'
      })
      return
    }
    window.open(`/#/common/order/detail/${item.id}`, '_blank')
  }

  // 订单结束确认
  overOrder = () => {
    let item = this.state.selectedRowKeys;
    let {status} = this.state.selectedRow;
    console.log(status)
    if (!item) {
      Modal.info({
        title: '信息',
        content: '请选择一条订单进行结束'
      })
    } else if (status === 1) {
      this.setState({
        orderConfirmVisible: true
      })
      axios.ajax({
        url: '/order/ebike_info',
        // data: {
        //   params: {
        //     orderId: item.id
        //   }
        // }
      }).then((res) => {
        if (res.code === 0) {
          this.setState({
            orderInfo: res.result,
            // orderConfirmVisible: true
          })
        }
      })
    } else if (status === 2) {
      Modal.info({
        title: '信息',
        content: '订单已经结束'
      })
    }
  }

  // 结束行驶中订单
  handleFinishOrder = () => {
    axios.ajax({
      url: '/order/finish_order',
      // data: {
      //   params: {
      //     orderId: item.id
      //   }
      // }
    }).then((res) => {
      if (res.code === 0) {
        message.success('订单结束成功')
        this.setState({
          orderConfirmVisible: false
        })
        this.request();
      }
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19}
    }
    const selectedRowKeys = this.state.selectedRowKeys;
    const rowSelection = {
      columnWidth: '60px',
      type: 'radio',
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(selectedRows)
        this.setState({
          selectedRowKeys,
          // selectedRow: selectedRows[0]
        })
      }
    };

    return (
        <div>
          <Card className="card-wrap">
            <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
          </Card>
          <Card>
            <Button type="primary" style={{marginRight: 20}} onClick={this.openOrderDetail}>订单详情</Button>
            <Button type="primary" onClick={this.overOrder}>结束订单</Button>
            <Table
                style={{marginTop: 20}}
                bordered
                rowSelection={rowSelection}
                columns={this.state.columns}
                dataSource={this.state.list}
                pagination={this.state.pagination}
                onRow={(record,index)=>{
                  return {
                    onClick:()=>{
                      this.setState({
                        selectedRowKeys:[index],
                      })
                    }
                  }
                }}
            />
          </Card>
          <Modal
              title="结束订单"
              visible={this.state.orderConfirmVisible}
              onCancel={() => {
                this.setState({
                  orderConfirmVisible: false
                })
              }}
              onOk={this.handleFinishOrder}
          >
            <Form layout="horizontal">
              <Form.Item label="车辆编号" {...formItemLayout}>
                {this.state.orderInfo.bike_sn}
              </Form.Item>
            </Form>
            <Form.Item label="剩余电量" {...formItemLayout}>
              {this.state.orderInfo.battery + '%'}
            </Form.Item>
            <Form.Item label="行程开始时间" {...formItemLayout}>
              {this.state.orderInfo.start_time}
            </Form.Item>
            <Form.Item label="当前位置" {...formItemLayout}>
              {this.state.orderInfo.location}
            </Form.Item>
          </Modal>
        </div>
    )
  }
}

export default Order = Form.create({})(Order);