import { createBookApi, getCategoryApi, uploadFileAPI } from "@/services/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Form, FormProps, GetProp, Image, Input, InputNumber, Modal, Select, UploadFile, UploadProps } from "antd";
import Upload, { UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}
type UserUploadType = "thumbnail" | "slider";
type FieldType = {
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any
}
const CreateBook = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [listCategory, setListCategory] = useState<{ label: string; value: string }[]>([]);

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryApi();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d);
            }
        }
        fetchCategory();
    }, []);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

        setIsSubmit(true);
        const { mainText, author, price, quantity, category } = values;
        const thumbnail = fileListThumbnail?.[0].name ?? "";
        const slider = fileListSlider?.map(item => item.name) ?? [];
        const res = await createBookApi(mainText, author, price, quantity, category, thumbnail, slider);
        if (res && res.data) {
            message.success('Tạo mới book thành công');
            form.resetFields();
            setFileListSlider([]);
            setFileListThumbnail([]);
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false);
    };
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === "uploading") {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }

        if (info.file.status === "done") {
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);

        }
    }
    const handleUploadFile = async (
        options: RcCustomRequestOptions,
        type: UserUploadType
    ) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");

        if (res && res.data) {
            const uploadedFile: UploadFile = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded
                    }`,
            };
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }]);
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }]);
            }
            if (onSuccess) onSuccess("ok");
        } else message.error(res.message);
    };


    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }
    const handleCancel = () => {
        form.resetFields();
        setFileListSlider([]);
        setFileListThumbnail([]);
        setOpenModalCreate(false);
        refreshTable();
    };
    const handleRemove = async (file: UploadFile, type: "thumbnail" | "slider") => {
        if (type === "thumbnail") {
            setFileListThumbnail([]);
        }
        if (type === "slider") {
            const newSlider = fileListSlider.filter((x) => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    };
    return (
        <>
            <>
                <Modal
                    title="Create book"
                    open={openModalCreate}
                    onCancel={handleCancel}
                    width={"50vw"}
                    onOk={() => form.submit()}
                >
                    <Form form={form} onFinish={onFinish}>
                        <Form.Item<IBookTable>
                            label="Tên sách"
                            name="mainText"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your mainText!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<IBookTable>
                            label="Tác giả"
                            name="author"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your author!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<IBookTable>
                            label="Giá tiền"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your price!",
                                },
                            ]}
                        >
                            <InputNumber
                                addonAfter="đ"
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                            />
                        </Form.Item>
                        <Form.Item<IBookTable>
                            label="Thể loại"
                            name="category"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your category!",
                                },
                            ]}
                        >
                            <Select style={{ width: 120 }} options={listCategory} />
                        </Form.Item>
                        <Form.Item<IBookTable>
                            label="Số lượng"
                            name="quantity"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số lượng",
                                },
                            ]}
                        >
                            <InputNumber min={1} />
                        </Form.Item>
                        <Form.Item<IBookTable>
                            label="Ảnh thumbnail"
                            name="thumbnail"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your thumbnail!",
                                },
                            ]}
                            // convert value from upload -> form
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                maxCount={1}
                                multiple={false}
                                customRequest={(options) =>
                                    handleUploadFile(options, 'thumbnail')
                                }
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                onChange={(info) => handleChange(info, "thumbnail")}
                                onRemove={(file) => handleRemove(file, "thumbnail")}
                                fileList={fileListThumbnail}
                            >
                                <div>
                                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                        <Form.Item<IBookTable>
                            label="Ảnh slider"
                            name="slider"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your slider!",
                                },
                            ]}
                            // convert value from upload -> form
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                multiple={true}
                                customRequest={(options) => handleUploadFile(options, 'slider')}
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                onChange={(info) => handleChange(info, "slider")}
                                onRemove={(file) => handleRemove(file, "slider")}
                                fileList={fileListSlider}
                            >
                                <div>
                                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Form>
                    {previewImage && (
                        <Image
                            wrapperStyle={{ display: "none" }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(""),
                            }}
                            src={previewImage}
                        />
                    )}
                </Modal>
            </>
        </>
    )
}
export default CreateBook