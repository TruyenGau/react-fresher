import { createUserApi } from "@/services/api";
import { App, Button, Divider, Form, FormProps, Input, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void
}
type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}
const CreateUser = (props: IProps) => {
    const { setOpenModalCreate, openModalCreate, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { message, notification } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsSubmit(true);
        const res = await createUserApi(fullName, email, password, phone);
        if (res.data) {
            //success
            message.success("Tạo mới user thành công");
            form.resetFields();
            setOpenModalCreate(false);
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
                title="Thêm mới người dùng"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalCreate(false)
                    form.resetFields();
                }}
                okText={"Tạo mới"}
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
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Email không được để trống' },
                        { type: "email", message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
                    >
                        <Input.Password />
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
export default CreateUser;