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

import React, { FC, memo, useMemo } from 'react'
import classnames from 'classnames'
import { Form, Row, Col, Select, Checkbox, InputNumber } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import ColorPicker from 'components/ColorPicker'
import { ReferenceValueType } from '../constants'
import { IReferenceLineData } from '../types'
import {
  referenceValueTypeSelectOptions,
  lineLabelPositionOptions,
  fontFamilyOptions,
  fontSizeOptions,
  lineStyleOptions
} from './Options'
import { IDataParamSource } from '../../Dropbox'
import { decodeMetricName } from '../../../util'
import utilStyles from 'assets/less/util.less'
import styles from '../Reference.less'
const FormItem = Form.Item
const Option = Select.Option

interface ILineFormProps {
  form: WrappedFormUtils
  data: IReferenceLineData
  metrics: IDataParamSource[]
  onDataTypeChange: (name: string) => (value: string) => void
}

const LineForm: FC<ILineFormProps> = ({
  form,
  data,
  metrics,
  onDataTypeChange
}) => {
  const { getFieldDecorator } = form

  const metricSelectOptions = useMemo(
    () =>
      metrics.map((m) => (
        <Option key={m.name} value={m.name}>
          {decodeMetricName(m.name)}
        </Option>
      )),
    [metrics]
  )

  return (
    <>
      <Row gutter={8}>
        <Col span={4}>
          <FormItem label="???">
            {getFieldDecorator(
              'data.type',
              {}
            )(
              <Select onChange={onDataTypeChange('data.type')}>
                {referenceValueTypeSelectOptions}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col
          span={4}
          className={classnames({
            [utilStyles.hide]: data.type !== ReferenceValueType.Constant
          })}
        >
          <FormItem label="?????????" colon={false}>
            {getFieldDecorator('data.value', {
              rules: [{ required: true, message: '???????????????' }]
            })(<InputNumber />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="????????????">
            {getFieldDecorator('data.metric', {
              rules: [{ required: true, message: '????????????????????????' }]
            })(<Select placeholder="???????????????">{metricSelectOptions}</Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={4}>
          <FormItem label="??????">
            {getFieldDecorator('data.label.visible', {
              valuePropName: 'checked'
            })(<Checkbox>????????????</Checkbox>)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label="??????">
            {getFieldDecorator(
              'data.label.position',
              {}
            )(<Select>{lineLabelPositionOptions}</Select>)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label="??????">
            {getFieldDecorator(
              'data.label.font.family',
              {}
            )(<Select>{fontFamilyOptions}</Select>)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label=" " colon={false}>
            {getFieldDecorator(
              'data.label.font.size',
              {}
            )(<Select>{fontSizeOptions}</Select>)}
          </FormItem>
        </Col>
        <Col span={2}>
          <FormItem label=" " colon={false}>
            {getFieldDecorator(
              'data.label.font.color',
              {}
            )(<ColorPicker className={styles.colorPicker} preset />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={4}>
          <FormItem label="????????????">
            {getFieldDecorator('data.line.width', {})(<InputNumber />)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label=" " colon={false}>
            {getFieldDecorator(
              'data.line.type',
              {}
            )(<Select>{lineStyleOptions}</Select>)}
          </FormItem>
        </Col>
        <Col span={2}>
          <FormItem label=" " colon={false}>
            {getFieldDecorator(
              'data.line.color',
              {}
            )(<ColorPicker className={styles.colorPicker} preset />)}
          </FormItem>
        </Col>
      </Row>
    </>
  )
}

export default memo(LineForm)
