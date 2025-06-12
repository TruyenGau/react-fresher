import { Col, Modal, Row, Image } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
interface Iprops {
    isOpenModalGallery: boolean;
    setIsOpenModalGallery: (v: boolean) => void;
    currentIndex: number;
    items: {
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[];
    title: string;
}
const ModalGallery = (props: Iprops) => {
    const {
        isOpenModalGallery,
        setIsOpenModalGallery,
        currentIndex,
        items,
        title,
    } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);

    useEffect(() => {
        if (isOpenModalGallery) {
            setActiveIndex(currentIndex);
        }
    }, [isOpenModalGallery, currentIndex]);
    return (
        <>
            <Modal
                width={"50vw"}
                closable={{ "aria-label": "Custom Close Button" }}
                open={isOpenModalGallery}
                onOk={() => setIsOpenModalGallery(false)}
                onCancel={() => setIsOpenModalGallery(false)}
                footer={null} //hide footer
                className="modal-gallery"
            >
                <Row gutter={[20, 20]}>
                    <Col span={16}>
                        <ImageGallery
                            ref={refGallery}
                            items={items}
                            showPlayButton={false} //hide play button
                            showFullscreenButton={false} //hide fullscreen button
                            startIndex={currentIndex} // start at current index
                            showThumbnails={false} //hide thumbnail
                            onSlide={(i) => setActiveIndex(i)}
                            slideDuration={0} //duration between slices
                        />
                    </Col>
                    <Col span={8}>
                        <div>{title}</div>
                        <div>
                            <Row gutter={[20, 20]}>
                                {items?.map((item, i) => {
                                    return (
                                        <Col key={`image-${i}`}>
                                            <Image
                                                wrapperClassName={"img-normal"}
                                                width={100}
                                                height={100}
                                                src={item.original}
                                                preview={false}
                                                onClick={() => {
                                                    refGallery?.current?.slideToIndex(i);
                                                }}
                                            />
                                            <div className={activeIndex === i ? "active" : ""}></div>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default ModalGallery;