import http from '@/utils/request'
import qs from 'querystring'
import { typeProjectCategory } from '../../System/types'

const getTaskList = async (parmas: any) => {
  return http.get(`/api/task-m/getTaskList?${qs.stringify(parmas)}`)
}
const TaskCreat = async (parmas: any) => {
  return http.post('/api/task-m/createTask', { data: parmas })
}


// 获取人员列表
const getUserList = () => {
  return http.get('/api/auth/useList');
};


const getProjectCategoryMapList = async (parmas: any) => {
  return http.get(`/api/proJectM/getProjectList?${qs.stringify(parmas)}`);
};
const getProjectMieageList = async (parmas: any) => {
  return http.get(`/api/proJectM/getProjectMieageList`);
};
// 任务类型查询
const getTaskCategoryList = async (parmas: any) => {
  return http.get(`/api/task-m/getTaskCategroyList`);
};
export {
  getTaskList, TaskCreat, getUserList, getProjectCategoryMapList, getTaskCategoryList,
  getProjectMieageList
}