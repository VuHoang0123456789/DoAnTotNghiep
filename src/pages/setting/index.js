import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { faAngleDown, faAngleLeft, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormControlHeader from '@/components/formcontrolheader';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import loaded from '@/method/loaded';
import { BtnUpdate } from '@/components/button';
import { useSelector } from 'react-redux';
import { selectAccount, setAccount } from '@/redux/account';
import Message from '@/components/message/default';
import { useDispatch } from 'react-redux';
import RefreshToken from '@/method/refreshToken';
import { selectToken } from '@/redux/token';

const cx = classNames.bind(styles);

function Setting() {
    const dispath = useDispatch();
    const [isDisabled, setIsDisable] = useState(true);
    const [ishowFormControl, setIshowFormControl] = useState(false);
    const [formMessages, setformMessages] = useState([]);
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const [passWord, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [user, setUser] = useState({
        Id: '',
        email: '',
        showName: '',
        avatar: '',
    });

    const Account = useSelector(selectAccount);
    let ObjectUser = loaded();
    const Token = useSelector(selectToken);
    const Obj = {
        showName: Account.showName,
    };

    useEffect(() => {
        const name = ['Vui lòng nhập tên hiển thị'];
        const InputsName = ['showName'];
        const Messages = document.getElementsByClassName(cx('mesage-js'));
        const Inputs = document.getElementsByClassName(cx('input__platform'));
        for (let i = 0; i < Messages.length; i++) {
            Messages[i].setAttribute('name', name[i]);
        }
        for (let i = 0; i < Inputs.length; i++) {
            Inputs[i].setAttribute('name', InputsName[i]);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('click', () => {
            setIshowFormControl(false);
        });

        return () => {
            window.removeEventListener('click', () => [setIshowFormControl(false)]);
        };
    }, []);

    useEffect(() => {
        if (Account) {
            if (ObjectUser === 'lecturers') {
                setUser({
                    Id: Account.lecturersId,
                    email: Account.email,
                    showName: Account.showName,
                    avatar: Account.avatar,
                });
            } else {
                setUser({
                    Id: Account.studentId,
                    email: Account.email,
                    showName: Account.showName,
                    avatar: Account.avatar,
                });
            }
        }
    }, [Account, ObjectUser]);

    useEffect(() => {
        if (
            passWord.replace(/\s/g, '').length >= 8 &&
            newPassword.replace(/\s/g, '').length >= 8 &&
            confirmNewPassword.replace(/\s/g, '').length >= 8
        ) {
            setIsDisable(false);
        } else {
            setIsDisable(true);
        }
    }, [passWord, newPassword, confirmNewPassword]);

    function UpdateAccount() {
        CallApi(user);
    }

    async function CallApi(data) {
        try {
            const res = await fetch(`${doumainUrl}/account/update-account`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify(data),
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
            }
            if (res.status >= 400 && res.status < 500 && res.status !== 401 && res.status !== 403) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }

            if (res.status === 401 && res.status === 403) {
                RefreshToken(dispath);
                return;
            }

            if (res.status >= 500) {
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

    function UpdatePassWord() {
        if (newPassword === confirmNewPassword) {
            const data = { ...user, passWord: passWord, newPassWord: newPassword };
            setIsDisable(true);
            CallApi(data);
        } else {
            let mesage = {
                title: 'Error',
                content: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
                type: 'error',
            };
            ShowFormMessage(mesage);
        }
    }

    async function UpLoadFile(e) {
        const selectedFile = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            setUser({ ...user, avatar: event.target.result });
        };

        reader.readAsDataURL(selectedFile);
        try {
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            const res = await fetch(`${doumainUrl}/account/update-account-file`, {
                method: 'PUT',
                headers: {
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

                const result = await fetch(`${doumainUrl}/account/get-account`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: Token,
                    },
                });
                const resultJson = await result.json();
                if (result.status === 200) {
                    if (loaded() === 'student') {
                        resultJson.id = resultJson.studentId;
                    }
                    if (loaded() === 'lecturers') {
                        resultJson.id = resultJson.lecturersId;
                    }
                    if (loaded() === 'admin') {
                        resultJson.id = resultJson.Id;
                    }
                    dispath(setAccount(resultJson));
                }
            }

            if (res.status >= 400 && res.status < 500 && res.status !== 401 && res.status !== 403) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }

            if (res.status === 401 && res.status === 403) {
                RefreshToken(dispath);
                return;
            }

            if (res.status >= 500) {
                console.log(jsonData);
            }

            ShowFormMessage(mesage);
            setUser({ ...user, avatar: jsonData.url_avatar });
        } catch (error) {
            console.log(error);
            let mesage = {
                title: 'Error',
                content: 'Cập nhật không thành công',
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

    return (
        <div className={cx('container')}>
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
                            border: '1px solid var(--table-color)',
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
                                user={{ ...Account, id: Account.lecturersId ? Account.lecturersId : Account.studentId }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('content__item', 'title')}>
                    <h2 className="pad-b-10">Thông tin tài khoản cá nhân</h2>
                </div>
                <div className={cx('content__item')}>
                    <div className={cx('item')}>
                        <h3 className="font-size-16">
                            {ObjectUser === 'lecturers' ? 'Mã giảng viên' : 'Mã Sinh viên'}
                        </h3>
                        <input
                            type={'text'}
                            maxLength={10}
                            value={user.Id}
                            onChange={(e) => {
                                setUser({ ...user, Id: e.target.value });
                            }}
                            disabled
                        />
                        <p className={cx('message')}></p>
                    </div>
                </div>
                <div className={cx('content__item')}>
                    <div className={cx('item')}>
                        <h3 className="font-size-16">Địa chỉ email</h3>
                        <input
                            type={'text'}
                            value={user.email}
                            onChange={(e) => {
                                setUser({ ...user, email: e.target.value });
                            }}
                            disabled
                        />
                        <p className={cx('message')}></p>
                    </div>
                </div>
                <div className={cx('content__item')}>
                    <div className={cx('item')}>
                        <h3 className="font-size-16">Tên hiển thị</h3>
                        <input
                            type={'text'}
                            maxLength={100}
                            className="input__platform"
                            placeholder="Nhập tên hiển thị"
                            value={user.showName}
                            onChange={(e) => {
                                setUser({ ...user, showName: e.target.value });
                            }}
                            disabled
                        />
                        <p className={cx('message', 'mesage-js')}></p>
                    </div>
                    <BtnUpdate obj={Obj} UpdateAccount={UpdateAccount} />
                </div>
                <div className={cx('content__item')}>
                    <div className={cx('item')}>
                        <h3 className="font-size-16">Avatar</h3>
                        <input
                            id="btn__change-avatar"
                            type={'file'}
                            accept=".jpg, .png, .gif"
                            className="is-hidden"
                            onChange={UpLoadFile}
                        />
                        <p className="mar-t-10 font-size-14">Nên là ảnh vuông, chấp nhận các tệp: JPG, PNG hoặc GIF</p>
                        <p className={cx('message')}></p>
                    </div>
                    <div
                        style={{
                            background: `url(${user.avatar}) top/cover no-repeat`,
                        }}
                        className={cx('btn__change-avatar')}
                        onClick={() => {
                            const btnChangeAvatar = document.getElementById('btn__change-avatar');
                            btnChangeAvatar.click();
                        }}
                    >
                        <div className={cx('background')}>
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faCamera} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('form__change-password')}>
                    <div
                        className={cx('btn__change-pass')}
                        onClick={(e) => {
                            e.stopPropagation();
                            const formChangePassword = document.getElementsByClassName(cx('form__password-content'))[0];
                            if (formChangePassword.classList.contains('is-hidden')) {
                                formChangePassword.classList.remove('is-hidden');
                            } else {
                                formChangePassword.classList.add('is-hidden');
                            }
                        }}
                    >
                        <div>Đổi mật khẩu</div>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                    <div className={cx('form__password-content', 'is-hidden')}>
                        <input
                            maxLength={50}
                            type="password"
                            value={passWord}
                            placeholder="Mật khẩu hiện tại"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <input
                            maxLength={50}
                            type="password"
                            value={newPassword}
                            placeholder="Mật khẩu mới"
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                            }}
                        />
                        <input
                            maxLength={50}
                            type="password"
                            value={confirmNewPassword}
                            placeholder="Xác nhận mật khẩu mới"
                            onChange={(e) => {
                                setConfirmNewPassword(e.target.value);
                            }}
                        />
                        <button className={cx('btn__update-password')} disabled={isDisabled} onClick={UpdatePassWord}>
                            Cập nhật mật khẩu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Setting;
