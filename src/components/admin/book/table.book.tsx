import { deleteBookApi, getBooksApi } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import DetailBook from './detail.book';
import CreateBook from './create.book';
import UpdateBook from './update.book';
import { CSVLink } from 'react-csv';


type TSearch = {
    mainText: string;
    createdAt: string,
    createdAtRange: string,
    price: number;
    author: string
}


const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);


    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    const handleDeleteBook = async (_id: string) => {
        setIsDelete(true);
        const res = await deleteBookApi(_id);
        if (res && res.data) {
            message.success('Xóa book thành công')
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsDelete(false);
    }
    const columns: ProColumns<IBookTable>[] = [
        {
            dataIndex: '_d',
            title: 'Id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(entity)
                        setOpenViewDetail(true);
                    }}>{entity._id}</a>
                )
            },
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            hideInSearch: true
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <> {new Intl.NumberFormat(
                        'vi-VN',
                        { style: 'currency', currency: 'VND' }).format(entity.price)}

                    </>
                )
            },
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'createdAt',
            valueType: 'date',
            hideInSearch: true,
            sorter: true
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                setDataUpdate(entity)
                                setOpenModalUpdate(true);
                            }} />
                        <Popconfirm
                            placement='leftTop'
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa book này không"}
                            onConfirm={() => handleDeleteBook(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDelete }}
                        >

                            <span style={{ cursor: 'pointer', marginLeft: '0 20px' }}>
                                <DeleteTwoTone twoToneColor={"#ff4d4f"} style={{ cursor: "pointer" }} />
                            </span>
                        </Popconfirm>


                    </>
                )
            },
        },

    ];
    const refreshTable = () => {
        actionRef.current?.reload();
    }
    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`
                        }

                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&&createdAt<=${createDateRange[1]}`
                        }
                    }

                    //default

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else { query += `&sort=-createdAt`; }

                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`
                    }
                    if (sort && sort.author) {
                        query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`
                    }
                    if (sort && sort.price) {
                        query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`
                    }

                    const res = await getBooksApi(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? []);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}

                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => { return (<div>{range[0]} - {range[1]} trên {total} rows </div>) }
                }}
                headerTitle="Table book"
                toolBarRender={() => [
                    <CSVLink data={currentDataTable} filename='export-book.csv'>
                        <Button
                            icon={<ExportOutlined />}
                            type='primary'>
                            Export
                        </Button>
                    </CSVLink>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            // actionRef.current?.reload();
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>,


                ]}
            />
            <DetailBook
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateBook
                setOpenModalCreate={setOpenModalCreate}
                openModalCreate={openModalCreate}
                refreshTable={refreshTable}
            />
            <UpdateBook
                refreshTable={refreshTable}
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default TableBook;