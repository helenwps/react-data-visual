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

import React, { FC, useCallback, memo } from 'react'
import {
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Radio,
  Select,
  Divider
} from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { RadioChangeEvent } from 'antd/lib/radio'
import Condition from './Condition'
import {
  ControlTypesLocale,
  ControlTypes,
  DatePickerFormatsLocale,
  ControlVisibilityTypes,
  SHOULD_LOAD_OPTIONS
} from '../../constants'
import { IControl } from '../../types'
import { getDatePickerFormatOptions } from '../../util'
import utilStyles from 'assets/less/util.less'
import BaseFormStyle from './BaseForm.less'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

interface IBaseFormProps {
  form: WrappedFormUtils
  controls: IControl[]
  controlBase: Omit<IControl, 'relatedItems' | 'relatedViews'>
  onControlTypeChange: (value) => void
  onMultipleSettingChange: (e: CheckboxChangeEvent) => void
  onSliderPropChange: (min: number, max: number, step: number) => void
  onCommonPropChange: (propName: string, value) => void
}

const BaseForm: FC<IBaseFormProps> = ({
  form,
  controls,
  controlBase,
  onControlTypeChange,
  onMultipleSettingChange,
  onSliderPropChange,
  onCommonPropChange
}) => {
  const { getFieldDecorator } = form
  const { key, type, multiple, visibility } = controlBase
  const datePickerFormatOptions = getDatePickerFormatOptions(type, multiple)
  const colSpan = { xxl: 24, xl: 24 }
  const itemCols = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }

  const radioTypeChange = useCallback(
    (e: RadioChangeEvent) => {
      onCommonPropChange('radioType', e.target.value)
    },
    [onCommonPropChange]
  )
  const visibilityChange = useCallback(
    (e: RadioChangeEvent) => {
      onCommonPropChange('visibility', e.target.value)
    },
    [onCommonPropChange]
  )

  const minChange = useCallback(
    (value) => {
      const { max, step } = form.getFieldsValue()
      onSliderPropChange(value, max, step)
    },
    [form, onSliderPropChange]
  )
  const maxChange = useCallback(
    (value) => {
      const { min, step } = form.getFieldsValue()
      onSliderPropChange(min, value, step)
    },
    [form, onSliderPropChange]
  )
  const stepChange = useCallback(
    (value) => {
      const { min, max } = form.getFieldsValue()
      onSliderPropChange(min, max, value)
    },
    [form, onSliderPropChange]
  )
  const labelChange = useCallback(
    (e: CheckboxChangeEvent) => {
      onCommonPropChange('label', e.target.checked)
    },
    [onCommonPropChange]
  )

  const minValidator = useCallback(
    (rule, value, callback) => {
      if (typeof value === 'number') {
        const max = form.getFieldValue('max')
        if (typeof max === 'number' && value > max) {
          callback('??????????????????????????????')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    [form]
  )
  const maxValidator = useCallback(
    (rule, value, callback) => {
      form.validateFields(['min'], { force: true }, () => void 0)
      callback()
    },
    [form]
  )

  const getDateFormatComponent = useCallback(
    () => (
      <Row key="dateFormat">
        <Col {...colSpan}>
          <FormItem label="????????????" {...itemCols}>
            {getFieldDecorator(
              'dateFormat',
              {}
            )(
              <Select>
                {datePickerFormatOptions.map((format) => {
                  const title = DatePickerFormatsLocale[format]
                  return (
                    <Option key={title} value={format}>
                      {title}
                    </Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    ),
    [datePickerFormatOptions]
  )

  const getMultipleComponent = useCallback(
    () => (
      <Row key="multiple">
        <Col {...colSpan}>
          <FormItem label="??????" {...itemCols}>
            {getFieldDecorator('multiple', { valuePropName: 'checked' })(
              <Checkbox onChange={onMultipleSettingChange} />
            )}
          </FormItem>
        </Col>
      </Row>
    ),
    [onMultipleSettingChange]
  )

  let controlPropComponents
  switch (type) {
    case ControlTypes.Date:
      controlPropComponents = [getDateFormatComponent(), getMultipleComponent()]
      break
    case ControlTypes.DateRange:
      controlPropComponents = [getDateFormatComponent()]
      break
    case ControlTypes.Select:
    case ControlTypes.TreeSelect:
      controlPropComponents = [getMultipleComponent()]
      break
    case ControlTypes.Radio:
      controlPropComponents = (
        <Row key="radioType">
          <Col {...colSpan}>
            <FormItem label="????????????" {...itemCols}>
              {getFieldDecorator(
                'radioType',
                {}
              )(
                <RadioGroup onChange={radioTypeChange}>
                  <RadioButton value="normal">??????</RadioButton>
                  <RadioButton value="button">??????</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
      )
      break
    case ControlTypes.Slider:
      controlPropComponents = (
        <>
          <Row key="min">
            <Col {...colSpan}>
              <FormItem label="?????????" {...itemCols}>
                {getFieldDecorator('min', {
                  rules: [
                    { required: true, message: '?????????????????????' },
                    { validator: minValidator }
                  ]
                })(<InputNumber onChange={minChange} />)}
              </FormItem>
            </Col>
          </Row>
          <Row key="max">
            <Col {...colSpan}>
              <FormItem label="?????????" {...itemCols}>
                {getFieldDecorator('max', {
                  rules: [
                    { required: true, message: '?????????????????????' },
                    { validator: maxValidator }
                  ]
                })(<InputNumber onChange={maxChange} />)}
              </FormItem>
            </Col>
          </Row>
          <Row key="step">
            <Col {...colSpan}>
              <FormItem label="??????" {...itemCols}>
                {getFieldDecorator('step', { initialValue: 1 })(
                  <InputNumber min={1} onChange={stepChange} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row key="label">
            <Col {...colSpan}>
              <FormItem label="????????????" {...itemCols}>
                {getFieldDecorator('label', { valuePropName: 'checked' })(
                  <Checkbox onChange={labelChange} />
                )}
              </FormItem>
            </Col>
          </Row>
        </>
      )
      break
  }

  const selectTypeControls = controls.filter(
    (c) => c.type === ControlTypes.Select && c.key !== key
  )

  return (
    <div className={BaseFormStyle.baseForm} id="base-form">
      <div className={BaseFormStyle.mainTitle}>?????????????????????</div>
      <div className={utilStyles.flagTitle}>???????????????</div>
      <Row>
        <Col {...colSpan}>
          <FormItem className={utilStyles.hide}>
            {getFieldDecorator('key', {})(<Input />)}
          </FormItem>
          <FormItem label="??????" {...itemCols}>
            {getFieldDecorator(
              'type',
              {}
            )(
              <Select getPopupContainer={(triggerNode ) => triggerNode.parentElement} onChange={onControlTypeChange}>
                {Object.values(ControlTypes).map((controlType) => (
                  <Option key={controlType} value={controlType}>
                    {ControlTypesLocale[controlType]}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      {controlPropComponents}
      {SHOULD_LOAD_OPTIONS[type] && (
        <>
          <Row key="cache">
            <Col {...colSpan}>
              <FormItem label="??????" {...itemCols}>
                {getFieldDecorator(
                  'cache',
                  {}
                )(
                  <RadioGroup>
                    <RadioButton value={true}>??????</RadioButton>
                    <RadioButton value={false}>??????</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row key="expired">
            <Col {...colSpan}>
              <FormItem label="?????????(???)" {...itemCols}>
                {getFieldDecorator('expired', {})(<InputNumber />)}
              </FormItem>
            </Col>
          </Row>
        </>
      )}
      <Row>
        <Col {...colSpan}>
          <FormItem label="??????" {...itemCols}>
            {getFieldDecorator(
              'width',
              {}
            )(
              <Select getPopupContainer={(triggerNode ) => triggerNode.parentElement}>
                <Option value={0}>????????????</Option>
                <Option value={24}>100%</Option>
                <Option value={12}>50%</Option>
                <Option value={8}>33.33% (1/3)</Option>
                <Option value={6}>25% (1/4)</Option>
                <Option value={4}>16.67% (1/6)</Option>
                <Option value={3}>12.5% (1/8)</Option>
                <Option value={2}>8.33% (1/12)</Option>
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col {...colSpan}>
          <FormItem label="????????????" {...itemCols}>
            {getFieldDecorator(
              'visibility',
              {}
            )(
              <RadioGroup onChange={visibilityChange}>
                <RadioButton value={ControlVisibilityTypes.Visible}>
                  ??????
                </RadioButton>
                <RadioButton value={ControlVisibilityTypes.Hidden}>
                  ??????
                </RadioButton>
                <RadioButton value={ControlVisibilityTypes.Conditional}>
                  ??????
                </RadioButton>
              </RadioGroup>
            )}
          </FormItem>
        </Col>
      </Row>
      {visibility === ControlVisibilityTypes.Conditional && (
        <Row>
          <Col {...colSpan}>
            <FormItem label="????????????" {...itemCols}>
              {getFieldDecorator(
                'conditions[0]',
                {}
              )(<Condition controls={selectTypeControls} />)}
            </FormItem>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default memo(BaseForm)
