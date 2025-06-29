import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Divider, GetProp, Image, Upload, UploadFile, UploadProps } from "antd";
import { Drawer } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IBookTable | null;
    setDataViewDetail: (v: IBookTable | null) => void;
}
const DetailBook = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataViewDetail) {
            let imgThumbnail: any = {}, imgSlider: UploadFile[] = [];
            if (dataViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail?.thumbnail}`
                }
            }
            if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }

    }, [dataViewDetail])

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const handleCancel = () => {
        setPreviewOpen(false);
    }
    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin user"
                    column={2}
                    bordered
                >
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sách">{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá tiền">{
                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewDetail?.price ?? 0)}</Descriptions.Item>
                    <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status="processing" text={dataViewDetail?.category}></Badge>
                    </Descriptions.Item>

                    <Descriptions.Item label="Creadted At">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Update At">
                        {dayjs(dataViewDetail?.updateAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>

                </Descriptions>
                <Divider orientation="left">Ảnh books</Divider>
                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}
export default DetailBook