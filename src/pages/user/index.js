import React from 'react';
import {Card, Button, Table, Form, Input, Select, Radio, Modal, Icon, Checkbox, DatePicker} from 'antd';
import axios from '../../axios/index';
import Utils from '../../utils/utils';
import './../ui/ui.css';
import moment from 'moment';
// import 'moment/locale/zh-cn';

const Option = Select.Option;
const confirm = Modal.confirm;

class User extends React.Component {
  state = {
    columns: [
      {
        title: 'id',
        dataIndex: 'id',
        align: 'center'
      }, {
        title: '用户名',
        dataIndex: 'username',
        align: 'center'
      }, {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
        render(sex) {
          return sex === 1 ? '男' : '女'
        }
      },
      {
        title: '状态',
        dataIndex: 'state',
        align: 'center',
        render(state) {
          let config = {
            '1': '咸鱼一条',
            '2': '风华浪子',
            '3': '北大才子一枚',
            '4': '百度FE',
            '5': '创业者'
          }
          return config[state];
        }
      },
      {
        title: '爱好',
        dataIndex: 'interest',
        align: 'center',
        render(interest) {
          let config = {
            '1': '游泳',
            '2': '打篮球',
            '3': '踢足球',
            '4': '跑步',
            '5': '爬山',
            '6': '骑行',
            '7': '桌球',
            '8': '麦霸'
          }
          return config[interest];
        }
      },
      {
        title: '爱好',
        dataIndex: 'isMarried',
        align: 'center',
        render(isMarried) {
          return isMarried ? '已婚' : '未婚'
        }
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        align: 'center'
      },
      {
        title: '联系地址',
        dataIndex: 'address',
        align: 'center'
      },
      {
        title: '早起时间',
        dataIndex: 'time',
        align: 'center'
      }
    ],
    visible: false,
    title: '',
    selectedRowKeys: [],
  }

  params = {
    page: 1
  }

  // 获取表格数据
  require = () => {
    axios.ajax({
      url: '/table/list1',
      data: {
        params: {
          page: this.params.page
        }
      }
    }).then((res) => {
      let _this = this;
      this.setState({
        list: res.result.list.map((item, index) => {
          item.key = index;
          return item;
        }),
        pagination: Utils.pagination(res, (current) => {
          _this.params.page = current;
          _this.require();
        })
      })
    })
  }

  componentDidMount() {
    this.require();
  }

