import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCamera } from '@fortawesome/free-solid-svg-icons';
import FormControlHeader from '@/components/formcontrolheader';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import loaded from '../../../method/loaded';
import FormLecturers from '../../lecturersInformation';

const cx = classNames.bind(styles);

function Personal({ User, UserForm, selectedUser, Account }) {
    const [ishowFormControl, setIshowFormControl] = useState(false);
    const [isShowFormLecturers, setIsShowFormLecturers] = useState(false);
    let ObjectUser = loaded();

    useEffect(() => {
        window.addEventListener('click', () => {
            setIshowFormControl(false);
        });

        return () => {
            window.removeEventListener('click', () => [setIshowFormControl(false)]);
        };
    }, []);

    return (
        <div className={cx('container')}>
            {isShowFormLecturers ? (
                <FormLecturers SetIsShowFormLecturers={setIsShowFormLecturers} user={UserForm} />
            ) : (
                ''
            )}
            <div className={cx('header')}>
                <Link to={`/${ObjectUser}`}>
                    <div className={cx('header__item-left')}>
                        <img
                            src="https://cdn.haitrieu.com/wp-content/uploads/2022/11/Logo-Truong-Dai-hoc-Y-Hai-Phong-HPMU.png"
                            alt="#"
                        />
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </div>
                        <p className={cx('btn-back')}>Quay lại</p>
                    </div>
                </Link>
                <div className={cx('header__item-right')}>
                    <div
                        style={{
                            background: `url('${Account.avatar}')top center / cover no-repeat`,
                        }}
                        className={cx('avatar')}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIshowFormControl(!ishowFormControl);
                        }}
                    >
                        <div className={cx('form')}>
                            <FormControlHeader
                                isShow={ishowFormControl}
                                user={{ ...Account, id: Account.lecturersId }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('content__top')}>
                    <div className={cx('background')}></div>
                    <div className={cx('profile__user')}>
                        <div className={cx('profile__user-avatar')}>
                            <img id="backgroud" src={Account.avatar} alt="#" />
                        </div>
                        <div className={cx('profile__user-name')}>
                            <span>{Account.showName}</span>
                        </div>
                    </div>
                    <div
                        className={cx('btn__change-background')}
                        onClick={() => {
                            const btnChange = document.getElementById('btn-change-background');
                            btnChange.click();
                        }}
                    >
                        <input
                            type="file"
                            id="btn-change-background"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const backgroud = document.getElementById('backgroud');
                                backgroud.src = `http://127.0.0.1:8700/${e.target.files[0].name}`;
                                console.log(e.target.files[0]);
                            }}
                        />
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faCamera} />
                        </div>
                        <span>Chỉnh sửa ảnh bìa</span>
                    </div>
                </div>
                <div className={cx('content__bottom')}>
                    {User.map((value, index) => {
                        return (
                            <div className={cx('bottom__item', 'mar-r-10')} key={index}>
                                <h3 className="font-size-20">{value.title}</h3>
                                <div className={cx('bottom__item-content')}>
                                    {value.items.map((item, index) => {
                                        return (
                                            <div className="mar-t-10" key={index}>
                                                <h3 className="mar-b-5 font-size-18">{item.title}</h3>

                                                {item.values.map((Value, index) => {
                                                    return (
                                                        <p key={index}>
                                                            <span>{Value.title}:</span> {Value.value}
                                                        </p>
                                                    );
                                                })}
                                                {item.isSeeDetail ? (
                                                    <div
                                                        className={cx('btn__see-details')}
                                                        onClick={() => {
                                                            selectedUser(value.type, index);
                                                            setIsShowFormLecturers(true);
                                                        }}
                                                    >
                                                        Xem chi tiết
                                                        <FontAwesomeIcon className={cx('icon')} icon={faAngleRight} />
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Personal;
