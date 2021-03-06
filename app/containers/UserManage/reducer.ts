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

import produce from 'immer'
import {
  // GET_USERS,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_FAIL,

  GET_DEPARTMENT_USERS_SUCCESS,
  GET_ROLES_SUCCESS
} from './constants'


export const initialState = {
  departments: [],
  loading: false, //表格加载的loading
  departmentUsers: [],
  roles:[]
}

const profileReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      // case GET_USERS:
      //   draft.loading = true
      //   break

      case GET_DEPARTMENTS_SUCCESS:
        draft.loading = false
        draft.departments = [{ id: 0, name: "根组织", parentId: -1 }, ...action.payload.result]
        draft.departments = [...action.payload.result]
        break
      case GET_DEPARTMENTS_FAIL:
        draft.loading = false
        break

      case GET_DEPARTMENT_USERS_SUCCESS:
        draft.departmentUsers = action.payload.result
        break
      case GET_ROLES_SUCCESS:
        draft.roles = action.payload.result
        break

        
    }
  })

export default profileReducer
