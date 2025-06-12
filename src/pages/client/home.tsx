import {
    FilterOutlined,
    FilterTwoTone,
    ReloadOutlined,
} from "@ant-design/icons";
import "../../styles/home.scss";
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    FormProps,
    InputNumber,
    Pagination,
    Rate,
    Row,
    Spin,
    Tabs,
} from "antd";
import { useEffect, useState } from "react";
import { getBooksApi, getCategoryApi, } from "@/services/api";
import { useNavigate, useOutletContext } from "react-router-dom";
import MobileFilter from "@/components/client/book/mobile.filter";

type FieldType = {
    range: {
        from: number;
        to: number;
    };
    category: [];
};

const HomePage = () => {
    const [form] = Form.useForm();

    const [current, setCurrent] = useState(1);
    const [isListBook, setIsListBook] = useState<IBookTable[]>([]);
    const [total, setTotal] = useState(10);
    const [pageSize, setPageSize] = useState(5);


    const [pages, setPages] = useState(5);

    const [filter, setFilter] = useState<string | null>(null);
    const [sortQuery, setSortQuery] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isOpenMobileFilter, setIsOpenMobileFilter] = useState<boolean>(false);
    const [fetchCategory, setFetchCategory] = useState<
        {
            value: string;
            label: string;
        }[]
    >([]);
    // const [searchTerm] = useOutletContext<string>();

    const navigate = useNavigate();
    const fetchBook = async () => {
        setIsLoading(true);
        let query = "";
        query += `current=${current}&pageSize=${pageSize}`;
        // defaut
        if (sortQuery) {
            query += `${sortQuery}`;
        }
        if (filter) {
            query += `${filter}`;
        }
        // if (searchTerm) {
        //     query += `&mainText=/${searchTerm}/i`;
        // }
        const res = await getBooksApi(query);
        if (res.data) {
            setIsListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };
    const handleTabs = async (values: string) => {
        setSortQuery(`${values}`);
    };

    const handleChangeFilter = (changedValues: any) => {
        if (changedValues.category) {
            const cate = changedValues.category;
            const f = cate.join(",");
            if (changedValues && changedValues.category.length >= 1) {
                setFilter(`&category=${f}`);
            } else {
                setFilter("");
            }
        }
    };
    const handlePageChange = (pagination: {
        current: number;
        pageSize: number;
    }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
        }
        // Perform actions based on the new page, like fetching data
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if (values?.category?.length) {
                const cate = values?.category?.join(",");
                f += `&category=${cate}`;
            }
            setFilter(f);
        }
    };
    useEffect(() => {
        fetchBook();
    }, [current, pageSize, sortQuery, filter]);
    useEffect(() => {
        const initCategory = async () => {
            const res = await getCategoryApi();
            if (res && res.data) {
                const data = res.data.map((items) => {
                    return { value: items, label: items };
                });
                setFetchCategory(data);
            }
        };
        initCategory();
    }, []);
    const items = [
        {
            key: "&sort=-sold",
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: "&sort=-updateAt",
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: "&sort=price",
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: "&sort=-price",
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];
    return (
        <div
            className="homepage-container "
            style={{ maxWidth: 1440, margin: "0 auto" }}
        >
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>
                            <FilterTwoTone /> Bộ lọc tìm kiếm
                        </span>
                        <ReloadOutlined title="Reset" onClick={() => { form.resetFields(); setFilter('') }} />
                    </div>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={(changedValues) =>
                            handleChangeFilter(changedValues)
                        }
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
                                    onClick={() => form.submit()}
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
                </Col>
                <Col md={20} sm={24} xs={24}>
                    <Row>
                        <Tabs
                            defaultActiveKey="1"
                            items={items}
                            onChange={(value) => handleTabs(value)}
                        />
                        <Col md={0} xs={24}>
                            <Row>
                                <div style={{ marginTop: 30 }}></div>
                                <span style={{ fontWeight: 500, cursor: "pointer" }}>
                                    <FilterTwoTone onClick={() => setIsOpenMobileFilter(true)} />
                                    Lọc
                                </span>
                            </Row>
                        </Col>
                    </Row>

                    <Spin tip="Loading..." spinning={isLoading} size="small">
                        <Row className="customize-row">
                            {isListBook.map((items, index) => (
                                <div
                                    className="column"
                                    onClick={() => navigate(`book/${items._id}`)}
                                    key={`book-${index}`}
                                >
                                    <div className="wrapper">
                                        <div className="thumbnail">
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${items.thumbnail
                                                    }`}
                                                alt="thumbnail book"
                                            />
                                        </div>
                                        <div className="text">{items.mainText}</div>
                                        <div className="price">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(items.price)}
                                        </div>
                                        <div className="rating">
                                            <Rate
                                                value={5}
                                                disabled
                                                style={{ color: "#ffce3d", fontSize: 10 }}
                                            />
                                            <span>{items.sold}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Row>
                    </Spin>
                    <Divider />
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            current={current}
                            total={total}
                            pageSize={pageSize}
                            responsive
                            onChange={(p, s) => handlePageChange({ current: p, pageSize: s })}
                        />
                    </Row>
                    <MobileFilter
                        handleChangeFilter={handleChangeFilter}
                        onFinish={onFinish}
                        isOpenMobileFilter={isOpenMobileFilter}
                        setIsOpenMobileFilter={setIsOpenMobileFilter}
                        fetchCategory={fetchCategory}
                    />
                </Col>
            </Row>
        </div>
    );
};
export default HomePage;