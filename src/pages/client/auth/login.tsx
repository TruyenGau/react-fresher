
import { App, Button, Divider, Form, FormProps, Input, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import './register.scss'
import { useState } from "react";
import { loginApi } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";

type FieldType = {
    username: string;
    password: string;
}

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useCurrentApp();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { username, password } = values;
        const res = await loginApi(username, password);
        setIsSubmit(false);
        if (res?.data) {
            //success
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem('access_token', res.data.access_token);
            message.success("Đăng nhập tài khoản thành công");
            navigate('/');
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            });
        }
        setIsSubmit(false);
    };
    return (
        <div className="main">
            <div className="container">
                <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                    <h1 >Đăng nhập</h1>
                    <Divider />
                </div>
                <Form
                    name="register"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Email"
                        name="username"
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

                    <Form.Item >
                        <Button type="primary" htmlType="submit" loading={isSubmit}>
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', paddingBottom: '20px', color: 'black' }}>
                    <Divider>Or</Divider>
                    <p style={{ display: 'inline-block', paddingRight: '5px' }}>Bạn chưa có tài khoản?</p>
                    <Link to="/register" style={{ color: 'blue' }}> Đăng ký</Link>
                </div>
            </div>
        </div >
    )
}

export default LoginPage