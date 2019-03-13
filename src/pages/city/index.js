import React from 'react';
import {Card, Form, Table, Select, Button, Modal, message, Radio} from 'antd';
import axios from './../../axios/index';
import Utils from "./../../utils/utils";
import './../ui/ui.css';

const {Option} = Select;

class City extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '城市ID',
          dataIndex: 'id',
          align: 'center'
        }, {
          title: '城市名称',
          dataIndex: 'name',
          align: 'center'
        }, {
          title: '用车模式',
          dataIndex: 'mode',
          align: 'center',
          render(mode) {
            return mode === 1 ? '停车点' : '禁停区';
          }
        }, {
          title: '营运模式',
          dataIndex: 'op_mode',
          align: 'center',
          render(op_mode) {
            return op_mode === 1 ? '自营' : '加盟';
          }
        }, {
          title: '授权加盟商',
          dataIndex: 'franchisee_name',
          align: 'center'
        }, {
          title: '城市管理员',
          dataIndex: 'city_admins',
          align: 'center',
          render(arr) {
            return arr.map((item) => {
              return item.user_name;
            }).join(',');
          }
        }, {
          title: '城市开通时间',
          dataIndex: 'open_time',
          align: 'center'
        }, {
          title: '操作时间',
          dataIndex: 'update_time',
          align: 'center',
          render: Utils.formateDate
        }, {
          title: '操作人',
          dataIndex: 'sys_user_name',
          align: 'center'
        }
      ],
      list: [],
      visible: false
    }
  }

  params = {page: 1}

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    let cityInfo = this.cityForm.props.form.getFieldsValue();
    console.log(cityInfo);
    axios.ajax({
      url: '/city/open',
      data: {
        params: cityInfo
      }
    }).then((res) => {
      if (res.code === 0) {
        message.success('开通成功');
        this.setState({
          visible: false,
        });
        this.request();
      }
    })

  }

  handleCancel = () => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }

  componentDidMount() {
    const data = [];
    data.map((item, index) => {
      item.key = index;
    })
    this.setState({
      data
    })
    this.request();
  }

  request = () => {
    let _this = this;
    axios.ajax({
      url: '/open_city',
      data: {
        params: {
          page: this.params.page
        },
        // isShowLoading: true
      }
    }).then((res) => {
      this.setState({
        list: res.result.item_list.map((item, index) => {
          item.key = index;
          return item;
        }),
        pagination: Utils.pagination(res, (current) => {
          _this.params.page = current;
          _this.request();
        })
      })
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
        <div>
          <Card className="card-wrap">
            <Form layout="inline">
              <Form.Item label="城市">
                {
                  getFieldDecorator('city')(
                      <Select style={{width: 120}} placeholder="全部">
                        {/*<Option value="1">全部</Option>*/}
                        <Option value="2">武汉市</Option>
                        <Option value="3">上海市</Option>
                        <Option value="4">北京市</Option>
                      </Select>
                  )
                }
              </Form.Item>
              <Form.Item label="用车模式">
                <Select defaultValue="park" style={{width: 160}}>
                  <Option value="park">指定停车点模式</Option>
                  <Option value="noPack">禁停区模式</Option>
                </Select>
              </Form.Item>
              <Form.Item label="营运模式">
                <Select defaultValue="beijing" style={{width: 90}}>
                  <Option value="beijing">自营</Option>
                  <Option value="shanghai">加盟</Option>
                </Select>
              </Form.Item>
              <Form.Item label="加盟商授权状态">
                <Select defaultValue="beijing" style={{width: 90}}>
                  <Option value="beijing">已授权</Option>
                  <Option value="shanghai">未授权</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary">查询</Button>
              </Form.Item>
              <Form.Item>
                <Button>重置</Button>
              </Form.Item>
            </Form>
          </Card>
          <Card>
            <Button type="primary" onClick={this.showModal}>开通城市</Button>
            <Table
                bordered
                style={{marginTop: 20}}
                columns={this.state.columns}
                dataSource={this.state.list}
                pagination={this.state.pagination}
            />
          </Card>
          <Modal
              title="开通城市"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
          >
            <OpenCityForm wrappedComponentRef={(inst) => {
              this.cityForm = inst;
            }}/>
          </Modal>
        </div>
    )
  }
}

export default City = Form.create({})(City);

class OpenCityForm extends React.Component {
  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      },
    }
    return (
        <div>
          <Form layout="horizontal">
            <Form.Item label="选择城市" {...formItemLayout}>
              <Select defaultValue="beijing" style={{width: 120}}>
                <Option value="beijing">北京市</Option>
                <Option value="shanghai">上海市</Option>
                <Option value="wuhan">武汉市</Option>
              </Select>
            </Form.Item>

            <Form.Item label="营运模式" {...formItemLayout}>
              {getFieldDecorator('op_mode', {
                initialValue: '2',
              })(
                  <Radio.Group>
                    <Radio value="1">自营</Radio>
                    <Radio value="2">加盟</Radio>
                  </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="用车模式" {...formItemLayout}>
              {getFieldDecorator('use_mode', {
                initialValue: '2',
              })(
                  <Radio.Group>
                    <Radio value="1">指定停车点模式</Radio>
                    <Radio value="2">禁停区模式</Radio>
                  </Radio.Group>
              )}
            </Form.Item>
          </Form>
        </div>
    )
  }
}

OpenCityForm = Form.create({})(OpenCityForm);
