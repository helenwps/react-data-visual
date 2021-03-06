import React, { useState, useEffect, useCallback, useMemo } from 'react'
import pick from 'lodash/pick'
import { ISourceFormValues, IDatasourceInfo } from '../types'

import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Input,
  Select,
  Icon,
  Cascader
} from 'antd'
const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option
import { FormComponentProps } from 'antd/lib/form/Form'
import { CascaderOptionType } from 'antd/lib/cascader'
import { SourceProperty } from './types'
import {
  EditableFormTable,
  EditableColumnProps
} from 'components/Table/Editable'

const utilStyles = require('assets/less/util.less')

interface ISourceConfigModalProps
  extends FormComponentProps<ISourceFormValues> {
  visible: boolean
  formLoading: boolean
  testLoading: boolean
  source: ISourceFormValues
  datasourcesInfo: IDatasourceInfo[]
  onSave: (values: any) => void
  onClose: () => void
  // onTestSourceConnection: (
  //   username: string,
  //   password: string,
  //   jdbcUrl: string,
  //   ext: boolean,
  //   version: string
  // ) => any
  onCheckUniqueName: (
    pathname: string,
    data: any,
    resolve: () => any,
    reject: (error: string) => any
  ) => any
}

const commonFormItemStyle = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

const longFormItemStyle = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

const datasourceInfoDisplayRender = (label: string[]) => label.join(' : ')

