import React, { createRef } from 'react'
import classnames from 'classnames'
import Helmet from 'react-helmet'
import { Link, Route, Switch } from 'react-router-dom'

import { withRouter } from "react-router-dom";

import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { checkNameUniqueAction } from '../App/actions'
import { ProjectActions } from '../Projects/actions'
import { VizActions } from '../Viz/actions'

import { makeSelectCurrentProject } from '../Projects/selectors'
import { makeSelectPortals, makeSelectDisplays, makeSelectPortalsTotal, makeSelectReleaseDashboardIng } from '../Viz/selectors'

import { Icon, Row, Col, Breadcrumb, Table, Modal, Menu, Card, Tooltip, Dropdown, Button } from 'antd'
import Box from 'components/Box'
import Container, { ContainerTitle, ContainerBody } from 'components/Container'
import PortalList from './components/PortalList'
import DisplayList from './components/DisplayList'
import ReleaseListModel from 'containers/Viz/components/ReleaseListModel'
import { IProject } from '../Projects/types'
import { IPortal, Display, IDisplayFormed } from './types'

// import styles from './Viz.less'
import styles from '../Widget/Widget.less'
import utilStyles from 'assets/less/util.less'

import { RouteComponentWithParams } from 'utils/types'
import OrganizationActions from '../Organizations/actions'
import CopyModal from 'containers/Widget/components/CopyModal'
import { usePagination } from 'containers/Widget/List'
import {columns, useChangeView} from '../Widget/List'
import SwitchCardAndList from 'components/SwitchCardAndList'
import { WidgetActions } from 'containers/Widget/actions'
import { ColumnProps } from '_antd@3.26.20@antd/lib/table'
import { TextOverflow } from 'app/components/hook/usePublic';
import DashboardOperateModel from 'containers/Viz/components/DashboardOperateModel'
import PortalListReleaseModelForm from 'containers/Viz/components/PortalListReleaseModel'
import history from 'utils/history'
import { Grid } from 'containers/Dashboard/Loadable'
enum ListType {
  'Viz', 'Display'
}


interface IVizProps {
  currentProject: IProject

  displays: Display[]
  portals: IPortal[]
  portalsTotal: number
  releaseDashboardIng: boolean
  onLoadDisplays: (projectId: number) => void
  onAddDisplay: (display: IDisplayFormed, resolve: () => void) => void
  onEditDisplay: (display: IDisplayFormed, resolve: () => void) => void
  onDeleteDisplay: (displayId: number) => void
  onCopyDisplay: (display: IDisplayFormed, resolve: () => void) => void

  onLoadPortals: (projectId: number, page: number, pageSize: number) => void
  onAddPortal: (portal: IPortal, resolve) => void
  onCopyPortal: (portal: IPortal, resolve) => void
  onEditPortal: (portal: IPortal, resolve) => void
  onDeletePortal: (portalId: number) => void
  onReleaseDashboard: (params: any, resolve: any) => void
  listType: ListType,
  onCheckUniqueName: (
    pathname: string,
    data: any,
    resolve: () => any,
    reject: (error: string) => any
  ) => any
  onLoadProjectRoles: (projectId: number) => void
  onExcludeRoles: (type: string, id: number, resolve?: any) => any
}

enum SwitchType {
  'card' = 1, 'list' = 2
}

