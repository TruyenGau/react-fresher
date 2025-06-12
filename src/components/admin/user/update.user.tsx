import { updateUserApi } from "@/services/api";
import { App, Divider, Form, FormProps, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IUserTable | null) => void;
    dataUpdate: IUserTable | null;
}
type FieldType = {
    _id: string;
    email: string;
    phone: string;
    fullName: string
}
const UpdateUser = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable, setDataUpdate, dataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                fullName: dataUpdate.fullName,
                email: dataUpdate.email,
                phone: dataUpdate.phone
            })
        }
    }, [dataUpdate])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, fullName, email, phone } = values;
        setIsSubmit(true);
        const res = await updateUserApi(_id, fullName, phone)
        if (res.data) {
            //success
            message.success("Update user thành công");
            form.resetFields();
            setDataUpdate(null);
            setOpenModalUpdate(false);
            navigate('/admin/user');
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.error
            })

        }
        setIsSubmit(false);
    };
    return (
        <>
            <Modal
                title="Cập nhật người dùng"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                    form.resetFields();
                }}
                okText={"Update"}
                cancelText={"Hủy bỏ"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
                    form={form}
                    name="createUser"
                    onFinish={onFinish}
                    autoComplete="off"
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item<FieldType>
                        label="Id"
                        name="_id"
                        rules={[{
                            required: true, message: 'Họ và tên không đầy đủ'
                        }
                        ]}
                        hidden
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Email không được để trống' },
                        { type: "email", message: 'Email không hợp lệ' }
                        ]}

                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Họ tên"
                        name="fullName"
                        rules={[{
                            required: true, message: 'Họ và tên không đầy đủ'
                        }
                        ]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item<FieldType>
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Số điện thoại không được để trống' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default UpdateUser