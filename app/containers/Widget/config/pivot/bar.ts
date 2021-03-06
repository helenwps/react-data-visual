import PivotTypes from './PivotTypes'
import {
  PIVOT_DEFAULT_AXIS_LINE_COLOR,
  PIVOT_CHART_FONT_FAMILIES,
  PIVOT_DEFAULT_FONT_COLOR,
  PIVOT_DEFAULT_HEADER_BACKGROUND_COLOR
} from 'app/globalConstants'

import { IChartInfo } from 'containers/Widget/components/Widget'

const bar: IChartInfo = {
  id: PivotTypes.Bar,
  name: 'bar',
  title: '柱状图',
  icon: 'iconzhuzhuangtu',
  coordinate: 'cartesian',
  rules: [{ dimension: [0, 9999], metric: [1, 9999] }],
  dimetionAxis: 'col',
  data: {
    cols: {
      title: 'x数据轴',
      type: 'category'
    },
    rows: {
      title: 'y数据轴',
      type: 'category'
    },
    metrics: {
      title: '指标',
      type: 'value'
    },
    filters: {
      title: '筛选',
      type: 'all'
    },
    color: {
      title: '颜色',
      type: 'category'
    },
    label: {
      title: '标签',
      type: 'all'
    },
    tip: {
      title: '提示信息',
      type: 'value'
    },
    sampling: {
      title: '数据采样方式',
      value: {v: ''}
    },
    stride: {
      title: '采样步长',
      value: {v: ''}

    },
    calculation: {
      title : '采样计算方式',
      value: {v: ''}

    },
    frequency: {
      title: '刷新频率',
      value: {v: ''}
    },
    isConfig: {
      title: '是否开启配置',
      value: {v: ''}
    }
  },
  style: {
    xAxis: {
      showLine: true,
      lineStyle: 'solid',
      lineSize: '1',
      lineColor: PIVOT_DEFAULT_AXIS_LINE_COLOR,
      showLabel: true,
      labelFontFamily: PIVOT_CHART_FONT_FAMILIES[0].value,
      labelFontSize: '12',
      labelColor: PIVOT_DEFAULT_FONT_COLOR
    },
    yAxis: {
      showLine: true,
      lineStyle: 'solid',
      lineSize: '1',
      lineColor: PIVOT_DEFAULT_AXIS_LINE_COLOR,
      showLabel: true,
      labelFontFamily: PIVOT_CHART_FONT_FAMILIES[0].value,
      labelFontSize: '12',
      labelColor: PIVOT_DEFAULT_FONT_COLOR,
      showTitleAndUnit: true,
      titleFontFamily: PIVOT_CHART_FONT_FAMILIES[0].value,
      titleFontSize: '12',
      titleColor: PIVOT_DEFAULT_FONT_COLOR
    },
    splitLine: {
      showHorizontalLine: true,
      horizontalLineStyle: 'dashed',
      horizontalLineSize: '1',
      horizontalLineColor: PIVOT_DEFAULT_AXIS_LINE_COLOR,
      showVerticalLine: false,
      verticalLineStyle: 'dashed',
      verticalLineSize: '1',
      verticalLineColor: PIVOT_DEFAULT_AXIS_LINE_COLOR
    },
    // pivot: {
    //   fontFamily: PIVOT_CHART_FONT_FAMILIES[0].value,
    //   fontSize: '12',
    //   color: PIVOT_DEFAULT_FONT_COLOR,
    //   lineStyle: 'solid',
    //   lineColor: PIVOT_DEFAULT_AXIS_LINE_COLOR,
    //   headerBackgroundColor: PIVOT_DEFAULT_HEADER_BACKGROUND_COLOR
    // }
  }
}

export default bar
