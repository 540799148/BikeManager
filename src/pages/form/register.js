import React from 'react';
import {
  Card,
  Form,
  Button,
  Input,
  Checkbox,
  Radio,
  Select,
  Switch,
  DatePicker,
  TimePicker,
  InputNumber,
  Upload,
  Icon
} from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;

class Register extends React.Component {
  state = {};

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        userImg: imageUrl,
        loading: false,
      }));
    }
  };

  handleSubmit = () => {
    let userInfo = this.props.form.getFieldsValue();
    console.log(JSON.stringify(userInfo));
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
    };
    const offsetLayout = {
      wrapperCol: {
        xs: 24,
        sm: {
          span: 12,
          offset: 4
        }
      }
    };

    return (
        <div>
          <Card title="注册表单">
            <Form layout="horizontal">
              <FormItem label="用户名" {...formItemLayout}>
                {
                  getFieldDecorator('userName', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '用户名不能为空'
                      }
                    ]
                  })(
                      <Input placeholder="请输入用户名"/>
                  )
                }
              </FormItem>
              <FormItem label="密码" {...formItemLayout}>
                {
                  getFieldDecorator('userPwd', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '用户名不能为空'
                      }
                    ]
                  })(
                      <Input type="password" placeholder="请输入密码"/>
                  )
                }
              </FormItem>
              <FormItem label="性别" {...formItemLayout}>
                {
                  getFieldDecorator('sex', {
                    initialValue: ''
                  })(
                      <RadioGroup type="password" placeholder="请输入密码">
                        <Radio value="1">boy</Radio>
                        <Radio value="2">girl</Radio>
                      </RadioGroup>
                  )
                }
              </FormItem>
              <FormItem label="年龄" {...formItemLayout}>
                {
                  getFieldDecorator('age', {
                    initialValue: 18
                  })(
                      <InputNumber/>
                  )
                }
              </FormItem>
              <FormItem label="当前状态" {...formItemLayout}>
                {
                  getFieldDecorator('state', {
                    initialValue: '2'
                  })(
                      <Select>
                        <Option value="1">开心</Option>
                        <Option value="2">伤心</Option>
                        <Option value="3">郁闷</Option>
                        <Option value="4">高兴</Option>
                        <Option value="5">绝望</Option>
                      </Select>
                  )
                }
              </FormItem>
              <FormItem label="爱好" {...formItemLayout}>
                {
                  getFieldDecorator('hobby', {
                    initialValue: ['2', '5']
                  })(
                      <Select mode="multiple">
                        <Option value="1">游泳</Option>
                        <Option value="2">篮球</Option>
                        <Option value="3">足球</Option>
                        <Option value="4">跑步</Option>
                        <Option value="5">爬山</Option>
                        <Option value="6">骑行</Option>
                        <Option value="7">唱歌</Option>
                        <Option value="8">绘画</Option>
                        <Option value="9">瑜伽</Option>
                      </Select>
                  )
                }
              </FormItem>
              <FormItem label="是否已婚" {...formItemLayout}>
                {
                  getFieldDecorator('isMarried', {
                    valuePropName: 'checked',
                    initialValue: true
                  })(
                      <Switch/>
                  )
                }
              </FormItem>
              <FormItem label="生日" {...formItemLayout}>
                {
                  getFieldDecorator('birthday', {
                    initialValue: moment('2019-03-11')
                  })(
                      <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                      />
                  )
                }
              </FormItem>
              <FormItem label="联系地址" {...formItemLayout}>
                {
                  getFieldDecorator('address', {
                    initialValue: '北京市天安门'
                  })(
                      <TextArea
                          autosize={
                            {
                              minRows: 4, maxRows: 6
                            }
                          }
                      />
                  )
                }
              </FormItem>
              <FormItem label="早起时间" {...formItemLayout}>
                {
                  getFieldDecorator('time')(
                      <TimePicker/>
                  )
                }
              </FormItem>
              <FormItem label="头像" {...formItemLayout}>
                {
                  getFieldDecorator('userImg')(
                      <Upload
                          listType="picture-card"
                          showUploadList={false}
                          action="//jsonplaceholder.typicode.com/posts/"
                          onChange={this.handleChange}
                      >
                        {this.state.userImg ? <img src={this.state.userImg}/> : <Icon type="plus"/>}
                      </Upload>
                  )
                }
              </FormItem>
              <FormItem {...offsetLayout}>
                {
                  getFieldDecorator('userImg')(
                      <Checkbox>我已阅读过<a href="#">协议</a></Checkbox>
                  )
                }
              </FormItem>
              <FormItem {...offsetLayout}>
                <Button type="primary" onClick={this.handleSubmit}>注册</Button>
              </FormItem>
            </Form>
          </Card>
        </div>
    )
  }
}

export default Form.create()(Register);