  // 查询表单提交
  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  // 操作员工：增删改查
  handleOperator = (type) => {
    let _this = this;
    let item = this.state.selectedItem;
    if (type === 'create') {
      this.setState({
        title: '创建员工',
        visible: true,
      })
    } else if (type === 'edit') {
      if (!item) {
        Modal.info({
          title: '温馨提示',
          content: '请选择一个用户',
        })
        return;
      }
      console.log(item);
      this.setState({
        title: '编辑员工',
        visible: true,
        userInfo: item,
        type
      })

    } else if (type === 'detail') {
      if (!item) {
        Modal.info({
          title: '温馨提示',
          content: '请选择一个用户',
        })
        return;
      }
      this.setState({
        title: '员工详情',
        visible: true,
        userInfo: item,
        type
      })
    } else if (type === 'delete') {
      if (!item) {
        Modal.info({
          title: '温馨提示',
          content: '请选择一个用户',
        })
        return;
      }
      confirm({
        // title: 'This is a warning message',
        content: '确定删除此用户',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          axios.ajax({
            url: '/user/delete',
          }).then((res) => {
            if (res.code === 0) {
              _this.require();
            }
          })
        }
      })
    }
  }

  // 创建员工提交
  handleSubmit = () => {
    let type = this.state.type;
    let data = this.userForm.props.form.getFieldsValue();
    console.log(data);
    axios.ajax({
      url: type === 'create' ? 'user/add' : 'user/edit',
      data: {
        params: {
          ...data
        }
      }
    }).then((res) => {
      if (res.code === 0) {
        this.userForm.props.form.resetFields();
        this.setState({
          visible: false
        })
        this.require();
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const selectedRowKeys = this.state.selectedRowKeys;
    // console.log(selectedRow);
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys: selectedRowKeys,
        })
      }
    }
    let footer = {};
    if (this.state.type === 'detail') {
      footer = {
        footer: null
      }
    }
    return (
        <div>
          <Card className="card-wrap" onSubmit={this.handleSearchSubmit}>
            <Form layout="inline">
              <Form.Item>
                {getFieldDecorator('userName', {
                  rules: [{required: true, message: '请输入用户名'}],
                })(
                    <Input placeholder="请输入用户名"/>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{required: true, message: '请输入密码!'}],
                })(
                    <Input type="password" placeholder="请输入密码"/>
                )}
              </Form.Item>
              <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                >
                  查询
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Card className="card-wrap">
            <div style={{marginBottom: 20}}>
              <Button type="primary" onClick={() => this.handleOperator('create')}>创建员工</Button>
              <Button type="primary" onClick={() => this.handleOperator('edit')}>编辑员工</Button>
              <Button type="primary" onClick={() => this.handleOperator('detail')}>员工详情</Button>
              <Button type="danger" onClick={() => this.handleOperator('delete')}>删除员工</Button>
            </div>
            <Table
                bordered
                columns={this.state.columns}
                dataSource={this.state.list}
                pagination={this.state.pagination}
                rowSelection={rowSelection}
                onRow={(record, index) => {
                  return {
                    onClick: () => {
                      this.setState({
                        selectedRowKeys: [index],
                        selectedItem: record
                      })
                    }
                  }
                }}
            />
          </Card>
          <Modal
              title={this.state.title}
              visible={this.state.visible}
              onOk={() => {
                this.setState({
                  visible: false
                })
                this.handleSubmit();
              }}
              onCancel={() => {
                this.userForm.props.form.resetFields();
                this.setState({
                  visible: false
                })
                this.require();
              }}
              okText="确认"
              cancelText="取消"
              width={800}
              {...footer}
          >
            <UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst) => {
              this.userForm = inst
            }}/>
          </Modal>
        </div>
    )
  }
}

class UserForm extends React.Component {
  getState = (state) => {
    return {
      '1': '咸鱼一条',
      '2': '风华浪子',
      '3': '北大才子一枚',
      '4': '百度FE',
      '5': '创业者'
    }[state]
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    };
    let type = this.props.type;
    let userInfo = this.props.userInfo || {};
    return (
        <Form>
          <Form.Item label="姓名" {...formItemLayout}>
            {
              userInfo && type === 'detail' ? userInfo.username :
                  getFieldDecorator('user_name', {
                    initialValue: userInfo.username
                  })(
                      <Input placeholder="请输入姓名"/>
                  )}
          </Form.Item>
          <Form.Item label="性别" {...formItemLayout}>
            {
              userInfo && type === 'detail' ? userInfo.sex === 1 ? '男' : '女' :
                  getFieldDecorator('sex', {
                    initialValue: userInfo.sex
                  })(
                      <Radio.Group>
                        <Radio value="1">男</Radio>
                        <Radio value="2">女</Radio>
                      </Radio.Group>
                  )}
          </Form.Item>
          <Form.Item label="状态" {...formItemLayout}>
            {
              userInfo && type === 'detail' ? this.getState(userInfo.state) :
                  getFieldDecorator('state', {
                    initialValue: userInfo.state
                  })(
                      <Select>
                        <Option value="1">咸鱼一条</Option>
                        <Option value="2">风华浪子</Option>
                        <Option value="3">北大才子一枚</Option>
                        <Option value="4">百度FE</Option>
                        <Option value="5">创业者</Option>
                      </Select>
                  )}
          </Form.Item>
          <Form.Item label="生日" {...formItemLayout}>
            {
              userInfo && type === 'detail' ? userInfo.birthday :
                  getFieldDecorator('birthday', {
                    initialValue: moment(userInfo.birthday)
                  })(
                      <DatePicker/>
                  )}
          </Form.Item>
          <Form.Item label="地址" {...formItemLayout}>
            {
              userInfo && type === 'detail' ? userInfo.address :
                  getFieldDecorator('address', {
                    initialValue: userInfo.address
                  })(
                      <Input.TextArea rows={3} placeholder="请输入联系地址"/>
                  )}
          </Form.Item>
        </Form>
    )
  }
}

UserForm = Form.create({})(UserForm);
export default Form.create({})(User);
