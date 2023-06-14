import classNames from 'classnames/bind';
import styles from '../student/styles.module.scss';
import { useEffect, useState } from 'react';
import FormLecturers from '@/pages/lecturersInformation';
import { BtnUpdate } from '@/components/button';
import Message from '@/components/message/default';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserObject } from '@/redux/userobject';
import RefreshToken from '@/method/refreshToken';
import loaded from '@/method/loaded';
import { selectToken } from '@/redux/token';
import { RectangleMessage } from '@/components/message';
import Skeleton from '@/components/skeleton';

const cx = classNames.bind(styles);

function ManageMyTeam() {
    const [lecturers, setLecturers] = useState({
        email: '',
        imagePath: '',
        backgroundPath: '',
        lecturersName: '',
        lecturersId: '',
        birthDay: '',
        academicLevel: '',
        language: '',
        specializing: '',
        count: 0,
    });
    const [isShowFormLecturers, setIsShowFormLecturers] = useState(false);
    const [obj, setObj] = useState({});
    const [formMessages, setformMessages] = useState([]);
    const [teamInfomation, setTeamInfomation] = useState([]);
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const [teamSelected, setTeamSelected] = useState({});

    const [index, setIndex] = useState(0);
    const [isReload, setIsReLoad] = useState(false);
    const [isShowFormDelete, setIsShowFormDelete] = useState();
    const [isDisable, setIsDisable] = useState(false);

    const Token = useSelector(selectToken);
    const dispatch = useDispatch();
    const object = loaded();
    const stageId = useSelector(selectUserObject);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegisted, setIsRegisted] = useState(false);

    const user = {
        title: 'Thông tin nhóm',
        arr: [
            {
                title: 'Tên nhóm: ',
                value: teamSelected.TenNhom,
            },
            {
                title: 'Trưởng nhóm: ',
                value: teamSelected.HoTen,
            },
            {
                title: 'Số lượng thành viên: ',
                value: teamSelected.SoLuongThanhVien,
            },
            {
                title: 'Lĩnh vực nghiên cứu: ',
                value: teamSelected.TenLinhVucNghienCuu,
            },
            {
                title: 'Đề tài nghiên cứu: ',
                value: teamSelected.TenDeTaiNghienCuu,
            },
        ],
        question: {
            arr: teamSelected.rearchQuestions,
            title: 'Câu hỏi nghiên cứu:',
        },
        link: {
            url: teamSelected.LyLichThanhVien,
            title: 'Lý lịch các thành viên trong nhóm(click vào đây)',
        },
    };

    useEffect(() => {
        if (stageId.STT > 3) {
            return;
        }
        if (stageId === '') {
            return;
        }
        if (!isRegisted) {
            return;
        }
        if (isLoading) {
            return;
        }
        const name = [
            'Vui lòng nhập tên chuyên ngành hướng dẫn',
            'Vui lòng nhập tên ngôn ngữ hướng dẫn',
            'Vui lòng nhập số lượng nhóm',
            'Vui lòng chọn file ảnh',
            'Vui lòng chọn file lý lịch giảng viên',
        ];

        const InputName = ['specializing', 'language', 'count', 'imagePath', 'backgroundPath'];
        const Messages = document.getElementsByClassName(cx('message-js'));
        const inputs = document.getElementsByClassName(cx('input__platform'));

        for (let i = 0; i < Messages.length; i++) {
            Messages[i].setAttribute('name', name[i]);
        }

        for (let i = 0; i < InputName.length; i++) {
            inputs[i].setAttribute('name', InputName[i]);
        }
    }, [isLoading, stageId, isRegisted]);

    useEffect(() => {
        if (stageId.STT > 3) {
            return;
        }
        if (stageId === '') {
            return;
        }

        fetch(`${doumainUrl}/lecturers/get-infro-lecturers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
                stageid: stageId.Id,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();
                if (res.status === 200) {
                    const birthDay = new Date(jsonData.lecturersInfomation.NgaySinh);
                    let lecturers = {
                        email: jsonData.lecturersInfomation.Email,
                        imagePath: jsonData.lecturersInfomation.FileAnhUrl,
                        backgroundPath: jsonData.lecturersInfomation.FileLyLichUrl,
                        lecturersName: jsonData.lecturersInfomation.HoTen,
                        lecturersId: jsonData.lecturersInfomation.MaGiangVienDk,
                        birthDay: [
                            birthDay.getDate() <= 9 ? '0' + birthDay.getDate() : birthDay.getDate(),
                            birthDay.getMonth() + 1 <= 9 ? '0' + (birthDay.getMonth() + 1) : birthDay.getMonth() + 1,
                            birthDay.getFullYear(),
                        ].join('/'),
                        academicLevel: jsonData.lecturersInfomation.TenHocHamHocVi,
                        language: jsonData.lecturersInfomation.TenNgonNguHuongDan,
                        specializing: jsonData.lecturersInfomation.TenChuyenNganhHuongDan,
                        count: jsonData.lecturersInfomation.count,
                    };

                    setLecturers(lecturers);
                    setObj(lecturers);
                    setTeamInfomation(jsonData.teamInfomation);
                    setIsLoading(false);
                    setIsRegisted(true);
                }

                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }

                if (res.status === 500) {
                    setIsLoading(false);
                    setIsRegisted(false);
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [doumainUrl, stageId, object, isReload, Token, dispatch]);

    async function UpdateLecturers() {
        try {
            const res = await fetch(`${doumainUrl}/lecturers/update-lecturers`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    lecturersid: lecturers.lecturersId,
                    token: Token,
                },
                body: JSON.stringify({
                    language: lecturers.language,
                    specialized: lecturers.specializing,
                    count: lecturers.count,
                }),
            });
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
                setIsReLoad(!isReload);
            }

            if (res.status === 400) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }
            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                setIsReLoad(!isReload);
                return;
            }
            if (res.status === 500) {
                console.log(jsonData);
                return;
            }

            ShowFormMessage(mesage);
        } catch (error) {
            let mesage = {
                title: 'Error',
                content: 'Cập nhật không thành công, vui lòng thử lại.',
                type: 'error',
            };

            ShowFormMessage(mesage);
        }
    }

    async function UpdateFile(key) {
        try {
            const formData = new FormData();
            formData.append('uploadfile', lecturers[key]);
            let data = {};

            if (key === 'imagePath') {
                data = {
                    url_imge: 'imagePath',
                };
            } else {
                data = {
                    url_background: 'url_background',
                };
            }

            const res = await fetch(`${doumainUrl}/lecturers/update-file`, {
                method: 'PUT',
                headers: {
                    lecturersid: lecturers.lecturersId,
                    ...data,
                    token: Token,
                },
                body: formData,
            });
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
                setIsReLoad(!isReload);
            }

            if (res.status === 400) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }

            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                setIsReLoad(!isReload);
                return;
            }

            if (res.status === 500) {
                console.log(jsonData);
                return;
            }
            ShowFormMessage(mesage);
        } catch (error) {
            let mesage = {
                title: 'Error',
                content: 'Cập nhật không thành công, vui lòng thử lại.',
                type: 'error',
            };

            ShowFormMessage(mesage);
        }
    }

    function ShowFormMessage(message) {
        setformMessages([...formMessages, message]);
        setTimeout(() => {
            let arr = [...formMessages];
            arr.splice(0, 1);
            setformMessages(arr);
        }, 5000);
    }
    function setIsShowMessage(index) {
        let arr = [...formMessages];
        arr.splice(index, 1);
        setformMessages(arr);
    }

    async function AgreeTeam(index) {
        try {
            setIsDisable(true);
            const res = await fetch(`${doumainUrl}/lecturers/update-pairing`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify({
                    lecturersId: lecturers.lecturersId,
                    teamId: teamInfomation[index].MaNhom,
                    stageId: stageId.Id,
                }),
            });
            const jsonData = await res.json();
            setIsDisable(false);
            let mesage = {
                title: '',
                content: '',
                type: '',
            };

            if (res.status === 200) {
                mesage.title = 'Success';
                mesage.content = jsonData.msg;
                mesage.type = 'success';
                setIsReLoad(!isReload);
            }

            if (res.status === 400) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }

            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                setIsReLoad(!isReload);
                return;
            }

            if (res.status === 500) {
                console.log(jsonData);
                return;
            }

            ShowFormMessage(mesage);
        } catch (error) {
            let mesage = {
                title: 'Error',
                content: 'Xác nhận không thành công, vui lòng thử lại.',
                type: 'error',
            };

            ShowFormMessage(mesage);
        }
    }

    async function UnAgreeTeam(index) {
        try {
            setIsDisable(true);
            const res = await fetch(`${doumainUrl}/lecturers/delete-paring`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify({
                    lecturersId: lecturers.lecturersId,
                    teamId: teamInfomation[index].MaNhom,
                    stageId: stageId.Id,
                }),
            });
            const jsonData = await res.json();
            setIsDisable(false);
            let mesage = {
                title: '',
                content: '',
                type: '',
            };

            if (res.status === 200) {
                mesage.title = 'Success';
                mesage.content = jsonData.msg;
                mesage.type = 'success';

                setIsReLoad();
            }

            if (res.status === 400) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }

            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                setIsReLoad(!isReload);
                return;
            }

            if (res.status === 500) {
                console.log(jsonData);
                return;
            }

            ShowFormMessage(mesage);
        } catch (error) {
            let mesage = {
                title: 'Error',
                content: 'Hủy xác nhận không thành công, vui lòng thử lại.',
                type: 'error',
            };

            ShowFormMessage(mesage);
        }
    }
    function FormatCount() {
        let Count = lecturers.count;

        if (Count === 2) {
            return;
        }
        if (Count.length < 2) {
            Count = '0' + lecturers.count;
        }
        if (parseInt(Count) > 4) {
            Count = '04';
        }
        if (parseInt(Count) < 1) {
            Count = '01';
        }

        setLecturers({ ...lecturers, count: Count });
    }

    function FormatCountChange(e) {
        let count;

        if (e.target.value.length >= 3) {
            count = e.target.value[0] + '' + e.target.value[2];
        } else {
            count = e.target.value;
        }
        if (count.length === 2) {
            if (parseInt(count) > 4) {
                count = '04';
            }
            if (parseInt(count) < 1) {
                count = '01';
            }
        }

        setLecturers({ ...lecturers, count: count });
    }

    return stageId.STT < 4 || stageId === '' ? (
        !isLoading ? (
            <div>
                {isRegisted ? (
                    <div className={cx('container')} onClick={FormatCount}>
                        {isShowFormDelete ? (
                            <RectangleMessage
                                CloseForm={() => {
                                    setIsShowFormDelete(false);
                                }}
                                Agree={() => {
                                    UnAgreeTeam(index);
                                }}
                                title="Bạn có chắc chắn muốn hủy đăng ký không"
                            />
                        ) : (
                            ''
                        )}
                        {isShowFormLecturers ? (
                            <FormLecturers SetIsShowFormLecturers={setIsShowFormLecturers} user={user} />
                        ) : (
                            <></>
                        )}
                        <div className={cx('show-message')}>
                            {formMessages.map((formMessage, index) => {
                                return (
                                    <div key={index}>
                                        <Message
                                            title={formMessage.title}
                                            message={formMessage.content}
                                            type={formMessage.type}
                                            setIsShowMessage={setIsShowMessage}
                                            index={index}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className={cx('wrapper')}>
                            <h1 className={cx('title')}>Quản lý thông tin giảng viên</h1>
                            <div className={cx('content')}>
                                <div className={cx('content__team')}>
                                    <div className={cx('content__item', 'content__title')}>
                                        <h3 className="font-size-20 font-weight-600 ">Thông tin giảng viên</h3>
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Tên giảng viên</h3>
                                            <input
                                                maxLength={100}
                                                value={lecturers.lecturersName}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    FormatCount();
                                                }}
                                                onChange={(e) => {
                                                    setLecturers({ ...lecturers, lecturersName: e.target.value });
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message')}></p>
                                        </div>
                                        <div className={cx('item__right')}></div>
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Ngày sinh</h3>
                                            <input
                                                maxLength={100}
                                                value={lecturers.birthDay}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    FormatCount();
                                                }}
                                                onChange={(e) => {
                                                    setLecturers({ ...lecturers, birthDay: e.target.value });
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message')}></p>
                                        </div>
                                        <div className={cx('item__right')}></div>
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Học hàm, học vị</h3>
                                            <input
                                                value={lecturers.academicLevel}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    FormatCount();
                                                }}
                                                onChange={(e) => {
                                                    setLecturers({ ...lecturers, academicLevel: e.target.value });
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message')}></p>
                                        </div>
                                        <div className={cx('item__right')}></div>
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Địa chỉ email</h3>
                                            <input
                                                maxLength={100}
                                                value={lecturers.email}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    FormatCount();
                                                }}
                                                onChange={(e) => {
                                                    setLecturers({ ...lecturers, email: e.target.value });
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message')}></p>
                                        </div>
                                        <div className={cx('item__right')}></div>
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Tên chuyên ngành hướng dẫn</h3>
                                            <input
                                                className="input__platform"
                                                value={lecturers.specializing}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    FormatCount();
                                                }}
                                                onChange={(e) => {
                                                    setLecturers({ ...lecturers, specializing: e.target.value });
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message', 'message-js')}></p>
                                        </div>
                                        <BtnUpdate obj={obj} UpdateLecturers={UpdateLecturers} />
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Tên ngôn ngữ hướng dẫn</h3>
                                            <input
                                                className="input__platform"
                                                value={lecturers.language}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    FormatCount();
                                                }}
                                                onChange={(e) => {
                                                    setLecturers({ ...lecturers, language: e.target.value });
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message', 'message-js')}></p>
                                        </div>
                                        <BtnUpdate obj={obj} UpdateLecturers={UpdateLecturers} />
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Số lượng nhóm hướng dẫn</h3>
                                            <input
                                                type="number"
                                                className="input__platform"
                                                value={lecturers.count}
                                                onChange={(e) => {
                                                    FormatCountChange(e);
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message', 'message-js')}></p>
                                        </div>
                                        <BtnUpdate obj={obj} UpdateLecturers={UpdateLecturers} />
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">File ảnh</h3>
                                            <input
                                                className="input__platform"
                                                type="file"
                                                name={lecturers.imagePath}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    FormatCount();
                                                }}
                                                onChange={(e) => {
                                                    setLecturers({ ...lecturers, imagePath: e.target.files[0] });
                                                }}
                                                disabled
                                                accept="image/*"
                                            />
                                            <p className={cx('message', 'message-js')}></p>
                                        </div>
                                        <BtnUpdate
                                            obj={obj}
                                            UpdateFile={() => {
                                                UpdateFile('imagePath');
                                            }}
                                        />
                                        <button
                                            className={cx('btn')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`${lecturers.imagePath}`);
                                            }}
                                        >
                                            File ảnh
                                        </button>
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">File lý lịch giảng viên</h3>
                                            <input
                                                className="input__platform"
                                                type="file"
                                                name={lecturers.backgroundPath}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    FormatCount();
                                                }}
                                                onChange={(e) => {
                                                    setLecturers({ ...lecturers, backgroundPath: e.target.files[0] });
                                                }}
                                                accept=".doc,.docx"
                                                disabled
                                            />
                                            <p className={cx('message', 'message-js')}></p>
                                        </div>
                                        <BtnUpdate
                                            obj={obj}
                                            UpdateFile={() => {
                                                UpdateFile('backgroundPath');
                                            }}
                                        />
                                        <button
                                            className={cx('btn')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(
                                                    `https://docs.google.com/gview?url=${lecturers.backgroundPath}`,
                                                );
                                            }}
                                        >
                                            Lý lịch
                                        </button>
                                    </div>
                                </div>
                                {teamInfomation.length ? (
                                    <div className={cx('content__lecturers')}>
                                        <div className={cx('content__item', 'content__title')}>
                                            <h3 className="font-size-20 font-weight-500">
                                                Nhóm đăng ký hướng dẫn({teamInfomation.length})
                                            </h3>
                                        </div>
                                        {teamInfomation.map((team, index) => {
                                            return (
                                                <div className={cx('lecturers__item')} key={index}>
                                                    <h3 className="font-size-18 font-weight-600 mar-t-23">
                                                        Thông tin nhóm đăng ký hướng dẫn {index + 1}
                                                    </h3>
                                                    <ul>
                                                        <li>
                                                            <span className="font-weight-600 mar-r-5">Tên nhóm:</span>
                                                            <span className={cx('item_span')}>{team.TenNhom}</span>
                                                        </li>
                                                        <li>
                                                            <span className="font-weight-600 mar-r-5">
                                                                Trưởng nhóm:
                                                            </span>
                                                            <span className={cx('item_span')}>{team.HoTen}</span>
                                                        </li>
                                                        <li>
                                                            <span className="font-weight-600 mar-r-5">
                                                                Số lượng thành viên:
                                                            </span>
                                                            <span className={cx('item_span')}>
                                                                {team.SoLuongThanhVien}
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <span className="font-weight-600 mar-r-5">
                                                                Tên lĩnh vực nghiên cứu:
                                                            </span>
                                                            <span className={cx('item_span')}>
                                                                {team.TenLinhVucNghienCuu}
                                                            </span>
                                                        </li>
                                                        <li>
                                                            {team.TenDeTaiNghienCuu ? (
                                                                <>
                                                                    <span className="font-weight-600 mar-r-5">
                                                                        Tên đề tài nghiên cứu:
                                                                    </span>
                                                                    <span className={cx('item_span')}>
                                                                        {team.TenDeTaiNghienCuu}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </li>
                                                        <li>
                                                            {team.rearchQuestions.length !== 0 ? (
                                                                <>
                                                                    <div className="flex-column">
                                                                        <div className="font-weight-600">
                                                                            Câu hỏi nghiên cứu:
                                                                        </div>
                                                                        {team.rearchQuestions.map((question, index) => {
                                                                            return (
                                                                                <span
                                                                                    key={index}
                                                                                    style={{
                                                                                        padding: '5px 0',
                                                                                        whiteSpace: 'nowrap',
                                                                                        textOverflow: 'ellipsis',
                                                                                        overflow: 'hidden',
                                                                                        maxWidth: '514px',
                                                                                    }}
                                                                                >
                                                                                    {index + 1}.{' '}
                                                                                    {question.NoiDungCauHoi}
                                                                                </span>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </li>
                                                        <li className="mar-t-10 ">
                                                            <button
                                                                className={cx('width-35', 'btn-see', 'mar-r-10')}
                                                                onClick={() => {
                                                                    setTeamSelected(teamInfomation[index]);
                                                                    setIsShowFormLecturers(true);
                                                                }}
                                                            >
                                                                Thông tin nhóm
                                                            </button>
                                                            {team.YKienGiangVien === 0 ? (
                                                                <button
                                                                    disabled={isDisable}
                                                                    className={cx(
                                                                        'width-35',
                                                                        'btn-agree-registration',
                                                                        'mar-r-10',
                                                                    )}
                                                                    onClick={() => {
                                                                        AgreeTeam(index);
                                                                    }}
                                                                >
                                                                    Đồng ý
                                                                </button>
                                                            ) : (
                                                                ''
                                                            )}
                                                            {team.YKienGiangVien === 0 ? (
                                                                <button
                                                                    disabled={isDisable}
                                                                    className={cx(
                                                                        'width-35',
                                                                        'btn-cancel-registration',
                                                                    )}
                                                                    onClick={() => {
                                                                        setIndex(index);
                                                                        setIsShowFormDelete(true);
                                                                    }}
                                                                >
                                                                    Không đồng ý
                                                                </button>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </li>
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        {/* <iframe
             title="frame"
             src={`https://docs.google.com/gview?url=${lecturers.imagePath}&embedded=true`}
             style={{ width: '300px', height: '400px' }}
             frameborder="1"
         ></iframe> */}
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            height: '100vh',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Vui lòng đăng ký vào platform trước
                    </div>
                )}
            </div>
        ) : (
            <div className={cx('container')}>
                <div className={cx('wrapper')}>
                    <Skeleton width={50} height={51} percent={true} />
                    <div style={{ height: '30px', with: '5px' }}></div>
                    <div className={cx('content')}>
                        <div className={cx('content__team')}>
                            <Skeleton width={100} height={50} percent={true} />
                            <div className="flex" style={{ margin: '10px 0' }}>
                                <Skeleton width={80} height={50} percent={true} />
                                <div style={{ height: '10px', width: '20px' }}></div>
                                <Skeleton width={20} height={40} percent={true} ellipse={true} />
                            </div>
                            <div className="flex" style={{ margin: '10px 0' }}>
                                <Skeleton width={80} height={50} percent={true} />
                                <div style={{ height: '10px', width: '20px' }}></div>
                                <Skeleton width={20} height={40} percent={true} ellipse={true} />
                            </div>
                            <div className="flex" style={{ margin: '10px 0' }}>
                                <Skeleton width={80} height={50} percent={true} />
                                <div style={{ height: '10px', width: '20px' }}></div>
                                <Skeleton width={20} height={40} percent={true} ellipse={true} />
                            </div>
                            <div className="flex" style={{ margin: '10px 0' }}>
                                <Skeleton width={80} height={50} percent={true} />
                                <div style={{ height: '10px', width: '20px' }}></div>
                                <Skeleton width={20} height={40} percent={true} ellipse={true} />
                            </div>
                            <div className="flex" style={{ margin: '10px 0' }}>
                                <Skeleton width={80} height={50} percent={true} />
                                <div style={{ height: '10px', width: '20px' }}></div>
                                <Skeleton width={20} height={40} percent={true} ellipse={true} />
                            </div>
                            <div className="flex" style={{ margin: '10px 0' }}>
                                <Skeleton width={80} height={50} percent={true} />
                                <div style={{ height: '10px', width: '20px' }}></div>
                                <Skeleton width={20} height={40} percent={true} ellipse={true} />
                            </div>
                            <div className="flex" style={{ margin: '10px 0' }}>
                                <Skeleton width={80} height={50} percent={true} />
                                <div style={{ height: '10px', width: '20px' }}></div>
                                <Skeleton width={20} height={40} percent={true} ellipse={true} />
                            </div>
                        </div>

                        <div className={cx('content__lecturers')}>
                            <Skeleton width={100} height={50} percent={true} />

                            <div className={cx('lecturers__item')} style={{ marginTop: '10px' }}>
                                <Skeleton width={60} height={40} percent={true} />
                                <ul style={{ paddingLeft: '0' }}>
                                    <li style={{ margin: '5px 0' }}>
                                        <Skeleton width={30} height={30} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0' }}>
                                        <Skeleton width={50} height={30} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0' }}>
                                        <Skeleton width={40} height={30} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0' }}>
                                        <Skeleton width={70} height={30} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0' }}>
                                        <Skeleton width={80} height={30} percent={true} />
                                    </li>
                                    <li className="mar-t-10 ">
                                        <div style={{ flex: '1' }}>
                                            <Skeleton width={100} height={40} percent={true} ellipse={true} />
                                        </div>
                                        <div style={{ flex: '1', margin: '0 10px' }}>
                                            <Skeleton width={100} height={40} percent={true} ellipse={true} />
                                        </div>
                                        <div style={{ flex: '1' }}>
                                            <Skeleton width={100} height={40} percent={true} ellipse={true} />
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className={cx('lecturers__item')} style={{ marginTop: '10px' }}>
                                <Skeleton width={100} height={40} percent={true} />
                                <ul style={{ paddingLeft: '0' }}>
                                    <li style={{ margin: '5px 0' }}>
                                        <Skeleton width={30} height={30} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0' }}>
                                        <Skeleton width={50} height={30} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0' }}>
                                        <Skeleton width={40} height={30} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0' }}>
                                        <Skeleton width={70} height={30} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0' }}>
                                        <Skeleton width={80} height={30} percent={true} />
                                    </li>
                                    <li className="mar-t-10 ">
                                        <div style={{ flex: '1' }}>
                                            <Skeleton width={100} height={40} percent={true} ellipse={true} />
                                        </div>
                                        <div style={{ flex: '1', margin: '0 10px' }}>
                                            <Skeleton width={100} height={40} percent={true} ellipse={true} />
                                        </div>
                                        <div style={{ flex: '1' }}>
                                            <Skeleton width={100} height={40} percent={true} ellipse={true} />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    ) : (
        <div
            className={cx('jkgf')}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
        >
            Đã qua giai đoạn có thể chỉnh sửa thông tin
        </div>
    );
}

export default ManageMyTeam;
