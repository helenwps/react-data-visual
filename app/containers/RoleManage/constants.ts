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

import { createTypes } from 'utils/redux'

enum Types {
  LOAD_ORGANIZATIONS = 'davinci/Organization/LOAD_ORGANIZATIONS',
  LOAD_ORGANIZATIONS_SUCCESS = 'davinci/Organization/LOAD_ORGANIZATIONS_SUCCESS',
  LOAD_ORGANIZATIONS_FAILURE = 'davinci/Organization/LOAD_ORGANIZATIONS_FAILURE',
  ADD_ORGANIZATION = 'davinci/Organization/ADD_ORGANIZATION',
  ADD_ORGANIZATION_SUCCESS = 'davinci/Organization/ADD_ORGANIZATION_SUCCESS',
  ADD_ORGANIZATION_FAILURE = 'davinci/Organization/ADD_ORGANIZATION_FAILURE',

  EDIT_ORGANIZATION = 'davinci/Organization/EDIT_ORGANIZATION',
  EDIT_ORGANIZATION_SUCCESS = 'davinci/Organization/EDIT_ORGANIZATION_SUCCESS',
  EDIT_ORGANIZATION_FAILURE = 'davinci/Organization/EDIT_ORGANIZATION_FAILURE',

  DELETE_ORGANIZATION = 'davinci/Organization/DELETE_ORGANIZATION',
  DELETE_ORGANIZATION_SUCCESS = 'davinci/Organization/DELETE_ORGANIZATION_SUCCESS',
  DELETE_ORGANIZATION_FAILURE = 'davinci/Organization/DELETE_ORGANIZATION_FAILURE',

  LOAD_ORGANIZATION_DETAIL = 'davinci/Organization/LOAD_ORGANIZATION_DETAIL',
  LOAD_ORGANIZATION_DETAIL_SUCCESS = 'davinci/Organization/LOAD_ORGANIZATION_DETAIL_SUCCESS',
  LOAD_ORGANIZATION_DETAIL_FAILURE = 'davinci/Organization/LOAD_ORGANIZATION_DETAIL_FAILURE',

  LOAD_ORGANIZATIONS_PROJECTS = 'davinci/Organization/LOAD_ORGANIZATIONS_PROJECTS',
  LOAD_ORGANIZATIONS_PROJECTS_SUCCESS = 'davinci/Organization/LOAD_ORGANIZATIONS_PROJECTS_SUCCESS',
  LOAD_ORGANIZATIONS_PROJECTS_FAILURE = 'davinci/Organization/LOAD_ORGANIZATIONS_PROJECTS_FAILURE',

  LOAD_ORGANIZATIONS_MEMBERS = 'davinci/Organization/LOAD_ORGANIZATIONS_MEMBERS',
  LOAD_ORGANIZATIONS_MEMBERS_SUCCESS = 'davinci/Organization/LOAD_ORGANIZATIONS_MEMBERS_SUCCESS',
  LOAD_ORGANIZATIONS_MEMBERS_FAILURE = 'davinci/Organization/LOAD_ORGANIZATIONS_MEMBERS_FAILURE',

  LOAD_ORGANIZATIONS_TEAMS = 'davinci/Organization/LOAD_ORGANIZATIONS_TEAMS',
  LOAD_ORGANIZATIONS_TEAMS_SUCCESS = 'davinci/Organization/LOAD_ORGANIZATIONS_TEAMS_SUCCESS',
  LOAD_ORGANIZATIONS_TEAMS_FAILURE = 'davinci/Organization/LOAD_ORGANIZATIONS_TEAMS_FAILURE',

  ADD_TEAM = 'davinci/Organization/ADD_TEAM',
  ADD_TEAM_SUCCESS = 'davinci/Organization/ADD_TEAM_SUCCESS',
  ADD_TEAM_FAILURE = 'davinci/Organization/ADD_TEAM_FAILURE',

  SEARCH_MEMBER = 'davinci/Organization/SEARCH_MEMBER',
  SEARCH_MEMBER_SUCCESS = 'davinci/Organization/SEARCH_MEMBER_SUCCESS',
  SEARCH_MEMBER_FAILURE = 'davinci/Organization/SEARCH_MEMBER_FAILURE',

  INVITE_MEMBER = 'davinci/Organization/INVITE_MEMBER',
  INVITE_MEMBER_SUCCESS = 'davinci/Organization/INVITE_MEMBER_SUCCESS',
  INVITE_MEMBER_FAILURE = 'davinci/Organization/INVITE_MEMBER_FAILURE',

