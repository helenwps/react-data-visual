import React, { createRef } from 'react'
import classnames from 'classnames'
import Pivot from '../Pivot'
import Chart from '../Chart'
import { Icon } from 'antd'
import {
  AggregatorType,
  DragType,
  IDataParamConfig
} from '../Workbench/Dropbox'
import { IDataParamProperty } from '../Workbench/OperatingPanel'
import { IFieldFormatConfig } from '../Config/Format'
import { IFieldConfig } from '../Config/Field'
import { IFieldSortConfig } from '../Config/Sort'
import { IAxisConfig } from '../Workbench/ConfigSections/AxisSection'
import { ISplitLineConfig } from '../Workbench/ConfigSections/SplitLineSection'
import { IPivotConfig } from '../Workbench/ConfigSections/PivotSection'
import { ILabelConfig } from '..//Workbench/ConfigSections/LabelSection'
import { ISpecConfig } from '../Workbench/ConfigSections/SpecSection'
import { ILegendConfig } from '../Workbench/ConfigSections/LegendSection'
import { IVisualMapConfig } from '../Workbench/ConfigSections/VisualMapSection'
import { IToolboxConfig } from '../Workbench/ConfigSections/ToolboxSection'
import { IAreaSelectConfig } from '../Workbench/ConfigSections/AreaSelectSection'
import { IScorecardConfig } from '../Workbench/ConfigSections/ScorecardSection'
import { IGaugeConfig } from '../Workbench/ConfigSections/GaugeSection'
import { IframeConfig } from '../Workbench/ConfigSections/IframeSection'
import { ITableConfig } from '../Config/Table'
import { IRichTextConfig, IBarConfig, IRadarConfig } from '../Workbench/ConfigSections'
import { IDoubleYAxisConfig } from '../Workbench/ConfigSections/DoubleYAxisSection'
import { IViewModel } from 'containers/View/types'
import { IQueryVariableMap } from 'containers/Dashboard/types'
import { IControl } from 'app/components/Control/types'
import { RichTextNode } from 'app/components/RichText'
import { IReference } from '../Workbench/Reference/types'
import { ControlQueryMode } from 'app/components/Control/constants'
import { MyCreate } from 'containers/Dashboard/components/DashboardItem'
import { ECharts } from 'echarts'
const styles = require('../Pivot/Pivot.less')

export type DimetionType = 'row' | 'col'
export type RenderType =
  | 'rerender'
  | 'clear'
  | 'refresh'
  | 'resize'
  | 'loading'
  | 'select'
  | 'flush'
export type WidgetMode = 'pivot' | 'chart'
export type Coordinate = 'cartesian' | 'polar' | 'other'

export interface IWidgetDimension {
  name: string
  field: IFieldConfig
  format: IFieldFormatConfig
  sort: IFieldSortConfig
}

export interface IWidgetMetric {
  name: string
  agg: AggregatorType
  chart: IChartInfo
  field: IFieldConfig
  format: IFieldFormatConfig
  sort?: IFieldSortConfig
}

export interface IWidgetSecondaryMetric {
  name: string
  agg: AggregatorType
  field: IFieldConfig
  format: IFieldFormatConfig
  sort?: IFieldSortConfig
  from?: string
  type?: any
  visualType?: any
}

export interface IWidgetFilter {
  name: string
  type: DragType
  config: IDataParamConfig
}

export interface IChartStyles {
  pivot?: IPivotConfig
  xAxis?: IAxisConfig
  yAxis?: IAxisConfig
  axis?: IAxisConfig
  splitLine?: ISplitLineConfig
  label?: ILabelConfig
  legend?: ILegendConfig
  toolbox?: IToolboxConfig
  areaSelect?: IAreaSelectConfig
  spec?: ISpecConfig
  visualMap?: IVisualMapConfig
  scorecard?: IScorecardConfig
  gauge?: IGaugeConfig
  iframe?: IframeConfig
  table?: ITableConfig
  richText?: IRichTextConfig
  bar?: IBarConfig
  radar?: IRadarConfig
  doubleYAxis?: IDoubleYAxisConfig
  series?: any
}

export interface IChartRule {
  dimension: number | [number, number]
  metric: number | [number, number]
}

