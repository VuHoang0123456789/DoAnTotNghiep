import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '@/redux/token';
import RefreshToken from '@/method/refreshToken';

const cx = classNames.bind(styles);

function AcamicModleComp({
    SelecteLabel,
    UnSelecteLabel,
    ShowFormMessage,
    setRegistrations,
    registrationSearch,
    registrations,
    formatDate,
    formatDateVietName,
    setRegistrationSearch,
    setSelectedRegistrations,
    indexs,
    setIndexs,
}) {
    const dispatch = useDispatch();
    const Token = useSelector(selectToken);
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const [isReloadRegistration, setIdReLoadRegistration] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState({
        id: '',
        name: '',
        dateStart: '',
        dateEnd: '',
    });
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        UnSelecteLabel();
    }, [selectedRegistration]);

    useEffect(() => {
        if (
            selectedRegistration.name.replace(/\s/g, '') !== '' &&
            selectedRegistration.dateStart &&
            selectedRegistration.dateEnd
        ) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [selectedRegistration]);

    // registrtion start
    // hook
    useEffect(() => {
        fetch(`${doumainUrl}/admin/get-all-registration`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application.json',
                token: Token,
            },
        })
            .then(async (res) => {
                if (res.status === 200) {
                    const jsonData = await res.json();
                    let arr = [];
                    jsonData.forEach((item) => {
                        arr.push({
                            DKID: item.DKID,
                            name: item.TenDotDangKy,
                            dateStart: item.NgayBatDau,
                            dateEnd: item.NgayKetThuc,
                        });
                    });

                    setSelectedRegistrations(arr[0]);
                    setRegistrations(arr);
                    setRegistrationSearch(arr);
                } else {
                    setRegistrations([]);
                    setRegistrationSearch([]);
                }

                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [
        doumainUrl,
        isReloadRegistration,
        setRegistrations,
        setRegistrationSearch,
        setSelectedRegistrations,
        dispatch,
        Token,
    ]);
    //method
    function SelectedRegitration(registration) {
        let arr = [...indexs];
        const Labels = document.querySelectorAll('.registration-label-js');
        for (let i = 0; i < Labels.length; i++) {
            arr.push(Labels[i].getAttribute('index'));
            SelecteLabel(Labels[i]);
        }

        setIndexs(arr);
        setSelectedRegistration(registration);
    }
    async function AddNewRegistration() {
        setIsDisabled(true);
        try {
            const res = await fetch(`${doumainUrl}/admin/create-new-registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify({
                    name: selectedRegistration.name,
                    dateStart: selectedRegistration.dateStart,
                    dateEnd: selectedRegistration.dateEnd,
                }),
            });

            setIsDisabled(false);
            const jsonData = await res.json();

            let mesage = {
                title: '',
                content: '',
                type: '',
            };
            if (res.status === 200) {
                mesage.title = 'Success';
                mesage.content = jsonData.msg;
                mesage.type = 'success';
                setIdReLoadRegistration(!isReloadRegistration);
                setSelectedRegistration({
                    id: '',
                    name: '',
                    dateStart: '',
                    dateEnd: '',
                });
            }
            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }
            if (res.status >= 400) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }
            ShowFormMessage(mesage);
        } catch (error) {
            ShowFormMessage({ title: 'Error', content: 'Thêm mới không thành công', type: 'error' });
        }
    }

    async function UpDateRegistration() {
        try {
            setIsDisabled(true);
            const res = await fetch(`${doumainUrl}/admin/update-registration`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    id: selectedRegistration.DKID,
                    token: Token,
                },
                body: JSON.stringify({
                    name: selectedRegistration.name,
                    dateStart: selectedRegistration.dateStart,
                    dateEnd: selectedRegistration.dateEnd,
                }),
            });
            setIsDisabled(false);
            const jsonData = await res.json();

            let mesage = {
                title: '',
                content: '',
                type: '',
            };
            if (res.status === 200) {
                mesage.title = 'Success';
                mesage.content = jsonData.msg;
                mesage.type = 'success';
                setIdReLoadRegistration(!isReloadRegistration);
                setSelectedRegistration({
                    id: '',
                    name: '',
                    dateStart: '',
                    dateEnd: '',
                });
            }
            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }
            if (res.status >= 400) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }
            ShowFormMessage(mesage);
        } catch (error) {
            ShowFormMessage({ title: 'Error', content: 'Cập nhật không thành công', type: 'error' });
        }
    }

    async function DeleteRegistration() {
        try {
            setIsDisabled(true);
            const res = await fetch(`${doumainUrl}/admin/delete-registration`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    id: selectedRegistration.DKID,
                    token: Token,
                },
            });
            setIsDisabled(false);
            const jsonData = await res.json();

            let mesage = {
                title: '',
                content: '',
                type: '',
            };
            if (res.status === 200) {
                mesage.title = 'Success';
                mesage.content = jsonData.msg;
                mesage.type = 'success';
                setIdReLoadRegistration(!isReloadRegistration);
                setSelectedRegistration({
                    id: '',
                    name: '',
                    dateStart: '',
                    dateEnd: '',
                });
            }
            if (res.status === 401 || res.status === 403) {
                RefreshToken();
                return;
            }
            if (res.status >= 400) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }
            ShowFormMessage(mesage);
        } catch (error) {
            ShowFormMessage({ title: 'Error', content: 'Xóa không thành công', type: 'error' });
        }
    }
    // registration end

    return (
        <div className={cx('item', 'mar-r-10')}>
            <h3 className={cx('title')}>Quản lý đợt đăng ký</h3>
            <div
                className={cx('content')}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className={cx('content__item')}>
                    <div className={cx('wrapper__input')}>
                        <label htmlFor="DKID" className="registration-label-js" onClick={(e) => SelecteLabel(e.target)}>
                            Đợt đăng ký
                        </label>
                        <input
                            id="DKID"
                            value={selectedRegistration.name}
                            onChange={(e) => {
                                setSelectedRegistration({
                                    ...selectedRegistration,
                                    name: e.target.value,
                                });
                                setRegistrations(
                                    registrationSearch.filter((item) =>
                                        item.name.toLowerCase().includes(e.target.value.toLocaleLowerCase()),
                                    ),
                                );
                            }}
                        />
                    </div>
                </div>
                <div className={cx('content__item')}>
                    <div className={cx('wrapper__input', 'mar-r-10')}>
                        <label
                            htmlFor="dateStart"
                            className="registration-label-js"
                            onClick={(e) => SelecteLabel(e.target)}
                        >
                            Ngày bắt đầu
                        </label>
                        <input
                            id="dateStart"
                            type="date"
                            value={selectedRegistration.dateStart}
                            onChange={(e) => {
                                setSelectedRegistration({
                                    ...selectedRegistration,
                                    dateStart: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <div className={cx('wrapper__input')}>
                        <label
                            htmlFor="dateEnd"
                            className="registration-label-js"
                            onClick={(e) => SelecteLabel(e.target)}
                        >
                            Ngày Kết thúc
                        </label>
                        <input
                            id="dateEnd"
                            type="date"
                            value={selectedRegistration.dateEnd}
                            onChange={(e) => {
                                setSelectedRegistration({
                                    ...selectedRegistration,
                                    dateEnd: e.target.value,
                                });
                            }}
                        />
                    </div>
                </div>
                <div className={cx('content__item')}>
                    <button className={cx('btn', 'btn-add')} onClick={AddNewRegistration} disabled={isDisabled}>
                        Thêm mới
                    </button>
                    <button
                        className={cx('btn', 'mar-l-10', 'mar-r-10', 'btn-update')}
                        onClick={UpDateRegistration}
                        disabled={isDisabled}
                    >
                        Cập nhật
                    </button>
                    <button className={cx('btn', 'btn-delete')} onClick={DeleteRegistration} disabled={isDisabled}>
                        Xóa
                    </button>
                </div>
                <div className={cx('content__table', 'mar-t-20')}>
                    <div className={cx('table__header')}>
                        <div className={cx('table__column', 'width-10')}>STT</div>
                        <div className={cx('table__column', 'width-48')}>Tên đợt đăng ký</div>
                        <div className={cx('table__column', 'width-21')}>Ngày bắt đầu</div>
                        <div className={cx('table__column', 'width-21', 'text-right')}>Ngày kết thúc</div>
                    </div>
                    <div className={cx('table__content')}>
                        <div style={{ padding: '0 10px' }}>
                            {registrations.map((registration, index) => {
                                return (
                                    <div
                                        className={cx('table__row')}
                                        key={index}
                                        onClick={() =>
                                            SelectedRegitration({
                                                ...registration,
                                                dateStart: formatDate(registration.dateStart),
                                                dateEnd: formatDate(registration.dateEnd),
                                            })
                                        }
                                    >
                                        <div className={cx('table__column', 'width-10')}>{index + 1}</div>
                                        <div className={cx('table__column', 'width-48')}>{registration.name}</div>
                                        <div className={cx('table__column', 'width-21')}>
                                            {formatDateVietName(registration.dateStart)}
                                        </div>
                                        <div className={cx('table__column', 'width-21', 'text-right')}>
                                            {formatDateVietName(registration.dateEnd)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AcamicModleComp;
