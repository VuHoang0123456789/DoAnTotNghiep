import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '@/redux/token';
import RefreshToken from '@/method/refreshToken';

const cx = classNames.bind(styles);

function StageCopmonent({
    SelecteLabel,
    registrations,
    setIsShowFormRegistration,
    isShowFormRegistration,
    registrationSearch,
    setStageSearch,
    stageSearch,
    isReloadStage,
    setIdReLoadStage,
    UnSelecteLabel,
    ShowFormMessage,
    formatDateVietName,
    formatDate,
    setIndexs,
    indexs,
    isReloadCurrentState,
    setIsReloadCurrentState,
}) {
    const dispatch = useDispatch();
    const Token = useSelector(selectToken);
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const [stages, setStages] = useState([]);
    const [selectedStage, setSelectedStage] = useState({
        id: '',
        registrationName: '',
        name: '',
        dateStart: '',
        dateEnd: '',
        DKID: '',
    });
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        setStages(stageSearch.filter((item) => item.DKID === selectedStage.DKID));
    }, [selectedStage, stageSearch]);
    useEffect(() => {
        UnSelecteLabel();
    }, [selectedStage]);

    useEffect(() => {
        if (
            selectedStage.registrationName.replace(/\s/g, '') !== '' &&
            selectedStage.name.replace(/\s/g, '') !== '' &&
            selectedStage.dateStart &&
            selectedStage.dateEnd &&
            selectedStage.DKID
        ) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [selectedStage]);

    useEffect(() => {
        if (registrationSearch.length === 0) {
            return;
        }

        setSelectedStage({
            ...selectedStage,
            registrationName: registrationSearch[0].name,
            DKID: registrationSearch[0].DKID,
        });

        const label = document.querySelectorAll('.stage-label-js')[0];
        SelecteLabel(label);
    }, [registrationSearch]);

    // stage start
    //hook
    useEffect(() => {
        fetch(`${doumainUrl}/admin/get-all-stage`, {
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
                            id: item.Id,
                            name: item.TenGiaiDoan,
                            dateStart: item.NgayBatDau,
                            dateEnd: item.NgayKetThuc,
                            DKID: item.DKID,
                            registrationName: item.name,
                        });
                    });
                    setStages(arr);
                    setStageSearch(arr);
                } else {
                    setStages([]);
                    setStageSearch([]);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [doumainUrl, isReloadStage, setStageSearch, Token, dispatch]);
    //method
    function SelectedStage(stage) {
        let arr = [...indexs];
        const Labels = document.querySelectorAll('.stage-label-js');
        for (let i = 0; i < Labels.length; i++) {
            arr.push(Labels[i].getAttribute('index'));
            SelecteLabel(Labels[i]);
        }

        setIndexs(arr);
        setSelectedStage(stage);
    }

    async function AddNewStage() {
        setIsDisabled(true);
        try {
            const res = await fetch(`${doumainUrl}/admin/create-new-stage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify({
                    name: selectedStage.name,
                    dateStart: selectedStage.dateStart,
                    dateEnd: selectedStage.dateEnd,
                    DKID: selectedStage.DKID,
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
                setIdReLoadStage(!isReloadStage);
                setSelectedStage({
                    ...selectedStage,
                    id: '',
                    name: '',
                    dateStart: '',
                    dateEnd: '',
                });

                setIsReloadCurrentState(!isReloadCurrentState);
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

    async function UpdateStage() {
        try {
            if (!selectedStage.DKID) {
                ShowFormMessage({ title: 'Error', content: 'Đợt đăng ký không chính xác', type: 'error' });
                return;
            }
            setIsDisabled(true);
            const res = await fetch(`${doumainUrl}/admin/update-stage`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    id: selectedStage.id,
                    token: Token,
                },
                body: JSON.stringify({
                    name: selectedStage.name,
                    dateStart: selectedStage.dateStart,
                    dateEnd: selectedStage.dateEnd,
                    DKID: selectedStage.DKID,
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
                setIdReLoadStage(!isReloadStage);
                setSelectedStage({
                    ...selectedStage,
                    id: '',
                    name: '',
                    dateStart: '',
                    dateEnd: '',
                });
                setIsReloadCurrentState(!isReloadCurrentState);
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
            console.log(error);
            ShowFormMessage({ title: 'Error', content: 'Cập nhật không thành công', type: 'error' });
        }
    }
    async function DeleteStage() {
        try {
            setIsDisabled(true);
            const res = await fetch(`${doumainUrl}/admin/delete-stage`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    id: selectedStage.id,
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

                setIdReLoadStage(!isReloadStage);
                setSelectedStage({
                    ...selectedStage,
                    id: '',
                    name: '',
                    dateStart: '',
                    dateEnd: '',
                });
                setIsReloadCurrentState(!isReloadCurrentState);
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
            ShowFormMessage({ title: 'Error', content: 'Xóa không thành công', type: 'error' });
        }
    }
    // stage end

    return (
        <div
            className={cx('item', 'mar-r-10')}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <h3 className={cx('title')}>Quản lý giai đoạn</h3>
            <div
                className={cx('content')}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className={cx('content__item')}>
                    <div className={cx('wrapper__input')} style={{ position: 'relative' }}>
                        <label htmlFor="sddk" onClick={(e) => SelecteLabel(e.target)} className="stage-label-js">
                            Đợt đăng ký
                        </label>
                        <input
                            id="sddk"
                            value={selectedStage.registrationName}
                            onChange={(e) => {
                                setSelectedStage({
                                    ...selectedStage,
                                    registrationName: e.target.value,
                                    DKID: registrations.filter((item) => item.name === e.target.value)[0]
                                        ? registrations.filter((item) => item.name === e.target.value)[0].DKID
                                        : undefined,
                                });
                                setIsShowFormRegistration(true);
                            }}
                        />
                        <div
                            className={cx('icon')}
                            onClick={() => {
                                setIsShowFormRegistration(!isShowFormRegistration);
                            }}
                        >
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                        {isShowFormRegistration ? (
                            <div className={cx('form-controll')}>
                                <ul>
                                    {registrationSearch
                                        .filter((item) =>
                                            item.name
                                                .toLowerCase()
                                                .includes(selectedStage.registrationName.toLowerCase()),
                                        )
                                        .map((value, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedStage({
                                                            ...selectedStage,
                                                            registrationName: value.name,
                                                            DKID: value.DKID,
                                                        });
                                                        SelecteLabel(
                                                            document.getElementsByClassName('stage-label-js')[0],
                                                        );
                                                        setIsShowFormRegistration(false);
                                                    }}
                                                >
                                                    {value.name}
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <div className={cx('content__item')}>
                    <div className={cx('wrapper__input')}>
                        <label htmlFor="stage" onClick={(e) => SelecteLabel(e.target)} className="stage-label-js">
                            Giai đoạn
                        </label>
                        <input
                            id="stage"
                            value={selectedStage.name}
                            onChange={(e) => {
                                setSelectedStage({
                                    ...selectedStage,
                                    name: e.target.value,
                                });
                            }}
                        />
                    </div>
                </div>
                <div className={cx('content__item')}>
                    <div className={cx('wrapper__input', 'mar-r-10')}>
                        <label htmlFor="dateStart" onClick={(e) => SelecteLabel(e.target)} className="stage-label-js">
                            Ngày bắt đầu
                        </label>
                        <input
                            id="dateStart"
                            type="date"
                            value={selectedStage.dateStart}
                            onChange={(e) => {
                                setSelectedStage({
                                    ...selectedStage,
                                    dateStart: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <div className={cx('wrapper__input')}>
                        <label htmlFor="dateEnd" onClick={(e) => SelecteLabel(e.target)} className="stage-label-js">
                            Ngày Kết thúc
                        </label>
                        <input
                            id="dateEnd"
                            type="date"
                            value={selectedStage.dateEnd}
                            onChange={(e) => {
                                setSelectedStage({
                                    ...selectedStage,
                                    dateEnd: e.target.value,
                                });
                            }}
                        />
                    </div>
                </div>
                <div className={cx('content__item')}>
                    <button className={cx('btn', 'btn-add')} onClick={AddNewStage} disabled={isDisabled}>
                        Thêm mới
                    </button>
                    <button
                        className={cx('btn', 'mar-l-10', 'mar-r-10', 'btn-update')}
                        onClick={UpdateStage}
                        disabled={isDisabled}
                    >
                        Cập nhật
                    </button>
                    <button className={cx('btn', 'btn-delete')} onClick={DeleteStage} disabled={isDisabled}>
                        Xóa
                    </button>
                </div>
                <div className={cx('content__table', 'mar-t-20')}>
                    <div className={cx('table__header')}>
                        <div className={cx('table__column', 'width-10')}>STT</div>
                        <div className={cx('table__column', 'width-40')}>Tên đợt đăng ký</div>
                        <div className={cx('table__column', 'width-25')}>Ngày bắt đầu</div>
                        <div className={cx('table__column', 'width-25', 'text-right')}>Ngày kết thúc</div>
                    </div>
                    <div className={cx('table__content')}>
                        <div style={{ padding: '0 10px' }}>
                            {stages.map((stage, index) => {
                                return (
                                    <div
                                        className={cx('table__row')}
                                        key={index}
                                        onClick={() =>
                                            SelectedStage({
                                                ...selectedStage,
                                                id: stage.id,
                                                name: stage.name,
                                                dateStart: formatDate(stage.dateStart),
                                                dateEnd: formatDate(stage.dateEnd),
                                            })
                                        }
                                    >
                                        <div className={cx('table__column', 'width-10')}>{index + 1}</div>
                                        <div className={cx('table__column', 'width-48')}>{stage.name}</div>
                                        <div className={cx('table__column', 'width-21')}>
                                            {formatDateVietName(stage.dateStart)}
                                        </div>
                                        <div className={cx('table__column', 'width-21', 'text-right')}>
                                            {formatDateVietName(stage.dateEnd)}
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

export default StageCopmonent;
