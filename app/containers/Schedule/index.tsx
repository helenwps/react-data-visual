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

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import { RouteComponentWithParams } from 'utils/types'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import { createStructuredSelector } from 'reselect'
import { makeSelectCurrentProject } from 'containers/Projects/selectors'
import { makeSelectLoading, makeSelectSchedules, makeSelectSchedulesTotal } from './selectors'
import { ScheduleActions } from './actions'
import reducer from './reducer'
import saga from './sagas'
import {usePagination} from 'app/containers/Widget/List.tsx'
import { withRouter } from "react-router-dom";
import ModulePermission from 'containers/Account/components/checkModulePermission'
import { initializePermission } from 'containers/Account/components/checkUtilPermission'

import { useTablePagination } from 'utils/hooks'

import {
  Row,
  Col,
  Breadcrumb,
  Table,
  Icon,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Modal, Card, Dropdown, Menu
} from 'antd'
import { ButtonProps } from 'antd/lib/button'
import { ColumnProps } from 'antd/lib/table'
import Container, { ContainerTitle, ContainerBody } from 'components/Container'
import Box from 'components/Box'

import { ISchedule, JobStatus, IScheduleLoading } from './types'
import { IProject } from 'containers/Projects/types'

import utilStyles from 'assets/less/util.less'
import Styles from './Schedule.less'
import styles from 'containers/Widget/Widget.less'
import SwitchCardAndList from 'components/SwitchCardAndList'
import { TextOverflow } from 'components/hook/usePublic'

interface IScheduleListStateProps {
  loading: IScheduleLoading
  schedules: any
  schedulesTotal: number
  currentProject: IProject
}

interface IScheduleListDispatchProps {
  onLoadSchedules: (projectId: number, page: number, pageSize: number) => any
  onDeleteSchedule: (id: number) => any
  onChangeScheduleJobStatus: (id: number, status: JobStatus) => any
  onExecuteScheduleImmediately: (id: number, resolve: () => void) => any
}

type ScheduleListProps = IScheduleListStateProps &
  IScheduleListDispatchProps &
  RouteComponentWithParams

const JobStatusNextOperations: { [key in JobStatus]: string } = {
  new: '??????',
  failed: '??????',
  started: '??????',
  stopped: '??????'
}

const JobStatusIcons: { [key in JobStatus]: string } = {
  new: 'caret-right',
  failed: 'reload',
  started: 'pause',
  stopped: 'caret-right'
}

