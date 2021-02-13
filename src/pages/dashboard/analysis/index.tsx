// Analyasis
// @ts-nocheck
import React, { useState, useRef, useEffect, useContext } from 'react'
// import { test } from './service'
import { Table, Input, Button, Popconfirm, Form } from 'antd';
/** 
 * Preset 
 */


const Analyasis: React.FC<{}> = () => {

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
          title: '姓名',
          dataIndex: 'name',
          width: '30%',
          editable: true,
        },
        {
          title: '邮箱',
          dataIndex: 'address',
        },
        {
          title: '角色',
          dataIndex: 'role',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render: (text, record) =>
            this.state.dataSource.length >= 1 ? (
              <><a>编辑   </a>
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

  /** 
   * render
   */
  return (
    <>
      <EditableTable />
    </>
  )
}

export default Analyasis