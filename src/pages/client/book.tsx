import BookDetail from "@/components/client/book/book.detail";
import BookLoader from "@/components/client/book/book.loader";
import { getBookByIdApi } from "@/services/api";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const BookPage = () => {
    const { id } = useParams();
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        if (id) {
            const fetchBookById = async () => {
                setIsLoading(true)
                const res = await getBookByIdApi(id);
                if (res && res.data) {
                    setCurrentBook(res.data);
                } else {
                    notification.error({
                        message: "Đã có lỗi xảy ra",
                        description: res.message
                    })
                }
                setIsLoading(false);
            }
            fetchBookById();
        }
    }, [id])

    return (
        <div>
            {
                isLoading ?
                    <BookLoader />
                    :
                    <BookDetail
                        currentBook={currentBook}
                    />
            }

        </div>
    )
};

export default BookPage