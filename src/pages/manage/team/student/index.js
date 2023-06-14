import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { BtnUpdate } from '@/components/button';
import RefreshToken from '@/method/refreshToken';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserObject } from '@/redux/userobject';
import Message from '@/components/message/default';
import loaded from '@/method/loaded';
import { selectToken } from '@/redux/token';
import { RectangleMessage } from '@/components/message';
import Skeleton from '@/components/skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ManageTeamOfStudent() {
    const [obj, setObj] = useState({});
    const [team, setTeam] = useState({
        teamId: '',
        teamName: '',
        leaderName: '',
        count: '',
        path: '',
        researchFieldId: '',
        researchField: '',
        topicName: '',
    });
    const [formMessages, setformMessages] = useState([]);
    const [lecturersInfomation, setLecturersInfomation] = useState([]);
    const [rearchQuestion, setRearchQuestion] = useState([]);
    const [index, setIndex] = useState(0);
    const [indexOfQuestion, setIndexOfQuestion] = useState(0);

    const [isShowFormDelete, setIsShowFormDelete] = useState();
    const [isShowFormDeleteQuestion, setIsShowFormDeleteQuestion] = useState();
    const [isReload, setIsReLoad] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [isLoading, setIsloading] = useState(true);

    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const Token = useSelector(selectToken);
    const dispatch = useDispatch();
    const user = loaded();
    const stageId = useSelector(selectUserObject);
    const [isRegisted, setIsRegisted] = useState(false);

    useEffect(() => {
        if (stageId.STT > 3) {
            return;
        }
        if (isLoading) {
            return;
        }
        if (!isRegisted) {
            return;
        }
        const name = [
            'Vui lòng nhập tên nhóm',
            'Vui lòng nhập số lượng thành viên',
            'Vui lòng chọn file lý lịch sinh viên',
            'Vui lòng nhập tên lĩnh vực nghiên cứu',
            'Vui lòng nhập tên đề tài nghiên cứu',
        ];
        for (let i = 0; i < rearchQuestion.length; i++) {
            name.push('Vui lòng nhập nội dung câu hỏi');
        }

        const InputName = ['teamName', 'count', 'researchField', 'topicName'];
        const Messages = document.getElementsByClassName(cx('message-js'));
        const inputs = document.getElementsByClassName(cx('input__platform'));

        for (let i = 0; i < Messages.length; i++) {
            Messages[i].setAttribute('name', name[i]);
        }

        for (let i = 0; i < InputName.length; i++) {
            inputs[i].setAttribute('name', InputName[i]);
        }
    }, [rearchQuestion, isLoading, stageId, isRegisted]);

    useEffect(() => {
        if (stageId.STT > 3) {
            return;
        }

        fetch(`${doumainUrl}/student/show-infomation`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();

                if (res.status === 200) {
                    const team = {
                        teamId: jsonData.studentInfomation.MaNhom,
                        teamName: jsonData.studentInfomation.TenNhom,
                        leaderName: jsonData.studentInfomation.HoTen,
                        count: jsonData.studentInfomation.SoLuongThanhVien,
                        path: jsonData.studentInfomation.LyLichThanhVien,
                        researchFieldId: jsonData.studentInfomation.MaLinhVucNghienCuu,
                        researchField: jsonData.studentInfomation.TenLinhVucNghienCuu,
                        topicName: jsonData.studentInfomation.TenDeTaiNghienCuu,
                    };

                    setObj(team);
                    setTeam(team);
                    setRearchQuestion(jsonData.rearchQuestion);

                    jsonData.lecturersInfomation.forEach((lecturers) => {
                        const birthDay = new Date(lecturers.NgaySinh);
                        lecturers.NgaySinh = [
                            birthDay.getDate() < 10 ? '0' + birthDay.getDate() : birthDay.getDate(),
                            birthDay.getMonth() + 1 < 10 ? '0' + birthDay.getMonth() + 1 : birthDay.getMonth() + 1,
                            birthDay.getFullYear(),
                        ].join('/');
                    });
                    setLecturersInfomation(jsonData.lecturersInfomation);
                    setIsloading(false);
                    setIsRegisted(true);
                }

                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
                if (res.status === 500) {
                    setIsRegisted(false);
                    setIsloading(false);
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [doumainUrl, user, isReload, Token, dispatch, stageId]);

    function FormatCount() {
        let Count = team.count;

        if (Count === 2) {
            return;
        }
        if (Count.length < 2) {
            Count = '0' + team.count;
        }
        if (parseInt(Count) > 15) {
            Count = '15';
        }
        if (parseInt(Count) < 5) {
            Count = '05';
        }

        setTeam({ ...team, count: Count });
    }

    function FormatCountChange(e) {
        let count;

        if (e.target.value.length >= 3) {
            count = e.target.value[0] + '' + e.target.value[2];
        } else {
            count = e.target.value;
        }
        if (count.length === 2) {
            if (parseInt(count) > 15) {
                count = '15';
            }
            if (parseInt(count) < 5) {
                count = '05';
            }
        }

        setTeam({ ...team, count: count });
    }

    async function UnFollow(index) {
        try {
            setIsDisable(true);
            const res = await fetch(`${doumainUrl}/student/delete-paring`, {
                method: 'DELETE',
                body: JSON.stringify({
                    teamId: team.teamId,
                    lecturersId: lecturersInfomation[index].MaGiangVienDk,
                    stageId: stageId.Id,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
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
                content: 'Hủy đăng ký không thành công',
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

    async function UpdateTeam() {
        try {
            const res = await fetch(`${doumainUrl}/student/update-team`, {
                method: 'PUT',
                body: JSON.stringify({
                    teamId: team.teamId,
                    teamName: team.teamName,
                    count: team.count,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
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
                content: 'Cập nhật không thành công',
                type: 'error',
            };

            ShowFormMessage(mesage);
        }
    }

    async function UpdateFileOfTeam() {
        const formData = new FormData();
        formData.append('updatefile', team.path);

        try {
            const res = await fetch(`${doumainUrl}/student/update-file`, {
                method: 'PUT',
                body: formData,
                headers: {
                    token: Token,
                    teamid: team.teamId,
                },
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
                content: 'Cập nhật không thành công',
                type: 'error',
            };

            ShowFormMessage(mesage);
        }
    }

    async function UpdateResearchfield() {
        try {
            const res = await fetch(`${doumainUrl}/student/update-researchfield`, {
                method: 'PUT',
                body: JSON.stringify({
                    researchFieldId: team.researchFieldId,
                    researchFieldName: team.researchField,
                    topicName: team.topicName,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
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
                content: 'Cập nhật không thành công',
                type: 'error',
            };

            ShowFormMessage(mesage);
        }
    }

    async function UpdateResearchQuestion(index) {
        try {
            const res = await fetch(`${doumainUrl}/student/update-research-question`, {
                method: 'PUT',
                body: JSON.stringify({
                    content: rearchQuestion[index].NoiDungCauHoi,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                    questionid: rearchQuestion[index].MaCauHoi,
                    researchfieldid: team.researchFieldId,
                },
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
                content: 'Cập nhật câu hỏi không thành công',
                type: 'error',
            };

            ShowFormMessage(mesage);
        }
    }

    async function DeleteResearchQuestion(index) {
        try {
            const res = await fetch(`${doumainUrl}/student/delete-Research-question`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                    questionid: rearchQuestion[index].MaCauHoi,
                },
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
                content: 'Xóa câu hỏi không thành công',
                type: 'error',
            };

            ShowFormMessage(mesage);
        }
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
                                    UnFollow(index);
                                }}
                                title="Bạn có chắc chắn muốn hủy đăng ký không?"
                            />
                        ) : (
                            <></>
                        )}

                        {isShowFormDeleteQuestion ? (
                            <RectangleMessage
                                CloseForm={() => {
                                    setIsShowFormDeleteQuestion(false);
                                }}
                                Agree={() => {
                                    DeleteResearchQuestion(indexOfQuestion);
                                }}
                                title="Bạn có chắc chắn muốn xóa câu hỏi này không?"
                            />
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
                            <h1 className={cx('title')}>Quản lý thông tin nhóm</h1>
                            <div className={cx('content')}>
                                <div className={cx('content__team')}>
                                    <div className={cx('content__item', 'content__title')}>
                                        <h3 className="font-size-20 font-weight-600 ">Thông tin nhóm</h3>
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Tên nhóm</h3>
                                            <input
                                                className="input__platform"
                                                maxLength={100}
                                                value={team.teamName}
                                                onChange={(e) => {
                                                    setTeam({ ...team, teamName: e.target.value });
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message', 'message-js')}></p>
                                        </div>

                                        <BtnUpdate obj={obj} UpdateTeam={UpdateTeam} />
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Tên trưởng nhóm</h3>
                                            <input
                                                maxLength={100}
                                                value={team.leaderName}
                                                onChange={(e) => {
                                                    setTeam({ team, leaderName: e.target.value });
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message')}></p>
                                        </div>
                                        <div className={cx('item__right')}></div>
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Số lượng thành viên</h3>
                                            <input
                                                id="countId"
                                                className="input__platform"
                                                type="number"
                                                min={5}
                                                max={15}
                                                placeholder="Tối đa 4 thành viên"
                                                value={team.count}
                                                onChange={FormatCountChange}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message', 'message-js')}></p>
                                        </div>
                                        <BtnUpdate obj={obj} UpdateTeam={UpdateTeam} />
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Lý lịch nhóm sinh viên tham gia dự án</h3>
                                            <input
                                                type="file"
                                                name={team.path}
                                                onChange={(e) => {
                                                    setTeam({ ...team, path: e.target.files[0] });
                                                }}
                                                disabled
                                                accept=".doc,.docx"
                                            />
                                            <p className={cx('message', 'message-js')}></p>
                                        </div>
                                        <BtnUpdate obj={obj} UpdateFileOfTeam={UpdateFileOfTeam} />
                                        <button
                                            className={cx('btn')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`https://docs.google.com/gview?url=${team.path}`);
                                            }}
                                        >
                                            Lý lịch
                                        </button>
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Tên lĩnh vực nghiên cứu</h3>
                                            <input
                                                className="input__platform"
                                                maxLength={100}
                                                value={team.researchField}
                                                onChange={(e) => {
                                                    setTeam({ ...team, researchField: e.target.value });
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message', 'message-js')}></p>
                                        </div>
                                        <BtnUpdate obj={obj} UpdateResearchfield={UpdateResearchfield} />
                                    </div>
                                    <div className={cx('content__item')}>
                                        <div className={cx('item__left')}>
                                            <h3 className="font-size-16">Tên đề tài nghiên cứu nghiên cứu</h3>
                                            <input
                                                className="input__platform"
                                                value={team.topicName}
                                                maxLength={100}
                                                onChange={(e) => {
                                                    setTeam({ ...team, topicName: e.target.value });
                                                }}
                                                disabled
                                            />
                                            <p className={cx('message', 'message-js')}></p>
                                        </div>
                                        <BtnUpdate obj={obj} UpdateResearchfield={UpdateResearchfield} />
                                    </div>
                                    <div>
                                        <h3 className="font-size-16 flex">
                                            Câu hỏi nghiên cứu
                                            <div
                                                className={cx('icon')}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    let arr = [...rearchQuestion];
                                                    arr.push({ MaCauHoi: 1, NoiDungCauHoi: '' });
                                                    setRearchQuestion(arr);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </div>
                                        </h3>
                                        {rearchQuestion.map((question, index) => {
                                            return (
                                                <div className={cx('content__item')} key={index}>
                                                    <div className={cx('item__left')}>
                                                        <h3 className="font-size-16">Câu hỏi số {index + 1}</h3>
                                                        <input
                                                            className="input__platform"
                                                            value={question.NoiDungCauHoi}
                                                            onChange={(e) => {
                                                                const questions = [...rearchQuestion];
                                                                questions[index].NoiDungCauHoi = e.target.value;
                                                                setRearchQuestion(questions);
                                                            }}
                                                            disabled
                                                        />
                                                        <p className={cx('message', 'message-js')}></p>
                                                    </div>
                                                    <BtnUpdate
                                                        obj={obj}
                                                        UpdateResearchQuestion={UpdateResearchQuestion}
                                                        researchIndex={index}
                                                    />
                                                    <button
                                                        className={cx('btn', 'btn_delete')}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIndexOfQuestion(index);
                                                            setIsShowFormDeleteQuestion(true);
                                                        }}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className={cx('content__lecturers')}>
                                    <div className={cx('content__item', 'content__title')}>
                                        <h3 className="font-size-20 font-weight-500 ">
                                            Giảng viên hướng dẫn({lecturersInfomation.length})
                                        </h3>
                                    </div>
                                    {lecturersInfomation.map((lecturers, index) => {
                                        return (
                                            <div className={cx('lecturers__item')} key={index}>
                                                <h3 className="font-size-18 font-weight-600 mar-t-23">
                                                    Giảng viên hướng dẫn {index + 1}
                                                </h3>
                                                <ul>
                                                    <li>
                                                        <span className="font-weight-600 mar-r-5"> Họ tên:</span>
                                                        <span className={cx('item_span')}>{lecturers.HoTen}</span>
                                                        <span className="tooltip font-size-12 mar-l-5">
                                                            {!lecturers.YKienGiangVien ? '(Chờ xác nhận)' : ''}
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span className="font-weight-600 mar-r-5">Ngày sinh:</span>
                                                        <span className={cx('item_span')}>{lecturers.NgaySinh}</span>
                                                    </li>
                                                    <li>
                                                        <span className="font-weight-600 mar-r-5">
                                                            Học hàm/ học vị:
                                                        </span>
                                                        <span className={cx('item_span')}>
                                                            {lecturers.TenHocHamHocVi}
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span className="font-weight-600 mar-r-5">
                                                            Chuyên ngành hướng dẫn:
                                                        </span>
                                                        <span className={cx('item_span')}>
                                                            {lecturers.TenChuyenNganhHuongDan}
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span className="font-weight-600 mar-r-5">
                                                            Ngôn ngữ hướng dẫn:
                                                        </span>{' '}
                                                        <span className={cx('item_span')}>
                                                            {lecturers.TenNgonNguHuongDan}
                                                        </span>
                                                    </li>
                                                    <li className="mar-t-10">
                                                        <button
                                                            className={cx('width-35', 'btn-see', 'mar-r-10')}
                                                            onClick={() => {
                                                                window.open(
                                                                    `https://docs.google.com/gview?url=${lecturers.FileLyLichUrl}`,
                                                                );
                                                            }}
                                                        >
                                                            Lý lịch GV
                                                        </button>
                                                        {lecturers.YKienGiangVien === 0 ? (
                                                            <button
                                                                disabled={isDisable}
                                                                className={cx('width-35', 'btn-cancel-registration')}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setIndex(index);
                                                                    setIsShowFormDelete(true);
                                                                }}
                                                            >
                                                                Hủy Đăng ký
                                                            </button>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </li>
                                                </ul>
                                                <div
                                                    className={cx('avatar')}
                                                    style={{
                                                        background: `url('${lecturers.FileAnhUrl}') top center / cover no-repeat`,
                                                    }}
                                                ></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
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
                        Vui lòng đăng ký vào platform
                    </div>
                )}
            </div>
        ) : (
            <div className={cx('container')}>
                <div className={cx('wrapper')}>
                    <h1 className={cx('title')}>
                        <Skeleton width={50} height={51} percent={true} />
                    </h1>
                    <div className={cx('content')}>
                        <div className={cx('content__team')}>
                            <Skeleton width={98} height={50} percent={true} />
                            <div className={cx('content__item')}>
                                <Skeleton width={74} height={40} percent={true} />
                                <div style={{ width: '10px', height: '5px' }}></div>
                                <Skeleton width={17} height={35} ellipse={true} percent={true} />
                            </div>
                            <div className={cx('content__item')}>
                                <Skeleton width={74} height={40} percent={true} />
                                <div style={{ width: '10px', height: '5px' }}></div>
                                <Skeleton width={17} height={35} ellipse={true} percent={true} />
                            </div>
                            <div className={cx('content__item')}>
                                <Skeleton width={74} height={40} percent={true} />
                                <div style={{ width: '10px', height: '5px' }}></div>
                                <Skeleton width={17} height={35} ellipse={true} percent={true} />
                            </div>
                            <div className={cx('content__item')}>
                                <Skeleton width={74} height={40} percent={true} />
                                <div style={{ width: '10px', height: '5px' }}></div>
                                <Skeleton width={17} height={35} ellipse={true} percent={true} />
                            </div>
                            <div className={cx('content__item')}>
                                <Skeleton width={74} height={40} percent={true} />
                                <div style={{ width: '10px', height: '5px' }}></div>
                                <Skeleton width={17} height={35} ellipse={true} percent={true} />
                            </div>
                            <div className={cx('content__item')}>
                                <Skeleton width={74} height={40} percent={true} />
                                <div style={{ width: '10px', height: '5px' }}></div>
                                <Skeleton width={17} height={35} ellipse={true} percent={true} />
                            </div>
                            <div className={cx('content__item')}>
                                <Skeleton width={74} height={40} percent={true} />
                                <div style={{ width: '10px', height: '5px' }}></div>
                                <Skeleton width={17} height={35} ellipse={true} percent={true} />
                            </div>
                        </div>

                        <div className={cx('content__lecturers')}>
                            <Skeleton width={95} height={51} percent={true} />
                            <div className={cx('lecturers__item')} style={{ paddingTop: '20px' }}>
                                <Skeleton width={56} height={40} percent={true} />
                                <ul style={{ paddingLeft: '0px', paddingBottom: '5px' }}>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={36} height={35} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={45} height={35} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={55} height={35} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={72} height={35} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={65} height={35} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={36} height={36.8} ellipse={true} percent={true} />
                                    </li>
                                </ul>
                                <div className={cx('avatar')} style={{ border: 'none' }}>
                                    <Skeleton width={100} height={100} />
                                </div>
                            </div>
                            <Skeleton width={95} height={51} percent={true} />
                            <div className={cx('lecturers__item', 'mar-t-10')}>
                                <Skeleton width={56} height={40} percent={true} />
                                <ul style={{ paddingLeft: '0px', paddingBottom: '5px' }}>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={36} height={35} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={45} height={35} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={55} height={35} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={72} height={35} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={65} height={35} percent={true} />
                                    </li>
                                    <li style={{ margin: '5px 0px' }}>
                                        <Skeleton width={36} height={36.8} ellipse={true} percent={true} />
                                    </li>
                                </ul>
                                <div className={cx('avatar')} style={{ border: 'none' }}>
                                    <Skeleton width={100} height={100} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    ) : (
        <div
            className={cx('jkgf')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
        >
            Đã qua giai đoạn có thể chỉnh sửa thông tin
        </div>
    );
}

export default ManageTeamOfStudent;
