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

import React, {
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef
} from 'react'
import { Form, Row, Col, Input, Select, Icon, InputNumber, Spin } from 'antd'
const FormItem = Form.Item
const { Option } = Select
import MailTag from './MailTag'

import { FormComponentProps } from 'antd/lib/form'
import { IScheduleMailConfig, IUserInfo } from './types'
import {
  FormItemStyle,
  LongFormItemStyle,
  DefaultMailImageWidth,
  DefaultEmailContent
} from './constants'

import { RichText, RichTextNode } from 'components/RichText'

interface IScheduleMailConfigProps
  extends FormComponentProps<IScheduleMailConfig> {
  config: IScheduleMailConfig
  loading: boolean
  onLoadMailList: (keyword: string) => void
  mailList: IUserInfo[]
}

export const ScheduleMailConfig: React.FC<IScheduleMailConfigProps> = (
  props,
  ref
) => {
  const { form, config, loading, mailList, onLoadMailList } = props
  const { getFieldDecorator } = form
  const [showBcc, setShowBcc] = useState(false)
  const ccLabel = (
    <span>
      <span>抄送</span>
      <Icon
        style={{ marginLeft: 8 }}
        type={showBcc ? 'up-circle' : 'down-circle'}
        onClick={() => setShowBcc(!showBcc)}
      />
    </span>
  )

  const resetMailList = useCallback(
    () => {
      onLoadMailList('')
    },
    [onLoadMailList]
  )

  useEffect(
    () => {
      if (config.bcc) {
        setShowBcc(true)
      }
      form.setFieldsValue({ content: config.content || DefaultEmailContent })
    },
    [config]
  )

  const checkContentMaxLength = (
    _,
    value: RichTextNode[],
    callback: (msg?: string) => void
  ) => {
    if (new Blob([JSON.stringify(value)]).size / 1024 > 60) {
      callback('邮件内容长度过长（不超过 64Kb）')
      return
    }
    callback()
  }

  useImperativeHandle(ref, () => ({ form }))

  return (
    <Form>
      <FormItem label="主题" {...LongFormItemStyle}>
        {getFieldDecorator<IScheduleMailConfig>('subject', {
          rules: [{ required: true, message: '主题不能为空' }],
          initialValue: config.subject
        })(<Input />)}
      </FormItem>
      <Row>
        <Col span={12}>
          <FormItem label="文件类型" {...FormItemStyle}>
            {getFieldDecorator<IScheduleMailConfig>('type', {
              rules: [{ required: true }],
              initialValue: config.type
            })(
              <Select>
                <Option value="excel">Excel</Option>
                <Option value="image">图片</Option>
                <Option value="imageAndExcel">图片 + Excel</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          {form.getFieldValue('type') !== 'excel' && (
            <FormItem label="图片宽度" {...FormItemStyle}>
              {getFieldDecorator<IScheduleMailConfig>('imageWidth', {
                rules: [{ required: true }],
                initialValue: config.imageWidth || DefaultMailImageWidth
              })(<InputNumber min={100} />)}{' '}
              像素
            </FormItem>
          )}
        </Col>
      </Row>

      <FormItem label="收件人" {...LongFormItemStyle}>
        {getFieldDecorator<IScheduleMailConfig>('to', {
          rules: [{ required: true, message: '请选择收件人' }],
          initialValue: config.to
        })(
          <MailTag
            allowCreate
            dataSource={mailList}
            onLoadDataSource={onLoadMailList}
            onBlur={resetMailList}
          />
        )}
      </FormItem>
      <FormItem label={ccLabel} {...LongFormItemStyle}>
        {getFieldDecorator<IScheduleMailConfig>('cc', {
          initialValue: config.cc
        })(
          <MailTag
            allowCreate
            dataSource={mailList}
            onLoadDataSource={onLoadMailList}
            onBlur={resetMailList}
          />
        )}
      </FormItem>
      {showBcc && (
        <FormItem label="密送" {...LongFormItemStyle}>
          {getFieldDecorator<IScheduleMailConfig>('bcc', {
            initialValue: config.bcc
          })(
            <MailTag
              allowCreate
              dataSource={mailList}
              onLoadDataSource={onLoadMailList}
              onBlur={resetMailList}
            />
          )}
        </FormItem>
      )}
      <FormItem label="内容" {...LongFormItemStyle}>
        {loading ? (
          <Spin />
        ) : (
          getFieldDecorator<IScheduleMailConfig>('content', {
            validateFirst: true,
            rules: [
              { required: true, message: '请输入邮件文本内容' },
              {
                validator: checkContentMaxLength
              }
            ],
            initialValue: config.content
          })(
            <RichText />
          )
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create<IScheduleMailConfigProps>()(
  forwardRef(ScheduleMailConfig)
)
