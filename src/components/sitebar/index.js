import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faUserPlus, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import loaded from '@/method/loaded';

const cx = classNames.bind(styles);

function SiteBar() {
    const UserObject = loaded();
    const urlOfLecturers = [
        '/lecturers/register/platform',
        '/lecturers/register/team',
        '/lecturers/manage/team',
        '/lecturers/manage/report',
    ];
    const urlOfStudent = [
        '/student/register/platform',
        '/student/register/lecturers',
        '/student/manage/team',
        '/student/manage/report',
    ];

    useEffect(() => {
        const SitebarItems = document.getElementsByClassName(cx('sitebar__item'));
        let url = window.location.href;

        for (let i = 0; i < SitebarItems.length; i++) {
            SitebarItems[i].classList.remove(cx('active'));
        }
        if (UserObject === 'student') {
            for (let i = 0; i < urlOfStudent.length; i++) {
                if (url.includes(urlOfStudent[i])) {
                    SitebarItems[i].classList.add(cx('active'));
                    break;
                }
            }
        } else {
            for (let i = 0; i < urlOfLecturers.length; i++) {
                if (url.includes(urlOfLecturers[i])) {
                    SitebarItems[i].classList.add(cx('active'));
                    break;
                }
            }
        }
    });

    return (
        <div style={{ backgroundColor: '#cfd3ea80' }}>
            <div className={cx('container__sitebar')}>
                <div className={cx('sitebar__item-top')}>
                    <div className={cx('title')}>Đăng ký</div>
                    <Link to={`/${UserObject}/register/platform`} replace>
                        <div className={cx('sitebar__item')}>
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faUserPlus} />
                            </div>
                            <p>Platform</p>
                        </div>
                    </Link>
                    {UserObject === 'student' ? (
                        <Link to={`/${UserObject}/register/lecturers`}>
                            <div className={cx('sitebar__item')}>
                                <div className={cx('icon')}>
                                    <FontAwesomeIcon icon={faListCheck} />
                                </div>
                                <p>Giảng viên hướng dẫn</p>
                            </div>
                        </Link>
                    ) : (
                        <Link to={`/${UserObject}/register/team`} style={{ display: 'none' }}>
                            <div className={cx('sitebar__item')}>
                                <div className={cx('icon')}>
                                    <FontAwesomeIcon icon={faListCheck} />
                                </div>
                                <p>Nhóm hướng dẫn</p>
                            </div>
                        </Link>
                    )}
                </div>

                <div className={cx('sitebar__item-bottom')}>
                    <div className={cx('title')}>Quản lý</div>
                    <Link to={`/${UserObject}/manage/team`}>
                        <div className={cx('sitebar__item')}>
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faUsersRectangle} />
                            </div>
                            <p>{UserObject === 'student' ? 'Nhóm' : 'Giảng viên'}</p>
                        </div>
                    </Link>
                    <Link to={`/${UserObject}/manage/report`}>
                        <div className={cx('sitebar__item')}>
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faFileLines} />
                            </div>
                            <p> File báo cáo</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div className={cx('container__sitebar', 'container__sitebar-vetical')}>
                <Link className={cx('item')} to={`/${UserObject}/register/platform`}>
                    <div className={cx('icon')}>
                        <FontAwesomeIcon icon={faUserPlus} />
                    </div>
                </Link>
                {UserObject === 'student' ? (
                    <Link className={cx('item')} to={`/${UserObject}/register/lecturers`}>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faListCheck} />
                        </div>
                    </Link>
                ) : (
                    <Link className={cx('item')} to={`/${UserObject}/register/team`} style={{ display: 'none' }}>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faListCheck} />
                        </div>
                    </Link>
                )}

                <Link className={cx('item')} to={`/${UserObject}/manage/team`}>
                    <div className={cx('icon')}>
                        <FontAwesomeIcon icon={faUsersRectangle} />
                    </div>
                </Link>
                <Link className={cx('item')} to={`/${UserObject}/manage/report`}>
                    <div className={cx('icon')}>
                        <FontAwesomeIcon icon={faFileLines} />
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default SiteBar;
