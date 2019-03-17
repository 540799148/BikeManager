import React from 'react';
import {Input, Select, DatePicker, Form, Button, Checkbox, Radio} from 'antd';
import locale from "antd/lib/date-picker/locale/zh_CN";
import Utils from './../../utils/utils';

const Option = Select.Option;

class BaseForm extends React.Component {

  handleSubmit = () => {
    let fieldsValue = this.props.form.getFieldsValue();
    this.props.filterSubmit(fieldsValue);
  }

  reset = () => {
    this.props.form.resetFields();
  }

  initFormList = () => {
    const {getFieldDecorator} = this.props.form;
    const formList = this.props.formList;
    const formItemList = [];
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        let label = item.label;
        let field = item.field;
        let initialValue = item.initialValue || '';
        let placeholder = item.placeholder;
        let width = item.width;
        if (item.type === '时间查询') {
          const begin_time = <Form.Item label="时间查询" key={field}>
            {
              getFieldDecorator('begin_time')(
                  <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD"/>
              )
            }
          </Form.Item>
          formItemList.push(begin_time);
          const end_time = <Form.Item label="~" colon={false} key={field}>
            {
              getFieldDecorator('end_time')(
                  <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD"/>
              )
            }
          </Form.Item>
          formItemList.push(end_time);
        } else if (item.type === 'INPUT') {
          const INPUT = <Form.Item label={label} key={field}>
            {
              getFieldDecorator([field], {
                initialValue: initialValue
              })(
                  <Input type="text" placeholder={placeholder}/>
              )
            }
          </Form.Item>
          formItemList.push(INPUT);
        } else if (item.type === 'SELECT') {
          const SELECT = <Form.Item label={label} key={field}>
            {
              getFieldDecorator([field], {
                initialValue: initialValue
              })(
                  <Select
                      style={{width: width}}
                      placeholder={placeholder}
                  >
                    {Utils.getOptionList(item.list)}
                  </Select>
              )
            }
          </Form.Item>
          formItemList.push(SELECT);
        } else if (item.type === 'CHECKBOX') {
          const CHECKBOX = <Form.Item label={label} key={field}>
            {
              getFieldDecorator([field], {
                valuePropName: 'checked',
                initialValue: initialValue   // true | false
              })(
                  <Checkbox>
                    {label}
                  </Checkbox>
              )
            }
          </Form.Item>
          formItemList.push(CHECKBOX);
        }
      })
    }
    return formItemList;
  }

  render() {
    return (
        <Form layout="inline">
          {this.initFormList()}
          <Form.Item>
            <Button type="primary" onClick={this.handleSubmit}>查询</Button>
            <Button onClick={this.reset}>重置</Button>
          </Form.Item>
        </Form>
    )
  }
}

export default Form.create({})(BaseForm);