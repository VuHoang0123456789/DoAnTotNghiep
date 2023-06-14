import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useEffect } from 'react';
import sitebarStyles from '@/components/sitebar/styles.module.scss';

const sitebar = classNames.bind(sitebarStyles);
const cx = classNames.bind(styles);

function Home() {
    useEffect(() => {
        const SitebarItems = document.getElementsByClassName(sitebar('sitebar__item'));
        for (let i = 0; i < SitebarItems.length; i++) {
            SitebarItems[i].classList.remove(sitebar('active'));
        }
    });
    return (
        <div className={cx('wrapper_home')}>
            <div className={cx('home', 'home__no-login')}>
                <h2>Website đăng ký đề tài module học thuật trường Đại Học Y Dược Hải Phòng</h2>
                <h3>Website là kết quả của đồ án tốt nghiệp</h3>
                <p>
                    Tên đề tài:
                    <span>
                        Xây dựng website đăng ký đề tài cho Module Dự án học thuật trường Đại học Y Dược Hải Phòng
                    </span>
                </p>
                <p>
                    Giảng viên hướng dẫn: <span>Lương Thanh Nhạn</span>
                </p>
                <p>
                    Sinh viên thực hiện: <span>Vũ Huy Hoàng</span>
                </p>
                <p>
                    Thời gian thực hiện: <span>Từ ngày 25/03/2023 đến ngày 17/06/2023</span>
                </p>
                <h3>Thông tin giảng viên hướng dẫn</h3>
                <p>
                    Họ tên: <span>Lương Thanh Nhạn</span>
                </p>
                <p>
                    Học Hàm, học vị: <span>Tiến sĩ</span>
                </p>
                <p>
                    Địa vị công tác: <span>Trường Đại Học Y Dược Hải Phòng</span>
                </p>
                <h3>Thông tin sinh viên thực hiện</h3>
                <p>
                    Họ tên: <span>Vũ Huy Hoàng</span>
                </p>
                <p>
                    Số điện thoại: <span>0929132671</span>
                </p>
                <p>
                    Địa chỉ email: <span>vuhuyhoang2104@gmail.com</span>
                </p>
                <p>
                    Khoa: <span>Công nghệ thông tin</span>
                </p>
                <p>
                    Nghành: <span>Công nghệ phần mềm</span>
                </p>
                <p>
                    Trường: <span>Đại Học Quản Lý Và Công Nghệ Hải Phòng</span>
                </p>
            </div>
        </div>
    );
}

export default Home;
