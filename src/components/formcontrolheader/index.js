import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import loaded from '@/method/loaded';

const cx = classNames.bind(styles);

function FormControlHeader({ isShow, user }) {
    let userObject = loaded();
    return isShow ? (
        <div
            className={cx('form-controll')}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <ul>
                <li>
                    <div className={cx('item-top')}>
                        <div
                            className={cx('avatar', 'is-50x50', 'mar-r-10')}
                            style={{
                                background: `url(${user.avatar}) top center / cover no-repeat`,
                                border: '1px solid rgba(0, 0, 0, 18%)',
                            }}
                        ></div>
                        <div>
                            <h3 className="black-color font-size-16">{user.showName}</h3>
                            <span className="font-size-14">{user.id}</span>
                        </div>
                    </div>
                    <hr />
                </li>
                <li>
                    <Link to={`/${userObject}/personal`}>
                        <div className={cx('item')}>Trang cá nhân</div>
                    </Link>
                    <hr />
                </li>
                <li>
                    <Link to={`/${userObject}/personal/setting`}>
                        <div className={cx('item')}>Cài đặt</div>
                    </Link>
                    <div
                        className={cx('item')}
                        onClick={(e) => {
                            e.stopPropagation();
                            sessionStorage.removeItem(userObject);
                            window.location.reload(`/${userObject}`);
                        }}
                    >
                        Đăng xuất
                    </div>
                </li>
            </ul>
        </div>
    ) : (
        ''
    );
}

export default FormControlHeader;
