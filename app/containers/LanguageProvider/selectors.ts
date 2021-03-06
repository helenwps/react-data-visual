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

//https://github.com/reduxjs/reselect
//组合函数 把createSelector前几个函数的计算值传到下一个函数
//缓存 类似于vue的计算属性  在connect获取状态处用到的
import { createSelector } from 'reselect'

/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguage = (state) => state.language

/**
 * Select the language locale
 */

const makeSelectLocale = () => createSelector(
  selectLanguage,
  (languageState) => languageState.locale
)

export {
  selectLanguage,
  makeSelectLocale
}
