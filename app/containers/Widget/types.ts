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

import { IWidgetConfig } from './components/Widget'

export interface IWidgetBase {
  id: number
  name: string
  description: string
  publish: boolean
  type: number
  viewId: number
  projectId: number
  createTime: any
  updateTime: any
}

export interface IWidgetRaw extends IWidgetBase {
  config: string
}

export interface IWidgetFormed extends IWidgetBase {
  config: IWidgetConfig
  dataToken?: string
}

export interface IWidgetState {
  widgets: any
  currentWidget: IWidgetFormed
  loading: boolean
  dataLoading: boolean
  widgetsList: any
}
