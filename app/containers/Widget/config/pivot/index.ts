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

import pivot from './pivot'
import line from './line'
import bar from './bar'
import pie from './pie'
import scatter from './scatter'
import { IChartInfo } from 'containers/Widget/components/Widget'

const widgetlibs: IChartInfo[] = [
  scatter,
  pivot,
  line,
  bar,
  pie
]

export default widgetlibs
