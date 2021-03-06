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

import React from 'react'
import { Card, Row } from 'antd'
import classnames from 'classnames'

import Item from './Item'
import { SettingParam } from './types'
const utilStyles = require('assets/less/util.less')
import styles from './Form.less'
interface ISettingItemGroupProps {
  param: SettingParam
}

const SettingItemGroup: React.FC<ISettingItemGroupProps> = (props) => {
  const { param } = props
  const { title, items, visible: cardVisible = true } = param
  return (
    // <Card size="small" title={title}  className={classnames({
    //   [utilStyles.hide]: !cardVisible
    // })}>
      
    // </Card>
    <div className={classnames({
        [utilStyles.hide]: !cardVisible,
        [styles.itemGroup]: true
      })}>
      <p className={styles.title}>{title}</p>
      {/* <Row> */}
        {items.map((item) => (
          <Item key={item.name} item={item} />
        ))}
      {/* </Row> */}
    </div>
  )
}

export default SettingItemGroup
