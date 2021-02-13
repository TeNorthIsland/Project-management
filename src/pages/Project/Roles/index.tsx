// ProjectGroup
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { useRequest } from 'ahooks';
import { Card, Tree, Input, Space, Popconfirm, Popover, Tag, Tooltip, Button, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { delCatalog, delTag, editeProjectGroup, editProjectGroupRole, getAll, saveCatalog, saveTag, tagPage } from '../service';
import SplitPane from 'react-split-pane';
import CatalogModal from '../Components/CatalogModal';
import TagModal from '../Components/TagModal';
import style from './index.less';
import config from '@/utils/config';
import { PauseOutlined, PlusCircleOutlined } from '@ant-design/icons';
/**
 * Preset
 */

const { TreeNode } = Tree;
const { Search } = Input;

const ProjectGroup: React.FC<{}> = () => {
  /**
   * state
   */
  //定义数据存放位置
  const [current, setCurrent] = useState(1);
  const [catalog, setCatalog] = useState([]);
  // 项目组弹窗控制变量
  const [catalogVisible, setCatalogVisible] = useState(false);
  const [selectCatalog, setSelectCatalog] = useState({});
  // 项目内成员弹窗控制变量
  const [visible, setVisible] = useState(false);
  const [selectKey, setSelectKey] = useState(null);
  const [tag, setTag] = useState({});
  //表格控制相关代码
  const [size, setSize] = useState('middle');
  const actionRef = useRef<ActionType>();
  const [sorter, setSorter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [search, setSearch] = useState('');
  const onTableChange = (p, f, s) => {
    setSorter(s.field || '');
    setSortOrder(s.order || '');
    setCurrent(p.current);
  };

  /**
   * method
   */


  //  save ProjectGroup Roles
  const { run: runSaveTag } = useRequest(saveTag, {
    manual: true,
    onSuccess: (result, params) => {
      actionRef.current?.reload();
      setVisible(false);
      setTag(undefined);
      message.success('操作成功');
    },
  });

  // editProjectRoles
  const { run: editProjectRoles, } = useRequest(editProjectGroupRole, {
    manual: true,
    onSuccess: (result, params) => {
      actionRef.current?.reload();
      setVisible(false);
      setTag(undefined);
      message.success('操作成功');
    },
  });

  // delete ProjectGroup Roles
  const { run: runDelTag } = useRequest(delTag, {
    manual: true,
    onSuccess: (result, params) => {
      actionRef.current?.reload();
      setVisible(false);
      setTag(undefined);
      message.success('操作成功');
    },
  });

  // save ProjectGroup tree
  const { loading: loading1, run: saveCatalogRun } = useRequest(saveCatalog, {
    manual: true,
    onSuccess: (result) => {
      message.success('操作成功');
      getAllRun();
      setCatalogVisible(false);
      setSelectCatalog({});
    },
  });

  const { loading: loading2, run: delCatalogRun } = useRequest(delCatalog, {
    manual: true,
    onSuccess: (result) => {
      message.success('操作成功');
      actionRef.current?.reload();
      getAllRun();
      setSelectKey(null);
    },
  });

  //get proejctGruop tree 
  const { loading, run: getAllRun } = useRequest(getAll, {
    manual: true,
    onSuccess: (result, params) => {
      setCatalog(result);
    },
  });

  //eidte projectGroup tree 
  const { loading: ETreelaoding, run: useEditeProjectGroup } = useRequest(editeProjectGroup, {
    manual: true,
    onSuccess: (result, params) => {
      setCatalog(result.data);
      message.success('操作成功');
      getAllRun();
      setCatalogVisible(false);
      setSelectCatalog({});
    },
  });

  // edite projectGrop tree method
  const editCatalog = (data) => {
    setCatalogVisible(true);
    setSelectCatalog(data);
  };

  // projectGrop props
  const catalogModalProps = {
    visible: catalogVisible,
    loading,
    catalog: selectCatalog,
    onCancel: () => {
      setCatalogVisible(false);
      setSelectCatalog(undefined);
    },
    onSubmit: (values) => {
      if (values._id) {
        useEditeProjectGroup(values)
      } else {
        saveCatalogRun(values);
      }
    },
  };

  // delete ProjectGroup tree item
  const deleteCatalog = (id) => {
    delCatalogRun([id]);
    setCurrent(1);
  };

  // 项目组内成员props
  const tagModalProps = {
    visible,
    tag: {
      ...tag,
      originGroupId: selectKey !== null && selectKey !== -1 ? selectKey : tag?.originGroupId,
    },
    onCancel: () => {
      setVisible(false);
      setTag(undefined);
    },
    onSubmit: (values) => {
      if (values?._id) {
        editProjectRoles(values);
      } else {
        runSaveTag(values);
      }
    },
  };

  // edit ProjectGroup Roles method
  const editTag = (tag) => {
    setVisible(true);
    setTag(tag);
  };

  // delete ProjectGroup Roles method
  const del = (id) => {
    runDelTag([id]);
  };

  // tree actions
  const actions = (currentData) => (
    <Space style={{ margin: 0, padding: 0 }}>
      {!currentData && (
        <PlusCircleOutlined
          style={{ margin: 0, padding: 0 }}
          type="icon-icon_add"
          onClick={(e) => {
            e?.stopPropagation;
            setCatalogVisible(true);
          }}
        />
      )}
      {currentData && (
        <PauseOutlined
          style={{ margin: 0, padding: 0 }}
          type="icon-edit"
          onClick={(e) => {
            e?.stopPropagation;
            editCatalog(currentData);
          }}
        />
      )}
      {currentData && (
        <Popconfirm
          title={
            <>
              此操作将会同步项目组下的人员，
              <br />
              您确定要删除 <Tag color="red">{currentData.name}</Tag>吗？
            </>
          }
          onConfirm={(e) => {
            e?.stopPropagation;
            if (catalogVisible) {
              message.error('禁止操作！请先完成编辑');
              return;
            }
            deleteCatalog(currentData._id);
          }}
        >
          <PlusCircleOutlined
            onClick={(e) => {
              e?.stopPropagation;
            }}
            type="icon-icon_delete"
          />
        </Popconfirm>
      )}
    </Space>
  );

  // render ProjectGroup Tree
  const renderTreeNodes = (data) => {
    return data?.map((item) => {
      const title = <span title={item.name}>{item.name}</span>;
      const wrapperTitle = (
        <Popover placement="right" content={actions(item)}>
          {title}
        </Popover>
      );
      const props = { title: wrapperTitle, key: item._id, isLeaf: true };
      return <TreeNode {...props} />;
    });
  };

  // load ProjectGroup Roles
  const loadData = async (params) => {
    setCurrent(params.current);
    const response = await tagPage(params);
    return {
      success: response.success,
      ...response.data,
    };
  };

  /**
   * effct
   */

  //初始化时加载数据
  useEffect(() => {
    getAllRun();
  }, [0]);

  /**
   * componentsConfig
   */

  const columns = [
    {
      title: '姓名',
      width: 150,
      dataIndex: 'name',
      sorter: false,
      ellipsis: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 150,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 60,
      fixed: 'right',
      render: (text, row, _, action) => {
        const arr = [];
        arr.push(
          <>
            <a onClick={() => editTag(row)} target="_blank" rel="noopener noreferrer">
              编辑
            </a>
          </>,
        );
        arr.push(
          <>
            <a target="_blank" rel="noopener noreferrer">
              <Popconfirm
                title="您确认要删除该成员么?"
                onConfirm={() => del(row._id)}
                okText="是"
                cancelText="否"
              >
                删除
              </Popconfirm>
            </a>
          </>,
        );
        return arr;
      },
    },
  ];
  const header = (
    <Space>
      <Button
        type="primary"
        size={size}
        onClick={() => {
          selectKey !== null && selectKey !== -1 ? setVisible(true) : message.error('请先选择项目组');
        }}
      >
        <PlusCircleOutlined type="icon-icon_add" />
        新增
      </Button>
    </Space>
  );
  const handleSearch = (value) => {
    setSearch(value);
    setCurrent(1);
  };

  /**
   * render
   */
  return (
    <>
      <PageHeaderWrapper>
        <Card>
          <SplitPane
            split="vertical"
            minSize={300}
            maxSize={500}
            style={{ position: 'relative', overflow: 'visible' }}
          >
            <div>
              <Card className={style.treeBorder} loading={loading} title="项目组" size="small">
                <Tree
                  showIcon
                  showLine
                  defaultExpandAll
                  blockNode
                  selectable
                  onSelect={(selectedKeys) => {
                    setCurrent(1);
                    console.log('selectedKeys', selectedKeys);

                    selectedKeys && setSelectKey(selectedKeys[0] || null);
                  }}
                  className={style.hover}
                >
                  <TreeNode
                    title={
                      <Popover
                        placement="right"
                        overlayClassName="ui-actionButtonsOnTree"
                        content={actions(undefined)}
                      >
                        所有客户
                      </Popover>
                    }
                    key={-1}
                    selectable={false}
                    isLeaf={false}
                  >
                    {renderTreeNodes(catalog)}
                  </TreeNode>
                </Tree>
              </Card>
            </div>
            <div className="ui-dragPane">
              <Card title="项目组内角色" className={style.treeBorder} size="small">
                <ProTable
                  className="use-proTable"
                  columns={columns}
                  actionRef={actionRef}
                  request={(params) => loadData(params)}
                  params={{ sorter, sortOrder, originGroupId: selectKey, name: search }}
                  size={size}
                  rowKey="id"
                  headerTitle={header}
                  search={false}
                  onSizeChange={(size) => setSize(size)}
                  onChange={(p, f, s) => onTableChange(p, f, s)}
                  pagination={{ ...config.paginationDisplay, current: current }}
                  scroll={{ x: 700, y: 400 }}
                  toolBarRender={() => [
                    <Search placeholder="按人员名称搜索" size={size} onSearch={handleSearch} />,
                  ]}
                />
              </Card>
            </div>
          </SplitPane>

          <CatalogModal {...catalogModalProps} />
          <TagModal {...tagModalProps} />
        </Card>
      </PageHeaderWrapper>
    </>
  );
};

export default ProjectGroup;
