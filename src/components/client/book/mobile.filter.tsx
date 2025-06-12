import {
    Button,
    Checkbox,
    Col,
    Divider,
    Drawer,
    Form,
    InputNumber,
    Rate,
    Row,
} from "antd";
interface Iprops {
    isOpenMobileFilter: boolean;
    setIsOpenMobileFilter: (v: boolean) => void;
    fetchCategory: { label: string; value: string }[];
    handleChangeFilter: any;
    onFinish: any;
}
const MobileFilter = (props: Iprops) => {
    const {
        isOpenMobileFilter,
        setIsOpenMobileFilter,
        handleChangeFilter,
        onFinish,
        fetchCategory,
    } = props;
    const [form] = Form.useForm();
    return (
        <>
            <Drawer
                title="Basic Drawer"
                closable={{ "aria-label": "Close Button" }}
                onClose={() => setIsOpenMobileFilter(false)}
                open={isOpenMobileFilter}
            >
                <Form
                    onFinish={onFinish}
                    form={form}
                    onValuesChange={(changedValues) => handleChangeFilter(changedValues)}
                >
                    <Form.Item
                        name="category"
                        label="Danh mục sản phẩm"
                        labelCol={{ span: 24 }}
                    >
                        <Checkbox.Group style={{ width: "100%" }}>
                            <Row>
                                {fetchCategory.map((items) => (
                                    <Col span={24}>
                                        <Checkbox value={items.value}>{items.label}</Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 20,
                            }}
                        >
                            <Form.Item name={["range", "from"]}>
                                <InputNumber
                                    name="from"
                                    min={0}
                                    placeholder="đ TỪ"
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                />
                            </Form.Item>
                            <span>-</span>
                            <Form.Item name={["range", "to"]}>
                                <InputNumber
                                    name="to"
                                    min={0}
                                    placeholder="đ ĐẾN"
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <Button
                                onClick={() => {
                                    form.submit();
                                    setIsOpenMobileFilter(false);
                                }}
                                style={{ width: "100%" }}
                                type="primary"
                            >
                                Áp dụng
                            </Button>
                        </div>
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                        <div>
                            <Rate
                                value={5}
                                disabled
                                style={{ color: "#ffce3d", fontSize: 15 }}
                            />
                            <span className="ant-rate-text"></span>
                        </div>
                        <div>
                            <Rate
                                value={4}
                                disabled
                                style={{ color: "#ffce3d", fontSize: 15 }}
                            />
                            <span className="ant-rate-text"> trở lên</span>
                        </div>
                        <div>
                            <Rate
                                value={3}
                                disabled
                                style={{ color: "#ffce3d", fontSize: 15 }}
                            />
                            <span className="ant-rate-text"> trở lên</span>
                        </div>
                        <div>
                            <Rate
                                value={2}
                                disabled
                                style={{ color: "#ffce3d", fontSize: 15 }}
                            />
                            <span className="ant-rate-text"> trở lên</span>
                        </div>
                        <div>
                            <Rate
                                value={1}
                                disabled
                                style={{ color: "#ffce3d", fontSize: 15 }}
                            />
                            <span className="ant-rate-text"> trở lên</span>
                        </div>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};
export default MobileFilter;