const columns: Array<EditableColumnProps<SourceProperty>> = [
  {
    title: 'Key',
    dataIndex: 'key',
    width: '30%',
    editable: true,
    inputType: 'input'
  },
  {
    title: 'Value',
    dataIndex: 'value',
    editable: true,
    inputType: 'input'
  }
]
const SourceConfigModal: React.FC<ISourceConfigModalProps> = (props) => {
  const {
    visible,
    source,
    datasourcesInfo,
    form,
    formLoading,
    testLoading,
    // onTestSourceConnection,
    onCheckUniqueName,
    onSave,
    onClose
  } = props
  if (!source) {
    return null
  }
  const { id: sourceId } = source
  const { getFieldDecorator } = form
  const [dbList, setDBList] = useState([])
  useEffect(() => {
    setDBList(datasourcesInfo)
  }, [datasourcesInfo])
  useEffect(
    () => {
      let fieldsKeys: Array<keyof ISourceFormValues> = [
        'id',
        'name',
        'type',
        'datasourceInfo',
        'description',
        'ip',
        'port',
        'dbName'
      ]
      // @FIXME nested object properties name typing
      fieldsKeys = []
        .concat(fieldsKeys)
        .concat(['config.username', 'config.password'])

      const fieldsValue = pick(source, fieldsKeys)
      console.log(fieldsValue)
      form.setFieldsValue(fieldsValue)
    },
    [source, visible]
  )
  const checkNameUnique = useCallback(
    (_, name = '', callback) => {
      const { id, projectId } = source
      const {tenantId} = JSON.parse(localStorage.getItem('loginUser'))

      const data = { id, name, tenantId }
      if (!name) {
        callback()
      }
      onCheckUniqueName(
        'source',
        data,
        () => {
          callback()
        },
        (err) => callback(err)
      )
    },
    [onCheckUniqueName, source]
  )

  const datasourceInfoChange = useCallback(
    (value: string[]) => {
      const datasourceName = value[0]
      const selectedDatasource = datasourcesInfo.find(
        ({ name }) => name === datasourceName
      )
      const prefix = selectedDatasource.prefix
      const currentUrl = form.getFieldValue('config.url') as string
      let hasMatched = false
      let newUrl = currentUrl.replace(/^jdbc:([\w:]+):/, (match) => {
        hasMatched = !!match
        return prefix
      })
      if (!hasMatched) {
        newUrl = prefix + currentUrl
      }
      form.setFieldsValue({ 'config.url': newUrl })
    },
    [datasourcesInfo]
  )

  // const testSourceConnection = useCallback(
  //   () => {
  //     const {
  //       datasourceInfo,
  //       config
  //     } = form.getFieldsValue() as ISourceFormValues
  //     const { username, password } = config
  //     const version =
  //       datasourceInfo[1] === 'Default' ? '' : datasourceInfo[1] || ''
  //     onTestSourceConnection(username, password, !!version, version)
  //   },
  //   [form, onTestSourceConnection]
  // )

  const save =
    () => {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const { ip, port, dbName } = values
          const datasourceName = values.datasourceInfo[0]
          const selectedDatasource = datasourcesInfo.find(
            ({ name }) => name === datasourceName
          )
          // values.config.url = `${selectedDatasource.prefix}//${ip}:${port}/${dbName}`
          onSave(values)
        }
      })
    }

  const typeChange = useCallback(val => {
    if (val !== 'jdbc') setDBList([{ "name": "clickhouse", "prefix": "jdbc:clickhouse:", "versions": "" }])
    else setDBList(datasourcesInfo)
  }, [datasourcesInfo])

  const reset = useCallback(
    () => {
      form.resetFields()
    },
    [form]
  )

  const cascaderOptions: CascaderOptionType[] = useMemo(
    () =>
      dbList.map(({ name, versions }) => ({
        label: name,
        value: name,
        ...(versions && {
          children: versions.map((ver) => ({
            label: ver,
            value: ver
          }))
        })
      })),
    [dbList]
  )

  const modalButtons = useMemo(
    () => [
      <Button key="back" size="small" onClick={onClose}>
        ??????
      </Button>,
      <Button
        key="submit"
        size="small"
        type="primary"
        loading={formLoading}
        disabled={formLoading}
        onClick={save}
      >
        ??????
    </Button>
    ],
    [form, formLoading, onSave, onClose]
  )
  const type = form.getFieldValue('type')
  return (
    <Modal
      title={`${!sourceId ? '???????????????' : '??????'}`}
      wrapClassName="ant-modal-medium"
      maskClosable={false}
      visible={visible}
      footer={modalButtons}
      onCancel={onClose}
      afterClose={reset}
    >
      <Form labelAlign="left">
        <Row>
          <FormItem className={utilStyles.hide}>
            {getFieldDecorator<ISourceFormValues>('id')(<Input />)}
          </FormItem>
          <Col span={12}>

          </Col>
        </Row>
        <FormItem label="???????????????" {...commonFormItemStyle} hasFeedback>
          {getFieldDecorator<ISourceFormValues>('name', {
            rules: [
              {
                required: true,
                message: '???????????????????????????'
              },
              {
                min: 1,
                max: 20,
                message: '????????????????????????1-20???'
              },
              {
                validator: checkNameUnique
              }
            ]
          })(<Input autoComplete="off" placeholder="???????????????" />)}
        </FormItem>
        <FormItem label="??????" {...commonFormItemStyle}>
          {getFieldDecorator<ISourceFormValues>('type', {
            initialValue: 'jdbc'
          })(
            <Select onChange={typeChange}>
              <Option value="jdbc">jdbc</Option>
              <Option value="csv">csv??????</Option>
              <Option value="excel">excel??????</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="?????????" {...commonFormItemStyle}>
          {getFieldDecorator<ISourceFormValues>('datasourceInfo', {
            initialValue: [],
            rules: [
              {
                required: true,
                message: '?????????????????????'
              }
            ]
          })(
            <Cascader
              options={cascaderOptions}
              displayRender={datasourceInfoDisplayRender}
            // onChange={datasourceInfoChange}
            />
          )}
        </FormItem>
        { type == 'jdbc' && <FormItem label="?????????" {...commonFormItemStyle}>
          {getFieldDecorator('config.username', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '??????????????????'
              }
            ]
          })(<Input autoComplete="off" placeholder="??????????????????" />)}
        </FormItem> }
        { type == 'jdbc' && <FormItem label="??????" {...commonFormItemStyle}>
          {getFieldDecorator('config.password', {
            initialValue: '',
            rules: [
              {
                required: form.getFieldValue('datasourceInfo').length && form.getFieldValue('datasourceInfo')[0] == 'mysql',
                message: '???????????????'
              }
            ]
          })(
            <Input
              autoComplete="off"
              placeholder="???????????????"
              type="password"
            />
          )}
        </FormItem> }
        {type == 'jdbc' && <FormItem label="ip" {...commonFormItemStyle}>
          {getFieldDecorator('ip', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: 'ip????????????'
              },
            ]
          })(
            <Input
              autoComplete="off"
              placeholder="?????????ip"
            />
          )}
        </FormItem> }
        {type == 'jdbc' && <FormItem label="??????" {...commonFormItemStyle}>
          {getFieldDecorator('port', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '??????????????????'
              },
            ]
          })(
            <Input
              autoComplete="off"
              placeholder="???????????????"
            />
          )}
        </FormItem> }
        {type == 'jdbc' && <FormItem label="???????????????" {...commonFormItemStyle}>
          {getFieldDecorator('dbName', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '????????????????????????'
              },
            ]
          })(
            <Input
              autoComplete="off"
              placeholder="????????????????????????"
            />
          )}
        </FormItem> }
        <FormItem label="??????" {...commonFormItemStyle}>
          {getFieldDecorator('description', {
            initialValue: ''
          })(
            <TextArea
              placeholder="???????????????"
              autosize={{ minRows: 3, maxRows: 6 }}
            />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create<ISourceConfigModalProps>()(SourceConfigModal)
