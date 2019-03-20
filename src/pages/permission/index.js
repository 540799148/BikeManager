import React from 'react';
import {Card, Button, Table, Form, Modal, Input, Select, Tree} from 'antd';
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
    console.log(record);
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
            <Button type="primary">用户授权</Button>
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
              // onExpand={this.onExpand}
              // expandedKeys={this.state.expandedKeys}
              // autoExpandParent={this.state.autoExpandParent}
              onCheck={(checkedKeys) => {
                this.onCheck(checkedKeys)
              }}
              checkedKeys={menuInfo}
              // onSelect={this.onSelect}
              // selectedKeys={this.state.selectedKeys}
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
  render() {
    return (
        <Form>

        </Form>
    )
  }
}

RoleAuthForm = Form.create({})(RoleAuthForm);
