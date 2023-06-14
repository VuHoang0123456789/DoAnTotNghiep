import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('container')}>
            <div className={cx('logo_hpu')}></div>
            <div className={cx('information')}>
                <p>Xây dựng bởi: Vũ Huy Hoàng </p>
                <p>Email: vuhuyhoang2104@gmail.com</p>
                <p>Điện thoại: 0929132671</p>
                <p>Sinh viên khoa công nghệ thông tin - trường Đại Học quản Lý và Công Nghệ Hải Phòng</p>
            </div>
        </div>
    );
}
export default Footer;
