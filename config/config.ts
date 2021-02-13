// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',  // 路由模式
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      // redirect: '/user/login',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',  // 官方文档
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: 'smile',
              path: '/user/login',
              component: './user/login',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            //  首页
            {
              path: '/',
              redirect: '/dashboard',  // 首页就是分析页
            },
            {
              path: '/dashboard',
              name: '统计',
              icon: 'dashboard',
              component: './dashboard/Statistics'
            },

            // 项目管理
            {
              path: '/project',
              icon: 'form',
              name: '项目管理',
              Routes: ['src/pages/Authorized'],
              authority: ['View', 'Edit', 'Super'],
              routes: [
                {
                  path: '/',
                  redirect: '/project/list',
                },
                {
                  name: '项目列表',
                  icon: 'smile',
                  path: '/project/list',
                  component: './Project',
                },
                {
                  name: '项目成员管理',
                  icon: 'smile',
                  path: '/project/pro_roles',
                  component: './Project/Roles',
                },
                {
                  name: '项目类型管理',
                  icon: 'smile',
                  path: '/project/pro_category',
                  component: './Project/Category',
                },
                {
                  name: '项目详情',
                  icon: 'smile',
                  path: '/project/detail',
                  authority: [],
                  component: './Project/Detail',
                },
                {
                  component: '404',
                },
              ],
            },

            // 任务管理 
            {
              path: '/task',
              icon: 'table',
              name: '任务管理',
              Routes: ['src/pages/Authorized'],  // 注意这里的权限，这里的权限仅仅是用于展示，左边的菜单而已
              authority: ['View', 'Edit', 'Super'], // 这个权限回传入进去
              routes: [
                {
                  path: '/',
                  redirect: '/task/list',
                },
                {
                  name: '任务列表',
                  icon: 'smile',
                  path: '/task/list',
                  component: './Task',
                },
                {
                  name: '任务详情',
                  icon: 'smile',
                  path: '/task/detail',
                  authority: [],   // 这个权限回传入进去
                  component: './Task/Detail',
                },
                {
                  component: '404',
                },
              ],
            },

            // 系统管理
            {
              path: '/system',
              icon: 'table',
              name: '系统设置',
              Routes: ['src/pages/Authorized'],  // 注意这里的权限，这里的权限仅仅是用于展示，左边的菜单而已
              authority: ['View', 'Edit', 'Super'], // 这个权限回传入进去
              routes: [
                {
                  path: '/',
                  redirect: '/system',
                },
                {
                  name: '成员管理',
                  icon: 'smile',
                  path: '/system/personnel',
                  component: './System',
                },
                {
                  name: '角色管理',
                  icon: 'smile',
                  path: '/system/roles',
                  component: './System/Roles',
                },
                {
                  component: '404',
                },
              ],
            },
            {
              component: '404',
            },
          ],
        },
        //  测试问题
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,  // 主题
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],  // 网关代理
  manifest: {
    basePath: '/',
  },
  exportStatic: {},
  esbuild: {},
});