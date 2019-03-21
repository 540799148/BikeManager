import React from 'react';
import {Card, Button, Table, Form, Modal, Input, Select, Tree, Transfer} from 'antd';
import axios from './../../axios/index';
import Utils from './../../utils/utils';
import menuList from './../../config/menuConfig'

const Option = Select.Option;
const {TreeNode} = Tree;
const treeData = menuList;

export default class Permission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      visible1: false,
      visible2: false,
      visible3: false,
      selectedRowKeys: null,
      record: {}
    }
  }

  params = {
    page: 1,
  }

  componentWillMount() {
    this.require();
  }

  // 表格数据请求
  require = () => {
    let _this = this;
    axios.ajax({
      url: '/role/list',
      data: {
        params: this.params
      }
    }).then((res) => {
      // console.log(res)
      this.setState({
        list: res.result.item_list.map((item, index) => {
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

  // 创建角色
  handleCreateRole = () => {
    this.setState({
      visible1: true,
    })
  }

  // 创建角色表单提交
  handleCreateRoleSubmit = () => {
    let data = this.roleForm.props.form.getFieldsValue();
    axios.ajax({
      url: '/role/create',
      data: {params: data}
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          visible1: false,
        })
        this.roleForm.props.form.resetFields();
        this.require();
      }
    })
  }

  // 设置权限
  handleSetPerm = () => {
    let item = this.state.selectedRowKeys;
    let record = this.state.record;
    // console.log(record);
    if (!item) {
      Modal.info({
        title: '温馨提示',
        content: '请选择一个角色'
      })
      return;
    }
    this.setState({
      visible2: true,
      detailInfo: record,
      menuInfo: item.menus
    })
    let menuList = this.state.record.menus;
    this.setState({
      menuInfo: menuList
    })
  }

  // 编辑用户权限提交
  handleSetPermSubmit = () => {
    let data = this.permEditForm.props.form.getFieldsValue();
    data.role_id = this.state.selectedRowKeys.id;
    data.menus = this.state.menuInfo;
    axios.ajax({
      url: '/permission/edit',
      data: {
        params: {
          ...data
        }
      }
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          visible2: false,
        })
        this.require();
      }
    })
  }

  // 用户授权
  handleUserAuth = () => {
    let item = this.state.selectedRowKeys;
    let record = this.state.record;
    // console.log(record);
    if (!item) {
      Modal.info({
        title: '温馨提示',
        content: '请选择一个角色'
      })
      return;
    }
    this.setState({
      visible3: true,
      detailInfo: record
    })
    this.getRoleUserList(item.id);
  }

  getRoleUserList = (id) => {
    axios.ajax({
      url: '/role/user_list',
      data: {
        params: {id}
      }
    }).then((res) => {
      if (res.code === 0) {
        // this.setState({
        //   visible3: true,
        // })
        this.getAuthUserList(res.result)
      }
    })
  }

  // 筛选目标用户
  getAuthUserList = (dataSource) => {
    const mockData = [];
    const targetKeys = [];
    if (dataSource && dataSource.length > 0) {
      for (let i = 0; i < dataSource.length; i++) {
        const data = {
          key: dataSource[i].user_id,
          title: dataSource[i].user_name,
          status: dataSource[i].status,
        }
        if (data.status === 1) {
          targetKeys.push(data.key);
        }
        mockData.push(data);
      }
    }
    this.setState({mockData, targetKeys})
  }

  // 用户授权表单提交
  handleUserAuthSubmit = () => {
    let data = this.roleAuthForm.props.form.getFieldsValue();
    data.user_ids = this.state.targetKeys;
    data.role_id = this.state.record.id
    axios.ajax({
      url: '/role/user_role_edit',
      data: {
        params: {
          ...data
        }
      }
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          visible3: false,
        })
        this.require();
      }
    })

  }

  render() {
    const columns = [
      {
        title: '角色ID',
        dataIndex: 'id',
        align: 'center'
      }, {
        title: '角色名称',
        dataIndex: 'role_name',
        align: 'center'
      }, {
        title: '创建时间',
        dataIndex: 'create_time',
        render: Utils.formateDate,
        align: 'center'
      }, {
        title: '使用状态',
        dataIndex: 'status',
        render(status) {
          return status === 1 ? '启用' : '停用';
        },
        align: 'center'
      }, {
        title: '授权时间',
        dataIndex: 'authorize_time',
        render: Utils.formateDate,
        align: 'center'
      }, {
        title: '授权人',
        dataIndex: 'authorize_user_name',
        align: 'center'
      }];
    // const item = this.state.record;
    let selectedRowKeys = this.state.selectedRowKeys;
    let rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys,
        })
      },
    };

    return (
        <div>
          <Card className="card-wrap">
            <Button type="primary" onClick={this.handleCreateRole}>创建角色</Button>
            <Button type="primary" onClick={this.handleSetPerm}>设置权限</Button>
            <Button type="primary" onClick={this.handleUserAuth}>用户授权</Button>
            <Table
                bordered
                style={{marginTop: 20}}
                columns={columns}
                dataSource={this.state.list}
                pagination={this.state.pagination}
                rowSelection={rowSelection}
                onRow={(record, index) => {
                  return {
                    onClick: () => {
                      this.setState({
                        selectedRowKeys: [index],
                        record,
                      })
                    }
                  }
                }}
            />
          </Card>
          <Modal
              title="创建角色"
              width={600}
              visible={this.state.visible1}
              onOk={this.handleCreateRoleSubmit}
              onCancel={() => {
                this.roleForm.props.form.resetFields();
                this.setState({
                  visible1: false,
                })
              }}
          >
            <RoleForm wrappedComponentRef={(inst) => this.roleForm = inst}/>
          </Modal>
          <Modal
              title="创建角色"
              width={600}
              visible={this.state.visible2}
              onOk={this.handleSetPermSubmit}
              onCancel={() => {
                this.setState({
                  visible2: false,
                })
              }}
          >
            <PermEditForm
                wrappedComponentRef={(inst) => this.permEditForm = inst}
                detailInfo={this.state.detailInfo}
                menuInfo={this.state.menuInfo}
                patchMenuInfo={(checkedKeys) => {
                  this.setState({
                    menuInfo: checkedKeys
                  })
                }}
            />
          </Modal>
          <Modal
              title="用户授权"
              width={800}
              visible={this.state.visible3}
              onOk={this.handleUserAuthSubmit}
              onCancel={() => {
                this.setState({
                  visible3: false,
                })
              }}
          >
            <RoleAuthForm
                wrappedComponentRef={(inst) => this.roleAuthForm = inst}
                detailInfo={this.state.detailInfo}
                mockData={this.state.mockData}
                targetKeys={this.state.targetKeys}
                patchUserInfo={(targetKeys) => {
                  this.setState({
                    targetKeys
                  })
                }}
            />
          </Modal>
        </div>
    )
  }
}

