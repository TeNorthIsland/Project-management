// AddProject 
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'
import config from '@/utils/config';
import { Alert, Form, Input, Modal, Select, DatePicker, Upload, message, Button, Cascader } from 'antd';

import { UploadOutlined } from '@ant-design/icons';

import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { getProjectCategoryMapList, getUserList, getProjectMieageList, getTaskCategoryList } from './service';

const { RangePicker } = DatePicker;
/** 
 * Preset 
 */

const AddTask: React.FC<any> = (Props) => {
  const { objectModal = {}, visible, onCancel, onSubmit, loading } = Props
  /** 
   * state 
   */
  const [form] = Form.useForm();
  const [initValueData, setInitValue] = useState({
    UserList: [],
    ProjectList: [],
    loading: true,
    MieageList: [],
    taskType: [],
    options: []
  });

  /** 
   * method
   */
  const onOk = () => {

    form
      .validateFields()
      .then((values) => {
        const data = { ...values }
        if (objectModal.id) {
          data.id = objectModal.id
        }
        onSubmit({ ...data });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const close = () => {
    clear();
    onCancel();
  };

  const clear = () => {
    form.resetFields();
  };

  /** 
   * effct 
   */

  const initValue = async () => {
    // 获取项目分类列表,获取人员项目
    let UserList = await getUserList();
    let ProjectCategoryMapList = await getProjectCategoryMapList();
    let ProjectMieageList = await getProjectMieageList();
    let TaskCategoryList = await getTaskCategoryList()
    console.log(TaskCategoryList[0].childrenList[1], TaskCategoryList[0].childrenList[0].title)
    setInitValue({
      UserList: UserList,
      ProjectList: ProjectCategoryMapList.data.data,
      MieageList: ProjectMieageList.data.data,
      loading: false,
      taskType: TaskCategoryList,
      options: [
        {
          value: TaskCategoryList[0].description,
          label: TaskCategoryList[0].description,
          children: [
            {
              value: TaskCategoryList[0].childrenList[0].description,
              label: TaskCategoryList[0].childrenList[0].description,
            },
            {
              value: TaskCategoryList[0].childrenList[1].description,
              label: TaskCategoryList[0].childrenList[1].description,
            },
          ],
        },
        {
          value: TaskCategoryList[1].description,
          label: TaskCategoryList[1].description,
          children: [
            {
              value: TaskCategoryList[1].childrenList[0] ? TaskCategoryList[1].childrenList[0].description : '无',
              label: TaskCategoryList[1].childrenList[0] ? TaskCategoryList[1].childrenList[0].description : '无',
            },
            // {
            //   value: TaskCategoryList[1].childrenList[1].description,
            //   label: TaskCategoryList[1].childrenList[1].description,
            // },
          ],
        },
      ]

    });
  };



  useEffect(() => {

    if (visible) {
      initValue();

      form.setFieldsValue({
        ...objectModal,
        times: [
          objectModal.plan_start_time ? moment(objectModal.plan_start_time) : undefined,
          objectModal.plan_end_time ? moment(objectModal.plan_end_time) : undefined,
        ],
      });
    }
  }, [visible]);
  /** 
   * componentsConfig 
   */

  //  禁选时间
  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  const UploadProps = {
    name: 'file_id',
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    // headers: {
    //   authorization: 'authorization-text',
    // },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  /** 
   * render
   */
  return (
    <>
      <Modal
        visible={visible}
        title={'新增任务'}
        onCancel={() => close()}
        confirmLoading={loading}
        afterClose={() => clear()}
        width={700}
        okText="提交"
        cancelText="取消"
        onOk={() => onOk()}
      >
        <Form form={form} layout="horizontal" name="networkForm">

          <Alert
            message="欢迎您使用本系统，新建一个任务吧！"
            type="info"
            showIcon
            style={{ marginBottom: 10 }}
          />

          <Form.Item {...config.modalFormItemLayout} noStyle name="plan_start_time">
            <Input hidden />
          </Form.Item>

          <Form.Item {...config.modalFormItemLayout} noStyle name="plan_end_time">
            <Input hidden />
          </Form.Item>
          <Form.Item {...config.modalFormItemLayout} noStyle name="file_id">
            <Input hidden />
          </Form.Item>
          <Form.Item {...config.modalFormItemLayout} noStyle name="task_type">
            <Input hidden />
          </Form.Item>

          <Form.Item
            {...config.modalFormItemLayout}
            noStyle
            name="id"
          >
            <Input hidden />
          </Form.Item>

          <Form.Item
            {...config.modalFormItemLayout}
            label="任务名称"
            name="task_name"
            rules={[
              {
                required: true,
                message: '请输入任务名称',
              },
            ]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>


          <Form.Item
            {...config.modalFormItemLayout}
            label="优先级"
            name="task_level"
            rules={[
              {
                required: true,
                message: '请选择优先级',
              },
            ]}
          >
            <Select placeholder="请选择优先级">
              <Select.Option value="A">高</Select.Option>
              <Select.Option value="B">中</Select.Option>
              <Select.Option value="C">低</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            {...config.modalFormItemLayout}
            label="所属项目"
            name="task_of_project"
            rules={[
              {

                message: '请选择所属项目',
              },
            ]}
          >
            <Select placeholder="请选择所属项目">
              {initValueData.ProjectList?.map((v) => {
                return (
                  <Select.Option value={v._id} key={v._id}>
                    {v.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            {...config.modalFormItemLayout}
            label="所属里程碑"
            name="task_mileage"
            rules={[
              {

                message: '请选择所属里程碑',
              },
            ]}
          >
            <Select placeholder="请选择所属里程碑">
              {initValueData.MieageList?.map((v) => {
                return (
                  <Select.Option value={v._id} key={v._id}>
                    {v.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            {...config.modalFormItemLayout}
            label="任务类型"
            name="task_type"
            rules={[
              {

                message: '请选择任务类型',
              },
            ]}
          >

            <Cascader

              options={initValueData.options}

            />

          </Form.Item>


          <Form.Item
            {...config.modalFormItemLayout}
            label="描述"
            name="task_descrpiton"
            rules={[
              {
                required: true,
                message: '描述',
              },
            ]}
          >
            <TextArea placeholder='描述' />
          </Form.Item>

          <Form.Item
            {...config.modalFormItemLayout}
            label="计划起始时间"

            rules={[
              {
                required: true,
                message: '请选择计划起始时间',
              },
            ]}
          >
            <RangePicker
              onChange={(res) => {
                console.log('res', res);
                form.setFieldsValue({
                  plan_start_time: moment(res[0]).format('x'),
                  plan_end_time: moment(res[1]).format('x'),
                });
              }}
              disabledDate={disabledDate}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item
            {...config.modalFormItemLayout}
            label="预计工时"
            name="task_budget_time"
            rules={[
              {
                required: true,
                message: '请选择预计工时',
              },
            ]}
          >
            <Input type='number' placeholder='工时预计' />
          </Form.Item>
          <Form.Item
            {...config.modalFormItemLayout}
            label="负责人"
            name="task_responsible"
            rules={[
              {

                message: '请选择负责人',
              },
            ]}
          >
            <Select placeholder="请选择负责人">
              {initValueData.UserList?.map((v) => {
                return (
                  <Select.Option value={v._id} key={v._id}>
                    {v.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            {...config.modalFormItemLayout}
            label="协助人"
            name="task_helper"
            rules={[
              {

                message: '请选择协助人',
              },
            ]}
          >
            <Select placeholder="请选择协助人">
              {initValueData.UserList?.map((v) => {
                return (
                  <Select.Option value={v._id} key={v._id}>
                    {v.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            {...config.modalFormItemLayout}
            label="确认人"
            name="task_ok_name"
            rules={[
              {

                message: '确认人',
              },
            ]}
          >
            <Select placeholder="确认人">
              {initValueData.UserList?.map((v) => {
                return (
                  <Select.Option value={v._id} key={v._id}>
                    {v.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            {...config.modalFormItemLayout}
            label="状态"
            name="task_state"
            rules={[
              {

                message: '请选择状态',
              },
            ]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value="A">完成</Select.Option>
              <Select.Option value="B">进行中</Select.Option>
              <Select.Option value="C">待进行</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            {...config.modalFormItemLayout}
            label="附件"
            name="file_id"
            rules={[
              {

                message: '请选择附件',
              },
            ]}
          >
            <Upload {...UploadProps}>
              <Button icon={<UploadOutlined />}>附件上传</Button>
            </Upload>,
          </Form.Item>
        </Form>

      </Modal >
    </>
  )
}

export default AddTask