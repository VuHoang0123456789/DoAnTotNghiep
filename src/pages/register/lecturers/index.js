import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import FormLecturers from '@/pages/lecturersInformation';
import RefreshToken from '@/method/refreshToken';
import { useSelector } from 'react-redux';
import { selectUserObject } from '@/redux/userobject';
import Message from '@/components/message/default';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import loaded from '@/method/loaded';
import { selectToken } from '@/redux/token';
import { useDispatch } from 'react-redux';
import Skeleton from '@/components/skeleton';

const cx = classNames.bind(styles);
function RegisterLecturers() {
    const [index, setIndex] = useState();
    const [lecturers, setLecturers] = useState([]);
    const [lecturersSearch, setLecturersSearch] = useState([]);
    const [lecturersRoot, setLecturersRoot] = useState([]);
    const [selectedLecturers, setSelectedLecturers] = useState({});
    const [nameValueSearch, setNameValueSearch] = useState('');
    const [specializedValueSearch, setSpecializedValueSearch] = useState('');
    const [team, setTeam] = useState({});
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const stageId = useSelector(selectUserObject);
    const [isShowFormLecturers, setIsShowFormLecturers] = useState(false);
    const [formMessages, setformMessages] = useState([]);
    const [isShowFormSearchByName, setIsShowFormSearchByName] = useState(false);
    const [isShowFormSearchBySpecilized, setIsShowFormSearchBySpecilized] = useState(false);
    const object = loaded();
    const Token = useSelector(selectToken);
    const dispatch = useDispatch();
    const arrs = new Array(7).fill(7);
    const [isDisable, setIsDisable] = useState(false);
    const [isLoading, setIsloading] = useState(true);

    const user = {
        title: 'Thông tin giảng viên',
        arr: [
            {
                title: 'Tên giảng viên: ',
                value: selectedLecturers.name,
            },
            {
                title: 'Ngày sinh: ',
                value: selectedLecturers.birthDay,
            },
            {
                title: 'Học hàm, học vị: ',
                value: selectedLecturers.AcademicLevel,
            },
            {
                title: 'Chuyên ngành hướng dẫn: ',
                value: selectedLecturers.specialized,
            },
            {
                title: 'Ngôn ngữ hướng dẫn: ',
                value: selectedLecturers.lenguageIntruduce,
            },
            {
                title: 'Số lượng nhóm có thể nhận: ',
                value: selectedLecturers.count,
            },
        ],
        link: {
            url: selectedLecturers.background_url,
            title: 'Download để xem thêm thông tin về giảng viên(bấm vào đây để download)',
        },
        image_url: selectedLecturers.image_url,
    };

    useEffect(() => {
        if (stageId.STT !== 2) {
            return;
        }
        window.addEventListener('click', () => {
            setIsShowFormSearchByName(false);
            setIsShowFormSearchBySpecilized(false);
        });

        const Rows = document.getElementsByClassName('js-row');
        for (let i = 0; i < Rows.length; i++) {
            Rows[i].setAttribute('index', i);
        }

        return () => {
            window.removeEventListener('click', () => {
                setIsShowFormSearchByName(false);
                setIsShowFormSearchBySpecilized(false);
            });
        };
    }, [stageId]);

    useEffect(() => {
        if (stageId.STT !== 2) {
            return;
        }
        //get all lecturers
        fetch(`${doumainUrl}/lecturers/get-all-lecturers/pairing-1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();
                if (res.status >= 500) {
                    console.log(jsonData);
                    return;
                }

                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
                setIsloading(false);
                jsonData.forEach((item) => {
                    const birthDay = new Date(item.birthDay);
                    item.birthDay = [
                        birthDay.getDate() < 10 ? '0' + birthDay.getDate() : birthDay.getDate(),
                        birthDay.getMonth() + 1 < 10 ? '0' + (birthDay.getMonth() + 1) : birthDay.getMonth() + 1,
                        birthDay.getFullYear(),
                    ].join('/');
                }); // format giá trị thời gian

                setLecturersRoot(jsonData);
                setLecturersSearch(jsonData);
                setLecturers(jsonData); // set giá trị lecturers
            })
            .catch((error) => {
                console.log(error);
            });

        //get team
        fetch(`${doumainUrl}/student/get-team-studentid`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();
                if (res.status >= 500) {
                    console.log(jsonData);
                    return;
                }

                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                }
                if (res.status === 200) {
                    setTeam(jsonData);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [doumainUrl, object, dispatch, Token, stageId]);

    function handleActive(e, i) {
        let RowActive = e.target;
        const Rows = document.getElementsByClassName('js-row');
        const RowBottom = document.getElementsByClassName(cx('row__bottom'));

        if (RowActive.nodeName !== 'LI') {
            while (RowActive.nodeName !== 'LI') {
                RowActive = RowActive.parentElement;
            }
        }

        setIndex(i);
        if (i !== index) {
            if (Rows[index] !== undefined) {
                Rows[index].classList.remove(cx('active'));
                RowBottom[index].style.display = 'none';
            }
        }

        RowActive.classList.add(cx('active'));
        RowBottom[i].style.display = 'flex';

        setSelectedLecturers(lecturers[i]);
    }

    function handleUnActive() {
        let RowActive = document.querySelectorAll('li');
        const RowBottom = document.getElementsByClassName(cx('row__bottom'));

        if (index !== undefined) {
            RowActive[index].classList.remove(cx('active'));
            RowBottom[index].style.display = 'none';
        }
    }

    async function registerLecturers() {
        setIsDisable(true);
        const data = {
            lecturersId: selectedLecturers.lecturersRegistedId,
            teamId: team.MaNhom,
            stageId: stageId.Id,
        };

        const res = await fetch(`${doumainUrl}/student/add-new-pairing`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                token: Token,
            },
        });
        setIsDisable(false);
        const jsonData = await res.json();
        let mesage = {
            title: '',
            content: '',
            type: '',
        };

        if (res.status === 201) {
            mesage.title = 'Success';
            mesage.content = jsonData.msg;
            mesage.type = 'success';
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

    return stageId.STT === 2 ? (
        !isLoading ? (
            <div
                className={cx('wrapper_home')}
                onClick={() => {
                    handleUnActive();
                }}
            >
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
                {isShowFormLecturers ? (
                    <FormLecturers
                        SetIsShowFormLecturers={setIsShowFormLecturers}
                        user={user}
                        title={'Thông tin giảng viên'}
                    />
                ) : (
                    ''
                )}
                <div className={cx('home', 'mar-b-50')}>
                    <div
                        className={cx('title')}
                        style={{ paddingBottom: '40px', display: 'flex', justifyContent: 'center' }}
                    >
                        <h2> Danh sách giảng viên đăng ký hướng dẫn</h2>
                    </div>
                    <div className="flex">
                        <div
                            className={cx('item__search')}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsShowFormSearchBySpecilized(false);
                                setIsShowFormSearchByName(!isShowFormSearchByName);
                            }}
                        >
                            <p
                                id="nameValueSearch"
                                style={{
                                    whiteSpace: 'nowrap',
                                    maxWidth: '160px',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                }}
                            >
                                Tên giảng viên
                            </p>
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faCaretDown} />
                            </div>
                            {isShowFormSearchByName ? (
                                <div
                                    className={cx('form__controll')}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <div className={cx('input__search')}>
                                        <input
                                            value={nameValueSearch}
                                            placeholder="Nhập từ tìm kiếm"
                                            onChange={(e) => {
                                                let arr = lecturersRoot.filter((lecturer) => {
                                                    return lecturer.name.includes(e.target.value);
                                                });
                                                setNameValueSearch(e.target.value);
                                                setLecturersSearch(arr);
                                            }}
                                        />
                                    </div>
                                    <hr />
                                    <ul>
                                        {lecturersSearch.map((lecturer, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    onClick={(e) => {
                                                        let arr = lecturersRoot.filter((lecturer) => {
                                                            setNameValueSearch(e.target.innerText);
                                                            return lecturer.name.includes(e.target.innerText);
                                                        });
                                                        document.getElementById('nameValueSearch').innerText =
                                                            e.target.innerText;
                                                        setLecturers(arr);
                                                    }}
                                                >
                                                    {lecturer.name}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div
                            className={cx('item__search')}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsShowFormSearchByName(false);
                                setIsShowFormSearchBySpecilized(!isShowFormSearchBySpecilized);
                            }}
                        >
                            <p
                                id="specializedValueSearch"
                                style={{
                                    whiteSpace: 'nowrap',
                                    maxWidth: '160px',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                }}
                            >
                                Chuyên ngành hướng dẫn
                            </p>
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faCaretDown} />
                            </div>
                            {isShowFormSearchBySpecilized ? (
                                <div
                                    className={cx('form__controll')}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <div className={cx('input__search')}>
                                        <input
                                            placeholder="Nhập từ tìm kiếm"
                                            value={specializedValueSearch}
                                            onChange={(e) => {
                                                let arr = lecturersRoot.filter((lecturer) => {
                                                    return lecturer.specialized.includes(e.target.value);
                                                });
                                                setSpecializedValueSearch(e.target.value);
                                                setLecturersSearch(arr);
                                            }}
                                        />
                                    </div>
                                    <hr />
                                    <ul>
                                        {lecturersSearch.map((lecturer, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    onClick={(e) => {
                                                        let arr = lecturersRoot.filter((lecturer) => {
                                                            setSpecializedValueSearch(e.target.innerText);
                                                            return lecturer.specialized.includes(e.target.innerText);
                                                        });
                                                        document.getElementById('specializedValueSearch').innerText =
                                                            e.target.innerText;
                                                        setLecturers(arr);
                                                    }}
                                                >
                                                    {lecturer.specialized}
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
                    <div className={cx('table')}>
                        <div className={cx('table__header')}>
                            <div className={cx('header__column', 'width-30')}>
                                <span className="mar-l-10">Họ và tên</span>
                            </div>
                            <div className={cx('header__column', 'width-35')}>
                                <span className="mar-l-10">Chuyên ngành hướng dẫn</span>
                            </div>
                            <div className={cx('header__column', 'width-20')}>
                                <span className="mar-l-10">Ngôn ngữ hướng dẫn</span>
                            </div>
                            <div className={cx('header__column', 'width-15')}>
                                <span className="mar-r-10  text-right width-100">Học hàm/ học vị</span>
                            </div>
                        </div>
                        <hr />
                        <div className={cx('table__content')}>
                            <ul>
                                {lecturers.map((lecturer, index) => {
                                    return (
                                        <li
                                            className="js-row"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleActive(e, index);
                                            }}
                                            key={index}
                                        >
                                            <div className={cx('table__content-row')}>
                                                <div className={cx('content-column', 'width-30')}>
                                                    <span className="mar-l-10">{lecturer.name}</span>
                                                </div>
                                                <div className={cx('content-column', 'width-35')}>
                                                    <span className="mar-l-10">{lecturer.specialized}</span>
                                                </div>
                                                <div className={cx('content-column', 'width-20')}>
                                                    <span className="mar-l-10">{lecturer.lenguageIntruduce}</span>
                                                </div>
                                                <div className={cx('content-column', 'width-15')}>
                                                    <span className="mar-r-10 text-right width-100">
                                                        {lecturer.AcademicLevel}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={cx('row__bottom')}>
                                                <button
                                                    className={cx('row__bottom-btn', 'btn__see')}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUnActive();
                                                        setIsShowFormLecturers(true);
                                                    }}
                                                >
                                                    Xem thông tin
                                                </button>

                                                <button
                                                    disabled={isDisable}
                                                    className={cx('row__bottom-btn', 'btn__register')}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUnActive();
                                                        registerLecturers();
                                                    }}
                                                >
                                                    Đăng ký
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
        ) : (
            <div className={cx('wrapper_home')}>
                <div className={cx('home', 'mar-b-50')}>
                    <div
                        className={cx('title')}
                        style={{ paddingBottom: '40px', display: 'flex', justifyContent: 'center' }}
                    >
                        <Skeleton width={500} height={40} />
                    </div>
                    <div className="flex">
                        <Skeleton width={151} height={40} />
                        <div style={{ width: '10px', height: '10px' }}></div>
                        <Skeleton width={200} height={40} />
                    </div>
                    <div className={cx('table')}>
                        <div style={{ height: '10px', width: '5px' }}></div>
                        <Skeleton width={1157} height={40} />
                        <div>
                            <ul>
                                {arrs.map((arr, index) => {
                                    return (
                                        <li key={index}>
                                            <div style={{ height: '10px', width: '5px' }}></div>
                                            <Skeleton width={1157} height={40} />
                                        </li>
                                    );
                                })}
                            </ul>
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
            Hiện tại không phải khoảng thời gian diễn ra giai đoạn đăng ký giảng viên hướng dẫn, vui lòng quay trở lại
            sau
        </div>
    );
}

export default RegisterLecturers;