const ScheduleList: React.FC<ScheduleListProps> = (props) => {
  const {
    match,
    history,
    loading,
    schedules,
    currentProject,
    onLoadSchedules,
    onDeleteSchedule,
    onChangeScheduleJobStatus,
    onExecuteScheduleImmediately,
    schedulesTotal
  } = props
  const [execLogModalVisible, setExecLogModalVisible] = useState(false)
  const pagination = useMemo(() => usePagination({
    total: schedulesTotal,
    changePage: (page, pageSize) => onLoadSchedules(+match.params.projectId, page, pageSize)
  }), [schedulesTotal])
  const [execLog, setExecLogContent] = useState('')
  const tablePagination = useTablePagination(0)
  const openExecLogModal = useCallback((logContent) => () => {
    setExecLogModalVisible(true)
    setExecLogContent(logContent)
  }, [])
  const closeExecLogModal = useCallback(() => {
    setExecLogModalVisible(false)
  }, [])

  const [switchChange, setSwitchChange] = useState(1)

  const columns: Array<ColumnProps<ISchedule>> = useMemo(() => {
    return [
      {
        title: '??????',
        dataIndex: 'name',
        render: (name, record) => {
          if (!record.execLog) {
            return name
          }
          return (
            <p className={Styles.info}>
              {name}
              <Tooltip title="????????????????????????">
                <Icon
                  type="info-circle"
                  onClick={openExecLogModal(record.execLog)}
                />
              </Tooltip>
            </p>
          )
        }
      },
      {
        title: '??????',
        dataIndex: 'description'
      },
      {
        title: '??????',
        dataIndex: 'jobType',
        width: 60,
        align: 'left'
      },
      {
        title: '??????????????????',
        dataIndex: 'startDate',
        width: 180,
        align: 'left'
      },
      {
        title: '??????????????????',
        dataIndex: 'endDate',
        width: 180,
        align: 'left'
      },
      {
        title: '??????',
        dataIndex: 'jobStatus',
        width: 80,
        align: 'left'
      }
    ]
  }, [])

  useEffect(() => {
    onLoadSchedules(+match.params.projectId, 1, 10)
  }, [])

  const addSchedule = useCallback(
    () => {
      const { projectId } = match.params
      history.push(`/project/${projectId}/schedule`)
    },
    [currentProject]
  )

  const { schedulePermission, AdminButton, EditButton } = useMemo(
    () => ({
      schedulePermission: initializePermission(
        currentProject,
        'schedulePermission'
      ),
      AdminButton: ModulePermission<ButtonProps>(
        currentProject,
        'schedule',
        true
      )(Button),
      EditButton: ModulePermission<ButtonProps>(
        currentProject,
        'schedule',
        false
      )(Button)
    }),
    [currentProject]
  )

  const changeJobStatus = useCallback(
    (schedule: ISchedule) => () => {
      const { id, jobStatus } = schedule
      onChangeScheduleJobStatus(id, jobStatus)
    },
    [onChangeScheduleJobStatus]
  )

  const executeScheduleImmediately = useCallback(
    (id: number) => () => {
      Modal.confirm({
        title: '??????????????????????',
        content: '???????????????????????????????????????',
        onOk: () => {
          console.log(id, 'run')
          onExecuteScheduleImmediately(id, () => {
            message.success('?????????????????????')
          })
        },
        onCancel() {
        },
      })
    },
    [onExecuteScheduleImmediately]
  )

  const editSchedule = useCallback(
    (scheduleId: number) => () => {
      const { projectId } = match.params
      history.push(`/project/${projectId}/schedule/${scheduleId}`)
    },
    []
  )

  const deleteSchedule = useCallback(
    (scheduleId: number) => () => {
      Modal.confirm({
        title: '???????????????????',
        content: '???????????????????????????????????????',
        onOk: () => {
          onDeleteSchedule(scheduleId)
        },
        onCancel() {
        },
      })
    },
    [onDeleteSchedule]
  )

  const menu = (record) => (
    <Menu>
      <Menu.Item key="1" onClick={changeJobStatus(record)}>{JobStatusNextOperations[record.jobStatus]}</Menu.Item>
      <Menu.Item key="2" onClick={executeScheduleImmediately(record)}>????????????</Menu.Item>
      <Menu.Item key="4" onClick={editSchedule(record.id)}>??????</Menu.Item>
      <Menu.Item key="3" onClick={deleteSchedule(record)}>??????</Menu.Item>
    </Menu>
  )

  const tableColumns = [...columns]
  if (schedulePermission) {
    tableColumns.push({
      title: '??????',
      key: 'action',
      align: 'right',
      width: 185,
      render: (_, record) => (
        <div className={utilStyles.tableOperate}>
          <span onClick={changeJobStatus(record)}>{JobStatusNextOperations[record.jobStatus]}</span>
          <span onClick={executeScheduleImmediately(record.id)}>????????????</span>
          <span onClick={editSchedule(record.id)}>??????</span>
          <span onClick={deleteSchedule(record.id)}>??????</span>
        </div>
        // <span className="ant-table-action-column">
        //   <Tooltip title={JobStatusNextOperations[record.jobStatus]}>
        //     <Button
        //       icon={JobStatusIcons[record.jobStatus]}
        //       shape="circle"
        //       type="ghost"
        //       onClick={changeJobStatus(record)}
        //     />
        //   </Tooltip>
        //   <Popconfirm
        //     title="?????????????????????"
        //     placement="bottom"
        //     onConfirm={executeScheduleImmediately(record.id)}
        //   >
        //     <Tooltip title="????????????">
        //       <Button
        //         shape="circle"
        //         type="ghost"
        //       >
        //         <i className="iconfont icon-lijitoudi" />
        //       </Button>
        //     </Tooltip>
        //   </Popconfirm>
        //   <Tooltip title="??????" trigger="hover">
        //     <EditButton
        //       icon="edit"
        //       shape="circle"
        //       type="ghost"
        //       onClick={editSchedule(record.id)}
        //     />
        //   </Tooltip>
        //   <Popconfirm
        //     title="???????????????"
        //     placement="bottom"
        //     onConfirm={deleteSchedule(record.id)}
        //   >
        //     <Tooltip title="??????">
        //       <AdminButton icon="delete" shape="circle" type="ghost" />
        //     </Tooltip>
        //   </Popconfirm>
        // </span>
      )
    })
  }

  return (
    <Container>
      {/*<Helmet title="Schedule" />*/}
      {/*<ContainerTitle>*/}
      {/*  <Row>*/}
      {/*    <Col span={24}>*/}
      {/*      <Breadcrumb className={utilStyles.breadcrumb}>*/}
      {/*        <Breadcrumb.Item>*/}
      {/*          <Link to="">Schedule</Link>*/}
      {/*        </Breadcrumb.Item>*/}
      {/*      </Breadcrumb>*/}
      {/*    </Col>*/}
      {/*  </Row>*/}
      {/*</ContainerTitle>*/}
      {/*<ContainerBody grid={true}>*/}
      {/*  <Box>*/}
      {/*    <Box.Header>*/}
      {/*      <Box.Title>*/}
      {/*        <Icon type="bars" />*/}
      {/*        Schedule List*/}
      {/*      </Box.Title>*/}
      {/*      <Box.Tools>*/}
      {/*        <Tooltip placement="bottom" title="??????">*/}
      {/*          <AdminButton type="primary" icon="plus" onClick={addSchedule} />*/}
      {/*        </Tooltip>*/}
      {/*      </Box.Tools>*/}
      {/*    </Box.Header>*/}
      {/*    <Box.Body>*/}
      {/*      <Row>*/}
      {/*        <Col span={24}>*/}
      {/*          <Table*/}
      {/*            rowKey="id"*/}
      {/*            bordered*/}
      {/*            dataSource={schedules}*/}
      {/*            columns={tableColumns}*/}
      {/*            // pagination={tablePagination}*/}
      {/*            loading={loading.table}*/}
      {/*          />*/}
      {/*        </Col>*/}
      {/*      </Row>*/}
      {/*    </Box.Body>*/}
      {/*  </Box>*/}
      {/*  {schedules.list?.length && pagination}*/}
      {/*</ContainerBody>*/}
      <div className={styles.widgetList}>
        <div className={styles.header}>
          <div>
            <Button onClick={addSchedule} icon="plus" type="primary">
              ????????????
            </Button>
          </div>
          <SwitchCardAndList changeViewCallback={(type) => {
            setSwitchChange(type)
          }} />
        </div>
        <p className={styles.subtitle}>??????????????????????????????????????????????????????????????????????????????????????????</p>
        {/* <Box.Body> */}
        <Row style={{ marginBottom: '20px' }}>
          <Col span={24}>
            {switchChange === 1 &&
            <div className={styles['flex-wrapper']}>
              {schedules.map(x => {
                const { name, description, createTime, updateTime, projectId, id } = x
                return (
                  <Card className={styles['content-card']} key={x.id} data-v-widget>
                    <div className="toDetail">
                      <p className={styles['inner-img']}><img src={require('app/assets/images/ic_renwu.svg')} /></p>
                      <div className={styles['inner-name']}><TextOverflow text={name} /></div>
                      <div className={styles.description}><TextOverflow text={description} /></div>
                      <p className={styles['inner-time']}>
                        <Tooltip title={createTime}>
                          ????????????
                        </Tooltip>
                        {updateTime && <Tooltip title={updateTime}> | ????????????</Tooltip>}
                      </p>
                    </div>
                    <p className={styles['inner-footer']}>
                      <Dropdown
                        overlay={menu(x)}
                        trigger={['click']}
                        overlayClassName='inner-dropdown'
                        placement="bottomRight"
                      >
                        <i className="iconfont" style={{ cursor: 'pointer' }}>&#xe6e8;</i>
                      </Dropdown>
                    </p>
                  </Card>
                )
              })}
            </div>
                       ||
            <Table
              rowKey="id"
              dataSource={schedules}
              columns={tableColumns}
              pagination={false}
            />
            }
          </Col>
        </Row>
        {pagination}
      </div>
      <Modal
        title="????????????"
        wrapClassName="ant-modal-large"
        visible={execLogModalVisible}
        onCancel={closeExecLogModal}
        footer={false}
      >
        {execLog}
      </Modal>
    </Container>
  )
}

const mapStateToProps = createStructuredSelector({
  schedules: makeSelectSchedules(),
  currentProject: makeSelectCurrentProject(),
  loading: makeSelectLoading(),
  schedulesTotal: makeSelectSchedulesTotal()
})

function mapDispatchToProps(dispatch) {
  return {
    onLoadSchedules: (projectId, page, pageSize) =>
      dispatch(ScheduleActions.loadSchedules(projectId, page, pageSize)),
    onDeleteSchedule: (id) => dispatch(ScheduleActions.deleteSchedule(id)),
    onChangeScheduleJobStatus: (id, currentStatus) =>
      dispatch(ScheduleActions.changeSchedulesStatus(id, currentStatus)),
    onExecuteScheduleImmediately: (id, resolve) =>
      dispatch(ScheduleActions.executeScheduleImmediately(id, resolve))
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

const withReducer = injectReducer({ key: 'schedule', reducer })
const withSaga = injectSaga({ key: 'schedule', saga })

export default compose(
  withRouter,
  withReducer,
  withSaga,
  withConnect
)(ScheduleList)
