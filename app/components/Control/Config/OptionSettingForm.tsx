/*
 * <<
 * Davinci
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import React, { PureComponent } from 'react'

import { Form, Input, Modal, Select, Divider } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import { IFlatRelatedView } from './ControlForm/types'
import { IControlOption } from '../types'
import styles from '../Control.less'
const FormItem = Form.Item
const Option = Select.Option

interface IOptionSettingFormProps extends FormComponentProps {
  visible: boolean
  values: IControlOption
  customOptions: IControlOption[]
  optionWithVariable: boolean
  relatedViewList: IFlatRelatedView[]
  onSave: () => void
  onCancel: () => void
  afterClose: () => void
}

class OptionSettingForm extends PureComponent<IOptionSettingFormProps> {
  public componentDidUpdate(prevProps: IOptionSettingFormProps) {
    const { form, values, optionWithVariable } = this.props
    if (values !== prevProps.values) {
      if (!values) {
        form.resetFields()
      } else {
        form.setFieldsValue({
          ...values,
          ...(optionWithVariable && values.variables)
        })
      }
    }
  }

  public render() {
    const {
      form,
      visible,
      optionWithVariable,
      relatedViewList,
      onSave,
      onCancel,
      afterClose
    } = this.props
    const { getFieldDecorator } = form

    const itemCols = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    }

    return (
      <Modal
        title="?????????????????????"
        visible={visible}
        wrapClassName={`ant-modal-small ${styles.optionsModal}`}
        onOk={onSave}
        onCancel={onCancel}
        afterClose={afterClose}
      >
        <Form>
          <FormItem label="???" {...itemCols}>
            {getFieldDecorator('value', {
              rules: [{ required: true, message: '???????????????' }]
            })(<Input />)}
          </FormItem>
          <FormItem label="??????" {...itemCols}>
            {getFieldDecorator('text', {})(<Input />)}
          </FormItem>
          {optionWithVariable && (
            <>
              <Divider>????????????</Divider>
              {relatedViewList.map(({ id, name, variables }) => (
                <FormItem key={id} label={name} {...itemCols}>
                  {getFieldDecorator(
                    `${id}`,
                    {}
                  )(
                    <Select placeholder="?????????" allowClear>
                      {variables.map((v) => (
                        <Option key={v.name} value={v.name}>
                          {v.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              ))}
            </>
          )}
        </Form>
      </Modal>
    )
  }
}

export default Form.create<IOptionSettingFormProps>()(OptionSettingForm)