interface IVizStates {
  collapse: { dashboard: boolean; display: boolean },
  page: number,
  pageSize: number,
  operateId: number,
  releaseModel: {
    id:number
  },
  isShowReleaseList: boolean
  isShowReleaseDialog: boolean,
  switchChange: SwitchType
}

 const MyVizList = props => {
   const { list , showEditDialog, openCopyModal, showDeleteDialog, showReleaseListDialog, showReleaseDialog, toDetail} = props
   const confirmDelete = (id) => {
     Modal.confirm({
       title: '?????????????????????',
       content: '????????????????????????????????????',
       okText: '??????',
       cancelText: '??????',
       icon: <Icon type="info-circle" />,
       onOk:  ()=> {
         console.log(id)
         // onDeleteWidget(id)()
       }
     });
   }



   const menu = (record) => (
     <Menu>
       <Menu.Item key="1" onClick={() => openCopyModal(record)}>??????</Menu.Item>
       <Menu.Item key="2" onClick={() => showEditDialog(record)}>??????</Menu.Item>
       <Menu.Item key="4" onClick={() => showDeleteDialog(record)}>??????</Menu.Item>
       <Menu.Item key="3" onClick={() => showReleaseDialog(record)}>????????????</Menu.Item>
       <Menu.Item key="5" onClick={() => showReleaseListDialog(record)}>????????????</Menu.Item>
     </Menu>
   )
   const toEditPage = () => {
     // /project/:projectId/portal/:portalId/dashboard/:dashboardId
     history.push(`/project/:projectId/vizs/portal/:portalId/dashboard/:dashboardId`)
   }
   return (
     <div>
       <div className={styles['flex-wrapper']}>
         {list.map(x => {
           const { name, description, createTime, updateTime, projectId, id } = x
           return (
             <Card className={styles['content-card']} key={x.id} data-v-widget>
               <div className="toDetail" onClick={toDetail(x.id, x.dashboardId)}>
                 <p className={styles['inner-img']}><img src={require('app/assets/images/ic_yibiaopan.svg')} /></p>
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
     </div>
   )
 }



export class VizList extends React.Component<
  IVizProps & RouteComponentWithParams,
  IVizStates
> {
  public state: Readonly<IVizStates> = {
    collapse: {
      dashboard: true,
      display: true
    },
    operateId: 0,
    isShowReleaseDialog: false,
    isShowReleaseList: false,
    releaseModel: {
      id: 0
    },
    switchChange: 1,
    page: 1,
    pageSize: 10
  }
  private childOperateRef

  public componentWillMount() {
    const { match, onLoadPortals, onLoadProjectRoles } = this.props
    const projectId = +match.params.projectId
    const { page, pageSize } = this.state
    onLoadPortals(projectId, page, pageSize)
    onLoadProjectRoles(projectId)
  }

  private refreshPortals = () => {
    const { onLoadPortals, match } = this.props
    const projectId = +match.params.projectId
    const { pageSize } = this.state
    this.setState({
      page: 1
    }, () => {
      onLoadPortals(projectId, 1, pageSize)
    })
  }
  private goToPortal = (portalId: number, dashboardId: number) => () => {
    const { history, match } = this.props
    history.push(`/project/${match.params.projectId}/vizs/portal/${portalId}/dashboard/${dashboardId}`)
  }


  private onCollapseChange = (key: string) => () => {
    const { collapse } = this.state
    this.setState({
      collapse: {
        ...collapse,
        [key]: !collapse[key]
      }
    })
  }

  private changePage = (page, pageSize) => {
    const { onLoadPortals, match } = this.props
    this.setState({
      page,
      pageSize
    }, () => {
      onLoadPortals(+match.params.projectId, page, pageSize)
    })

  }

  private showCreateDialog = () => {
    this.childOperateRef.showPortalForm('add')
  }
  private showEditDialog = (record) => {
    this.childOperateRef.showPortalForm('edit', record)
  }

  private openCopyModal = (record) => {
    const copyRecord = { ...record }
    copyRecord.name += '_copy'
    this.childOperateRef.showPortalForm('copy', copyRecord)
  }

  private showReleaseDialog = (record?) => {
    this.setState({
      isShowReleaseDialog: true,
      releaseModel: record ? { ...record } : this.state.releaseModel
    })
  }
  private hideReleaseModel = () => {
    this.setState({ isShowReleaseDialog: false })
  }
  private showDeleteDialog = (record) => {
    return (
      Modal.confirm({
        title: '???????????????????',
        content: '???????????????????????????????????????',
        onOk: () => {
          this.props.onDeletePortal(record.id)
        },
        onCancel() {
        },
      })
    )
  }

  private showReleaseListDialog = (record) => {
    this.setState({
      releaseModel: { ...record },
      operateId: record.dashboardId
    }, () => {
      this.setState({
        isShowReleaseList: true
      })
    })
  }
  private hideReleaseListModel = () => this.setState({ isShowReleaseList: false })
  private createNew = () => {
    this.hideReleaseListModel()
    this.showReleaseDialog()
  }

  public render() {

    const VizCol: Array<ColumnProps<IPortal>> = [
      {
        title: '???????????????',
        width: 180,
        dataIndex: 'name',
        render: (text, record) => (
          <span style={{ color: '#1740DC', cursor: 'pointer' }}
                onClick={this.goToPortal(record.id, record.dashboardId)}>{text}</span>
        )
      },
      {
        title: '????????????',
        width: 180,
        dataIndex: 'createTime',
        sorter: (a, b) => (new Date(a.createTime).getTime()) - (new Date(b.createTime).getTime())
      },
      {
        title: '??????',
        dataIndex: 'description',
        ellipsis: true
      },
      {
        title: '??????',
        dataIndex: 'operate',
        align: 'right',
        width: 260,
        render: (text, record) => (
          <div className={utilStyles.tableOperate}>
            <span onClick={() => this.openCopyModal(record)}>??????</span>
            <span onClick={() => this.showEditDialog(record)}>??????</span>
            <span onClick={() => this.showDeleteDialog(record)}>??????</span>
            <span onClick={() => this.showReleaseDialog(record)}>????????????</span>
            <span onClick={() => this.showReleaseListDialog(record)}>????????????</span>
          </div>
        )
      }
    ]

    const {
      match,
      portals,
      onAddPortal,
      onEditPortal,
      onDeletePortal,
      currentProject,
      onCheckUniqueName,
      portalsTotal,
      onCopyPortal
    } = this.props
    const { switchChange, releaseModel } = this.state
    const projectId = +match.params.projectId
    const isHideDashboardStyle = classnames({
      [styles.listPadding]: true,
      [utilStyles.hide]: !this.state.collapse.dashboard
    })


    const pagination = () => {
      if (!portals?.length) return null
      return usePagination({
        total: portalsTotal,
        changePage: this.changePage
      })
    }

    return (
      <>
        <div className={styles.widgetList}>
          <div className={styles.header}>
            <div>
              <Button onClick={this.showCreateDialog} icon="plus" type="primary">
                ???????????????
              </Button>
            </div>
            <SwitchCardAndList changeViewCallback={(type) => {
              this.setState({ switchChange: type })
            }} />
          </div>
          <p className={styles.subtitle}>???????????????????????????????????????????????????????????????</p>
          {/* <Box.Body> */}
          <Row style={{ marginBottom: '20px' }}>
            <Col span={24}>
              {switchChange === 1 &&
              <MyVizList showReleaseListDialog={this.showReleaseListDialog} showDeleteDialog={this.showDeleteDialog}
                         toDetail={this.goToPortal} showReleaseDialog={this.showReleaseDialog}
                         openCopyModal={this.openCopyModal} list={portals} showEditDialog={this.showEditDialog} /> ||
              <Table
                rowKey="id"
                dataSource={portals}
                columns={VizCol}
                pagination={false}
              />
              }
            </Col>
          </Row>
          {pagination()
          }
        </div>
        {
          this.state.isShowReleaseList &&
          <ReleaseListModel createNew={this.createNew} hideModal={this.hideReleaseListModel}
                            dataId={this.state.operateId} visible={this.state.isShowReleaseList} />
        }
        <PortalListReleaseModelForm
          visible={this.state.isShowReleaseDialog}
          releaseModal={this.state.releaseModel}
          hideReleaseModel={this.hideReleaseModel}
          operateSuccess={this.refreshPortals}
          releaseDashboardIng={this.props.releaseDashboardIng}
          releaseDashboard={this.props.onReleaseDashboard}
        />
        <DashboardOperateModel
          currentProject={currentProject}
          projectId={projectId}
          portals={portals}
          onPortalClick={this.goToPortal}
          onAdd={onAddPortal}
          onEdit={onEditPortal}
          onCopy={onCopyPortal}
          onDelete={onDeletePortal}
          refreshList={this.refreshPortals}
          childRef={ref => this.childOperateRef = ref}
          onCheckUniqueName={onCheckUniqueName}
          onExcludeRoles={this.props.onExcludeRoles}
        />
        {
          portals?.length &&
          <Switch>
            <Route path="/project/:projectId/vizs/portal/:portalId/dashboard/:dashboardId" component={Grid} />
            <Route path="/project/:projectId/vizs/portal/:portalId/dashboard/:dashboardId/preview" component={Grid} />
          </Switch>
        }
      </>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  displays: makeSelectDisplays(),
  portals: makeSelectPortals(),
  portalsTotal: makeSelectPortalsTotal(),
  currentProject: makeSelectCurrentProject(),
  releaseDashboardIng: makeSelectReleaseDashboardIng()
})

export function mapDispatchToProps(dispatch) {
  return {
    onAddDisplay: (display: IDisplayFormed, resolve) =>
      dispatch(VizActions.addDisplay(display, resolve)),
    onEditDisplay: (display: IDisplayFormed, resolve) =>
      dispatch(VizActions.editDisplay(display, resolve)),
    onCopyDisplay: (display: IDisplayFormed, resolve) =>
      dispatch(VizActions.copyDisplay(display, resolve)),
    onLoadPortals: (projectId, page, pageSize) => dispatch(VizActions.loadPortals(projectId, page, pageSize)),
    onAddPortal: (portal, resolve) =>
      dispatch(VizActions.addPortal(portal, resolve)),
    onEditPortal: (portal, resolve) =>
      dispatch(VizActions.editPortal(portal, resolve)),
    onCopyPortal: (portal, resolve) =>
      dispatch(VizActions.copyPortal(portal, resolve)),
    onDeletePortal: (id) => dispatch(VizActions.deletePortal(id)),
    onCheckUniqueName: (pathname, data, resolve, reject) =>
      dispatch(checkNameUniqueAction(pathname, data, resolve, reject)),
    onLoadProjectRoles: (projectId) =>
      dispatch(OrganizationActions.loadProjectRoles(projectId)),
    onExcludeRoles: (type, id, resolve) =>
      dispatch(ProjectActions.excludeRoles(type, id, resolve)),
    onReleaseDashboard: (params, resolve) =>
      dispatch(VizActions.dashboardRelease(params, resolve))
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default withRouter(withConnect(VizList))