// 角色创建
class RoleForm extends React.Component {
  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    return (
        <Form>
          <Form.Item
              label="角色名称"
              {...formItemLayout}
          >
            {getFieldDecorator('user_name')(
                <Input placeholder="请输入角色名称"/>
            )}
          </Form.Item>
          <Form.Item
              label="状态开启"
              {...formItemLayout}
          >
            {getFieldDecorator('status', {
              initialValue: 1
            })(
                <Select>
                  <Option value={1}>开启</Option>
                  <Option value={2}>关闭</Option>
                </Select>
            )}
          </Form.Item>
        </Form>
    )
  }
}

RoleForm = Form.create({})(RoleForm);

// 设置权限
class PermEditForm extends React.Component {

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
      );
    } else if (item.btnList) {
      return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.btnList)}
          </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })

  onCheck = (checkedKeys) => {
    this.props.patchMenuInfo(checkedKeys);
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    const detail_info = this.props.detailInfo;
    const menuInfo = this.props.menuInfo;
    return (
        <Form>
          <Form.Item
              label="角色名称"
              {...formItemLayout}
          >
            {getFieldDecorator('user_name')(
                <Input disabled placeholder={detail_info.role_name}/>
            )}
          </Form.Item>
          <Form.Item
              label="状态开启"
              {...formItemLayout}
          >
            {getFieldDecorator('status', {
              initialValue: 1
            })(
                <Select>
                  <Option value={1}>开启</Option>
                  <Option value={2}>关闭</Option>
                </Select>
            )}
          </Form.Item>
          <Tree
              checkable
              defaultExpandAll
              onCheck={(checkedKeys) => {
                this.onCheck(checkedKeys)
              }}
              checkedKeys={menuInfo}
          >
            <TreeNode title="平台权限" key="platform_all">
              {this.renderTreeNodes(treeData)}
            </TreeNode>
          </Tree>
        </Form>
    )
  }
}

PermEditForm = Form.create({})(PermEditForm);

// 用户授权
class RoleAuthForm extends React.Component {
  handleChange = (targetKeys) => {
    this.props.patchUserInfo(targetKeys)
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };
    const detail_info = this.props.detailInfo;
    return (
        <Form>
          <Form.Item
              label="角色名称"
              {...formItemLayout}
          >
            {getFieldDecorator('user_name')(
                <Input disabled placeholder={detail_info.role_name}/>
            )}
          </Form.Item>
          <Form.Item
              label="选择用户"
              {...formItemLayout}
          >
            <Transfer
                listStyle={{width: 200, height: 500}}
                dataSource={this.props.mockData}
                titles={['待选用户', '已选用户']}
                targetKeys={this.props.targetKeys}
                onChange={this.handleChange}
                render={item => item.title}
            />
          </Form.Item>
        </Form>
    )
  }
}

RoleAuthForm = Form.create({})(RoleAuthForm);
