import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import FormLecturers from '@/pages/lecturersInformation';

const cx = classNames.bind(styles);
function RegisterTeam() {
    const [index, setIndex] = useState();
    const [isShowFormLecturers, setIsShowFormLecturers] = useState(false);

    const Teams = [
        { teamID: '1', leaderName: 'Vũ Huy Hoàng', count: '04' },
        { teamID: '2', leaderName: 'Lưu Thanh Hoàng', count: '04' },
    ];

    useEffect(() => {
        const Rows = document.getElementsByClassName('js-row');

        for (let i = 0; i < Rows.length; i++) {
            Rows[i].setAttribute('index', i);
        }
    }, []);

    function handleActive(e) {
        e.stopPropagation();
        let RowActive = e.target;
        const Rows = document.getElementsByClassName('js-row');
        const RowBottom = document.getElementsByClassName(cx('row__bottom'));

        if (RowActive.nodeName !== 'LI') {
            while (RowActive.nodeName !== 'LI') {
                RowActive = RowActive.parentElement;
            }
        }
        setIndex(parseInt(RowActive.getAttribute('index')));
        if (Rows[index] !== undefined) {
            Rows[index].classList.remove(cx('active'));
            RowBottom[index].style.display = 'none';
        }

        RowActive.classList.add(cx('active'));
        RowBottom[parseInt(RowActive.getAttribute('index'))].style.display = 'flex';
    }

    function handleUnActive(e) {
        e.stopPropagation();
        let RowActive = e.target;
        const RowBottom = document.getElementsByClassName(cx('row__bottom'));

        if (RowActive.nodeName !== 'LI') {
            while (RowActive.nodeName !== 'LI') {
                RowActive = RowActive.parentElement;
            }
        }

        RowActive.classList.remove(cx('active'));
        RowBottom[index].style.display = 'none';
    }

    function FormClick() {
        if (index !== undefined) {
            const RowActives = document.querySelectorAll('li');
            const RowBottom = document.getElementsByClassName(cx('row__bottom'));
            RowActives[index].classList.remove(cx('active'));
            RowBottom[index].style.display = 'none';
        }
    }

    return (
        <div className={cx('container')} onClick={FormClick}>
            {isShowFormLecturers ? <FormLecturers SetIsShowFormLecturers={setIsShowFormLecturers} /> : ''}
            <div className={cx('home')}>
                <h2 className={cx('title')}>Danh sách các nhóm sinh viên đăng ký hướng dẫn</h2>
                <div className={cx('table')}>
                    <div className={cx('table__header')}>
                        <div className={cx('header__column', 'width-10', 'text-left')}>
                            <span className="mar-l-10">STT</span>
                        </div>
                        <div className={cx('header__column', 'width-20', 'text-center')}>
                            <span className="mar-l-10">Số thứ tự nhóm</span>
                        </div>
                        <div className={cx('header__column', 'width-40')}>
                            <span className="mar-l-130">Tên trưởng nhóm</span>
                        </div>
                        <div className={cx('header__column', 'width-30', 'text-right')}>
                            <span className="mar-r-10">Số lượng thành viên</span>
                        </div>
                    </div>
                    <hr />
                    <div className={cx('table__content')}>
                        <ul>
                            {Teams.map((item, index) => {
                                return (
                                    <li
                                        className="js-row"
                                        onClick={(e) => {
                                            handleActive(e);
                                        }}
                                        key={index}
                                    >
                                        <div className={cx('table__content-row')}>
                                            <div className={cx('content-column', 'width-10', 'text-left')}>
                                                <span className="mar-l-20">{index}</span>
                                            </div>
                                            <div className={cx('content-column', 'width-20', 'text-center')}>
                                                <span className="mar-l-10">{item.teamID}</span>
                                            </div>
                                            <div className={cx('content-column', 'width-40')}>
                                                <span className="mar-l-130">{item.leaderName}</span>
                                            </div>
                                            <div className={cx('content-column', 'width-30', 'text-right')}>
                                                <span className="mar-r-20">{item.count}</span>
                                            </div>
                                        </div>
                                        <div className={cx('row__bottom')}>
                                            <button
                                                className={cx('row__bottom-btn', 'btn__see')}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUnActive(e);
                                                    setIsShowFormLecturers(true);
                                                }}
                                            >
                                                Xem thông tin
                                            </button>
                                            <button
                                                className={cx('row__bottom-btn', 'btn__agree')}
                                                onClick={handleUnActive}
                                            >
                                                Đồng ý
                                            </button>
                                            <button
                                                className={cx('row__bottom-btn', 'btn__disagree')}
                                                onClick={handleUnActive}
                                            >
                                                Không đồng ý
                                            </button>
                                        </div>
                                        <hr />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterTeam;