export interface IChartInfo {
  id: number
  name: string
  title: string
  icon: string
  coordinate: Coordinate
  rules: IChartRule[]
  dimetionAxis?: DimetionType
  data: object
  style: object
}

export interface IPaginationParams {
  pageNo: number
  pageSize: number
  totalCount: number
  withPaging: boolean
}

interface IWidgetConfigBase {
  data: object[]
  cols: IWidgetDimension[]
  rows: IWidgetDimension[]
  metrics: IWidgetMetric[]
  secondaryMetrics?: IWidgetSecondaryMetric[]
  filters: IWidgetFilter[]
  chartStyles: IChartStyles
  selectedChart: number
  color?: IDataParamProperty
  label?: IDataParamProperty
  size?: IDataParamProperty
  xAxis?: IDataParamProperty
  tip?: IDataParamProperty
  yAxis?: IDataParamProperty
  dimetionAxis?: DimetionType
  renderType?: RenderType
  orders: Array<{ column: string, direction: string }>
  mode: WidgetMode
  model: IViewModel
  pagination?: IPaginationParams
  editing?: boolean
  queryVariables?: IQueryVariableMap
  references?: IReference[]
  computed?: any[]
}

export interface IWidgetProps extends IWidgetConfigBase {
  interacting?: boolean
  onCheckTableInteract?: () => boolean
  onDoInteract?: (triggerData: object) => void
  getDataDrillDetail?: (position: string) => void
  onPaginationChange?: (pageNo: number, pageSize: number, order?: { column: string, direction: string }) => void
  onChartStylesChange?: (propPath: string[], value: string | RichTextNode[]) => void
  isDrilling?: boolean
  whichDataDrillBrushed?: boolean | object[]
  selectedItems?: number[]
  onSelectChartsItems?: (selectedItems: number[]) => void
  // onHideDrillPanel?: (swtich: boolean) => void
  onError?: (error: Error) => void
  [propName: string]: any
}

export interface IWidgetConfig extends IWidgetConfigBase {
  controls: IControl[]
  limit: number
  cache: boolean
  expired: number
  autoLoadData: boolean
  queryMode: ControlQueryMode
}

export interface IWidgetWrapperProps extends IWidgetProps {
  loading?: boolean | JSX.Element
  empty?: boolean | JSX.Element
  isDetail?: boolean
}

export interface IWidgetWrapperStates {
  width: number
  height: number
}

export class Widget extends React.Component<
  IWidgetWrapperProps,
  IWidgetWrapperStates
> {
  public static defaultProps = {
    editing: false
  }

  constructor (props) {
    super(props)
    this.state = {
      width: 0,
      height: 0
    }
  }

  private container = createRef<HTMLDivElement>()
  private remeasureRenderTypes = ['rerender', 'clear', 'refresh', 'resize', 'flush']

  public componentDidMount () {
    this.getContainerSize()
  }

  public componentWillReceiveProps (nextProps: IWidgetProps) {
    if (this.remeasureRenderTypes.includes(nextProps.renderType)) {
      this.getContainerSize()
    }
  }

  private getContainerSize = () => {
    const { offsetWidth, offsetHeight } = this.container.current as HTMLDivElement
    const { width, height } = this.state
    if (
      offsetWidth &&
      offsetHeight &&
      (offsetWidth !== width || offsetHeight !== height)
    ) {
      this.setState({
        width: offsetWidth,
        height: offsetHeight
      })
    }
  }

  public render () {
    const { loading, empty, isDetail, ...rest } = this.props
    const { width, height } = this.state

    const widgetProps = { width, height, ...rest }
    let widgetContent: JSX.Element
    if (width && height) {
      // FIXME
      widgetContent =
        widgetProps.mode === 'chart' ? (
          <Chart {...widgetProps} />
        ) : (
          <Pivot {...widgetProps} />
        )
    }

    return (
      <MyCreate.Consumer>
        {
          value => {
            value && value(this.container.current)
            return (
              <div className={styles.wrapper} ref={this.container} style={{display: isDetail && 'none' || 'block', overflow: 'auto'}}>
                {widgetContent}
                {loading}
                {empty}
              </div>
            )
          }
        }
      </MyCreate.Consumer>
    )
  }
}

export default Widget
