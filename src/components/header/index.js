import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import loaded from '@/method/loaded';
import FormControlHeader from '../formcontrolheader';
import { useSelector } from 'react-redux';
import { selectAccount } from '@/redux/account';
import Skeleton from '../skeleton';

const cx = classNames.bind(styles);

function Header() {
    const [isShowFormControl, setShowFormControl] = useState(false);
    const user = useSelector(selectAccount);
    let userObject = loaded();

    useEffect(() => {
        // add document eavent
        window.addEventListener('click', () => {
            setShowFormControl(false);
        });

        return () => {
            window.removeEventListener('click', () => {
                setShowFormControl(false);
            });
        };
    }, []);

    return (
        <div className={cx('container__header')}>
            <div className={cx('header')}>
                <div className={cx('header__item-left')}>
                    <Link to={`/${userObject}`}>
                        <div className={cx('image')}></div>
                    </Link>
                    <div className={cx('wrapper__title')}>
                        <h1 className="font-size-24 font-weight-500">TRƯỜNG ĐẠI HỌC Y DƯỢC HẢI PHÒNG</h1>
                        <span>Website đăng ký đề tài cho Module Dự án học thuật</span>
                    </div>
                </div>
                {!JSON.parse(sessionStorage.getItem(loaded())) ? (
                    <Link to={`/${userObject}/login`}>
                        <div className={cx('btn-login')}>Đăng nhập</div>
                    </Link>
                ) : (
                    <div className={cx('avatar__background')} style={{ position: 'relative', background: '#fff' }}>
                        {user ? (
                            <div
                                className={cx('avatar')}
                                style={{
                                    background: `url(${user.avatar}) top center / cover no-repeat`,
                                    border: '1px solid',
                                    position: 'absolute',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFormControl(!isShowFormControl);
                                }}
                            >
                                {isShowFormControl ? (
                                    <div className={cx('form')}>
                                        <FormControlHeader isShow={isShowFormControl} user={user} />
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        ) : (
                            <Skeleton width={70} height={70} circle={true} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
