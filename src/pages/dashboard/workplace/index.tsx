// 项目列表
// @ts-nocheck
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'

import { Tabs, Table, Input, Button, Popconfirm, Form } from 'antd';

const { TabPane } = Tabs;

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
  }

  return <td {...restProps}>{childNode}</td>;
};
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',

        editable: true,
      },
      {
        title: '编号',
        dataIndex: 'address',
      },
      {
        title: '项目类型',
        dataIndex: 'role',
      },
      {
        title: '计划开始时间',
        dataIndex: 'role',
      },
      {
        title: '计划结束时间',
        dataIndex: 'role',
      }, {
        title: '项目经理',
        dataIndex: 'role',
      }, {
        title: '描述',
        dataIndex: 'role',
      }, {
        title: '状态',
        dataIndex: 'role',
      }, {
        title: '项目进度',
        dataIndex: 'role',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <>
              <a>编辑   </a><a>完成   </a><a>终止  </a><a>暂停  </a><a>延期   </a>
              <Popconfirm title='确认删除吗？' onConfirm={() => this.handleDelete(record.key)}>

                <a>删除</a>

              </Popconfirm></>
          ) : null,
      },

    ];
    this.state = {
      dataSource: [
        {
          key: '0',
          name: '张jic',
          role: '32',
          address: 'London, Park Lane no. 0',
        },
        {
          key: '1',
          name: '老婆',
          role: '32',
          address: 'Lon',
        },
      ],
      count: 2,
    };
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          增加
      </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}
function callback(key) {
  console.log(key);
}

const Demo = () => (
  <Tabs size='large' defaultActiveKey="1" onChange={callback}>
    <TabPane tab="进行中（22）" key="1">
      <EditableTable />
    </TabPane>
    <TabPane tab="我创建（2）" key="2">
      <EditableTable />
    </TabPane>
    <TabPane tab="已延期（2）" key="3">
      <EditableTable />
    </TabPane>
    <TabPane tab="未开始（12）" key="4">
      <EditableTable />
    </TabPane>
    <TabPane tab="全部（3）" key="5">
      <EditableTable />
    </TabPane>
  </Tabs>
);
const Ana: React.FC<{}> = () => {

  return (
    <>
      <h1>项目列表</h1>
      <Demo />
    </>
  )
}

export default Ana