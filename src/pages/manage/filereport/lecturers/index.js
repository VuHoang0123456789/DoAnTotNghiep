import classNames from 'classnames/bind';
import styles from '../styles.module.scss';
import { useEffect, useState } from 'react';
import loaded from '@/method/loaded';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserObject } from '@/redux/userobject';
import RefreshToken from '@/method/refreshToken';
import { selectToken } from '@/redux/token';
import Skeleton from '@/components/skeleton';

const cx = classNames.bind(styles);

function ManageLeturersReport() {
    const User = loaded();
    const [items, setItems] = useState([]);
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const stageId = useSelector(selectUserObject);
    const dispatch = useDispatch();
    const Token = useSelector(selectToken);
    const [isLoading, setIsloading] = useState(true);
    const arrs = new Array(6).fill(5);

    // call api
    useEffect(() => {
        if (stageId === '') {
            return;
        }
        fetch(`${doumainUrl}/lecturers/get-lecturers-registed`, {
            method: 'GET',
            headers: {
                token: Token,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();

                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
                if (res.status === 500) {
                    setIsloading(false);
                    return;
                }

                const Report = await fetch(`${doumainUrl}/lecturers/get-all-report`, {
                    method: 'GET',
                    headers: {
                        token: Token,
                        lecturersid: jsonData.MaGiangVienDk,
                    },
                });
                const result = await Report.json();

                if (Report.status === 200) {
                    setItems(result);
                    setIsloading(false);
                }

                if (Report.status === 401 || Report.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
                if (Report.status === 500) {
                    setIsloading(false);
                    return;
                }
            })
            .catch((error) => {
                setIsloading(false);
                console.log(error);
            });
    }, [User, doumainUrl, dispatch, Token, stageId]);
    //kết thúc phần xử lý logic

    return !isLoading ? (
        <div className={cx('container')}>
            <div className={cx('wrapper')}>
                <div className={cx('content')}>
                    <h3 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px' }}>Quản lý tiến độ</h3>
                    <hr />
                    {items.length > 0 ? (
                        <div>
                            {items.map((item, index) => {
                                return (
                                    <div key={index} style={{ position: 'relative' }} className="row">
                                        {item.isFiling ? (
                                            <div className={cx('wrapper_icon')}>Đã nộp</div>
                                        ) : (
                                            <div className={cx('wrapper_icon')}>Chưa nộp</div>
                                        )}

                                        <Link to={`/${User}/manage/report/${item.reportId}`}>
                                            <div
                                                className={cx('content__item')}
                                                style={{ padding: '10px 20px', color: 'var(--black-color)' }}
                                            >
                                                <div className={cx('item__top')}>
                                                    <div className={cx('icon')}>
                                                        <svg
                                                            focusable="false"
                                                            width="24"
                                                            height="24"
                                                            fill=" currentColor"
                                                            viewBox="0 0 24 24"
                                                            className=" NMm5M hhikbc"
                                                        >
                                                            <path d="M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7z"></path>
                                                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04a2.008 2.008 0 0 0-1.44 1.19c-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className={cx('item__right')}>
                                                        <p
                                                            style={{ fontSize: '16px', marginBottom: '5px' }}
                                                        >{`${item.title} (${item.teamName})`}</p>
                                                        <p className={cx('font-size-12')} style={{ opacity: '0.6' }}>
                                                            Ngày bắt đầu: {item.createAt}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            Hiện tại chưa có yêu cầu nộp báo cáo nào, vui lòng chờ ban quản lý điều chỉnh sau
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <div className={cx('container')}>
            <div className={cx('wrapper')}>
                <div className={cx('content')}>
                    <div className={cx('title')}>
                        <Skeleton width={40} height={35.6} percent={true} />
                    </div>
                    <hr />
                    {arrs.map((arr, index) => {
                        return (
                            <div className={cx('content__item')} key={index}>
                                <div className={cx('item__top')}>
                                    <Skeleton width={50} height={50} circle={true} />
                                    <div className={cx('item__right')}>
                                        <Skeleton width={80} height={24} percent={true} />
                                        <p className={cx('font-size-12')} style={{ opacity: '0.6' }}>
                                            <Skeleton width={40} height={24} percent={true} />
                                        </p>
                                    </div>
                                    <div>
                                        <Skeleton width={60} height={24} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ManageLeturersReport;
