import styles from './ImageModal.module.css';

export const ImageModal = ({ imgSrc, setOpenImage }) => {
    return (
        <div className={styles.imageModal}
        onClick={() => setOpenImage({ openImage: false, url: "" })}
        >
            <div className={styles.imageModal__photoContainer}>
                <img
                    src={imgSrc}
                    alt="flicr images"
                    className={styles.home__image}
                // ref={lastBookElementRef}
                />
            </div>
        </div>
    )
}