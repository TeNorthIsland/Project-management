// Project
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'
import { Avatar, Button, Card, Descriptions, Popconfirm, Result, Space, Input, Statistic } from 'antd'
import { history, Link, useRequest } from 'umi'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import { getTaskList, TaskCreat } from './service'
import config from '@/utils/config'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { typeProjectTableListItem } from './types'
import { PlusOutlined } from '@ant-design/icons'
import AddTask from './AddTask'
/** 
 * Preset 
 */
const Tablist = [
  {
    tab: '进行中（2）',
    key: '1',
  },
  {
    tab: '我创建的（0）',
    key: '2',
  },
  {
    tab: '已延期（24）',
    key: '3',
  },
  {
    tab: '未开始（15）',
    key: '4',
  },
  {
    tab: '全部（15）',
    key: '5',
  },
]
const { Search } = Input

const Task: React.FC<{}> = () => {
  /** 
   * state 
   */
  const actionRef = useRef();
  const [size, setSize] = useState<SizeType>('middle');
  const [sorter, setSorter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const [mProjectProps, setMProjectProps] = useState<any>({
    visible: false,
    objectModal: {}
  });


  /** 
  * method
  */
  const onTableChange = (p, f, s) => {
    setSorter(s.field || '');
    setSortOrder(s.order || '');
  };

  const loadData = async (params) => {
    const response = await getTaskList(params);
    return {
      success: response.success,
      ...response.data,
    };
  };




  /** 
   * effct 
   */



  /** 
   * componentsConfig 
   */

  // 顶部提示
  const content = (
    <Descriptions size="small" column={2}>
      <Descriptions.Item span={2} label="介绍">欢迎使用NID项目管理平台，开始创建一个任务吧！</Descriptions.Item>
    </Descriptions>
  );

  // 表格列
  const columns: ProColumns<typeProjectTableListItem>[] = [
    {
      title: '类型',
      dataIndex: 'task_descrpiton',
      ellipsis: true,
      width: 200,
    },
    {
      title: '名称',
      dataIndex: 'task_name',
      hideInSearch: true,
    },
    {
      title: '优先级',
      dataIndex: 'task_level',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'task_state',
      hideInSearch: true,
    },
    {
      title: '所属里程碑',
      dataIndex: 'task_mileage',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '计划开始时间',
      dataIndex: 'plan_start_time',
      width: 200,

    },
    {
      title: '计划结束时间',
      dataIndex: 'plan_end_time',
      width: 200,

    },
    {
      title: '实际开始时间',
      dataIndex: 'description',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '实际结束时间',
      dataIndex: 'projectState',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'id',
      fixed: 'right',
      width: 300,
      valueType: 'option',
      render: (_, record) => [
        <a href="#" key="edit">详情</a>,
        // <a href="#" key="ok">完成</a>,
        // <a href="#" key="stop">终止</a>,
        // <a href="#" key="ed">暂停</a>,
        // <a href="#" key="res">延期</a>,
        // <Popconfirm
        //   key="delete"
        //   title="您确定要删除该标注？"
        //   onConfirm={() => { }}
        //   onCancel={() => { }}
        //   okText="确定"
        //   cancelText="取消"
        // >
        //   <a href="#">删除</a>
        // </Popconfirm>,
      ],
    },
  ];

  // 新增项目按钮
  const NewProject: React.FC<any> = () => {
    return (<>
      <Button onClick={() => { setMProjectProps({ visible: true, objectModal: {} }) }} type="primary" size={size}>
        <PlusOutlined />
    新增
  </Button>
    </>
    )
  }

  // modal对话框属性
  const addProjectProps = {
    ...mProjectProps,
    loading: false,
    onCancel: () => {
      setMProjectProps({
        visible: false,
        objectModal: {}
      })
    },
    onSubmit: (values: typeProjectCategory) => {
      TaskCreat(values)
      console.log('values', values);
    },
  }
  /** 
   * render
   */
  return (
    <>
      <PageContainer
        fixedHeader
        content={content}
        tabList={Tablist}
        extraContent={
          <Space size={24}>
            <Avatar
              shape="square"
              size="large"
              style={{ width: 110, height: 110, marginRight: 75 }} src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />
          </Space>
        }
      >
        <Card>
          <ProTable
            headerTitle={<NewProject />}
            columns={columns}
            actionRef={actionRef}
            request={(params) => loadData(params)}
            params={{ sorter, sortOrder }}
            size={size}
            rowKey="_id"
            search={false}
            onSizeChange={(size: SizeType) => setSize(size)}
            onChange={(p, f, s) => onTableChange(p, f, s)}
            pagination={config.paginationDisplay}
            scroll={{ y: 450, x: 1920 }}
            toolBarRender={() => [
              <Search key="search" placeholder="按名称查询" />
            ]}
          />
        </Card>
        <AddTask {...addProjectProps} />
      </PageContainer>
      <Button type='primary' onClick={() => {
        history.push({
          pathname: '/project/detail',
          query: {
            id: '1',
          },
        });
      }}>点击我前往详情页面</Button>
    </>
  )
}

export default Task