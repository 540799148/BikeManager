import React from 'react';
import {Card, Button, Table} from 'antd';

export default class Permission extends React.Component {
  render() {
    const columns = [
      {
        title: '角色ID',
        dataIndex: 'id'
      }, {
        title: '角色名称',
        dataIndex: 'role_name'
      }, {
        title: '创建时间',
        dataIndex: 'create_time',
      }, {
        title: '使用状态',
        dataIndex: 'status',
      }, {
        title: '授权时间',
        dataIndex: 'authorize_time',
      }, {
        title: '授权人',
        dataIndex: 'authorize_user_name',
      }];

    return (
        <div>
          <Card className="card-wrap">
            <Button type="primary">创建角色</Button>
            <Button type="primary">设置权限</Button>
            <Button type="primary">用户授权</Button>
            <Table
                bordered
                style={{marginTop: 20}}
                // dataSource={dataSource}
                columns={columns}
            />
          </Card>
        </div>
    )
  }
}