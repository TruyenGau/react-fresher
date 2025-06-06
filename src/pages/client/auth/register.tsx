
import { App, Button, Divider, Form, FormProps, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import './register.scss'
import { useState } from "react";
import { registerApi } from "@/services/api";
type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}
const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { fullName, email, password, phone } = values;
        const res = await registerApi(fullName, email, password, phone);
        if (res.data) {
            //success
            message.success("Đăng ký user thành công");
            navigate('/login');
        } else {
            message.error(res.error)
            console.error(res.message);
        }
        setIsSubmit(false);
    };
    return (
        <div className="main">
            <div className="container">
                <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                    <h1 >Đăng ký tài khoản</h1>
                    <Divider />
                </div>
                <Form
                    name="register"
                    onFinish={onFinish}
                    autoComplete="off"
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
                    <Form.Item >
                        <Button type="primary" htmlType="submit" loading={isSubmit}>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', paddingBottom: '20px', color: 'black' }}>
                    <Divider>Or</Divider>
                    <p style={{ display: 'inline-block', paddingRight: '5px' }}>Bạn đã có tài khoản?</p>
                    <Link to="/login" style={{ color: 'blue' }}> Đăng nhập</Link>
                </div>
            </div>
        </div >
    )
}

export default RegisterPage