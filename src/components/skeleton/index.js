import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

function Skeleton({ width, height, ellipse, circle, percent }) {
    if (ellipse) {
        return (
            <span
                className={cx('skeleton-box', 'skeleton-box-ellipse')}
                style={{ width: `${width}${percent ? '%' : 'px'}`, height: `${height}px` }}
            ></span>
        );
    }

    if (circle) {
        return (
            <span
                className={cx('skeleton-box', 'skeleton-box-circle')}
                style={{ width: `${width}${percent ? '%' : 'px'}`, height: `${height}px` }}
            ></span>
        );
    }

    return (
        <span
            className={cx('skeleton-box')}
            style={{ width: `${width}${percent ? '%' : 'px'}`, height: `${height}px`, borderRadius: '4px' }}
        ></span>
    );
}

export default Skeleton;