  DELETE_ORGANIZATION_MEMBER = 'davinci/Organization/DELETE_ORGANIZATION_MEMBER',
  DELETE_ORGANIZATION_MEMBER_SUCCESS = 'davinci/Organization/DELETE_ORGANIZATION_MEMBER_SUCCESS',
  DELETE_ORGANIZATION_MEMBER_ERROR = 'davinci/Organization/DELETE_ORGANIZATION_MEMBER_ERROR',

  CHANGE_MEMBER_ROLE_ORGANIZATION = 'davinci/Organization/CHANGE_MEMBER_ROLE_ORGANIZATION',
  CHANGE_MEMBER_ROLE_ORGANIZATION_SUCCESS = 'davinci/Organization/CHANGE_MEMBER_ROLE_ORGANIZATION_SUCCESS',
  CHANGE_MEMBER_ROLE_ORGANIZATION_ERROR = 'davinci/Organization/CHANGE_MEMBER_ROLE_ORGANIZATION_ERROR',


  LOAD_ORGANIZATIONS_ROLE = 'davinci/Organization/LOAD_ORGANIZATIONS_ROLE',
  LOAD_ORGANIZATIONS_ROLE_SUCCESS = 'davinci/Organization/LOAD_ORGANIZATIONS_ROLE_SUCCESS',
  LOAD_ORGANIZATIONS_ROLE_FAILURE = 'davinci/Organization/LOAD_ORGANIZATIONS_ROLE_FAILURE',

  ADD_ROLE = 'davinci/Organization/ADD_ROLE',
  ADD_ROLE_SUCCESS = 'davinci/Organization/ADD_ROLE_SUCCESS',
  ADD_ROLE_FAILURE = 'davinci/Organization/ADD_ROLE_FAILURE',

  DELETE_ROLE = 'davinci/Organization/DELETE_ROLE',
  DELETE_ROLE_SUCCESS = 'davinci/Organization/DELETE_ROLE_SUCCESS',
  DELETE_ROLE_FAILURE = 'davinci/Organization/DELETE_ROLE_FAILURE',

  EDIT_ROLE = 'davinci/Organization/EDIT_ROLE',
  EDIT_ROLE_SUCCESS = 'davinci/Organization/DEIT_ROLE_SUCCESS',
  EDIT_ROLE_FAILURE = 'davinci/Organization/EDIT_ROLE_FAILURE',

  REL_ROLE_MEMBER = 'davinci/Organization/DELETE_ROLE/REL_ROLE_MEMBER',
  REL_ROLE_MEMBER_SUCCESS = 'davinci/Organization/DELETE_ROLE/REL_ROLE_MEMBER_SUCCESS',
  REL_ROLE_MEMBER_FAILURE = 'davinci/Organization/DELETE_ROLE/REL_ROLE_MEMBER_FAILURE',

  GET_REL_ROLE_MEMBER = 'davinci/Organization/DELETE_ROLE/GET_REL_ROLE_MEMBER',
  GET_REL_ROLE_MEMBER_SUCCESS = 'davinci/Organization/DELETE_ROLE/GET_REL_ROLE_MEMBER_SUCCESS',
  GET_REL_ROLE_MEMBER_FAILURE = 'davinci/Organization/DELETE_ROLE/GET_REL_ROLE_MEMBER_FAILURE',

  SET_CURRENT_ORIGANIZATION_PROJECT = 'davinci/Organization//GET_REL_ROLE_MEMBER',

  LOAD_PROJECT_ADMINS = 'davinci/Organization//LOAD_PROJECT_ADMINS',
  LOAD_PROJECT_ADMINS_SUCCESS = 'davinci/Organization//LOAD_PROJECT_ADMINS_SUCCESS',
  LOAD_PROJECT_ADMINS_FAIL = 'davinci/Organization//LOAD_PROJECT_ADMINS_FAIL',

  LOAD_PROJECT_ROLES = 'davinci/Project/LOAD_PROJECT_ROLES',
  LOAD_PROJECT_ROLES_SUCCESS = 'davinci/Project/LOAD_PROJECT_ROLES_SUCCESS',
  LOAD_PROJECT_ROLES_FAIL = 'davinci/Project/LOAD_PROJECT_ROLES_FAIL',

  GET_VIZ_VISBILITY = 'davinci/Project/GET_VIZ_VISBILITY',
  POST_VIZ_VISBILITY = 'davinci/Project/POST_VIZ_VISBILITY',

  GET_ROLELISTS_BY_MEMBERID = 'davinci/Project/GET_ROLELISTS_BY_MEMBERID',
  GET_ROLELISTS_BY_MEMBERID_SUCCESS = 'davinci/Project/GET_ROLELISTS_BY_MEMBERID_SUCCESS',
  GET_ROLELISTS_BY_MEMBERID_ERROR = 'davinci/Project/GET_ROLELISTS_BY_MEMBERID_ERROR'

}

export const ActionTypes = createTypes(Types)
