import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Message from '@/components/message/default';
import RefreshToken from '@/method/refreshToken';

const cx = classNames.bind(styles);

function Login() {
    const [isResetPassWord, setIsResetPassWord] = useState(false); // chuyển trang reset password
    const [usename, setUseName] = useState(''); //tên đăng nhập
    const [password, setPassWord] = useState(''); // mật khẩu
    const [otp, setOTP] = useState(''); // mã otp
    const [object, setOject] = useState(''); //kiểu người dùng
    const countOtp = useRef(300); // biến đếm thời gian otp hợp lệ
    const IntervalId = useRef(0); // id interval đếm thời gian hợp lệ của otp
    const [count, setCount] = useState('Gửi mã'); // biến hiển thị thời gian tồn tịa otp
    const doumainUrl = useRef(process.env.REACT_APP_DOUMAIN_URL); // biến tên miên api
    const [typeAccount, setTypeAccount] = useState(2); // kiểu tài khoản
    const [isbtnOtpDisabled, setisbtnOtpDisabled] = useState(true); // điểu chỉnh sự bật tắt của nút send otp
    const [isBtnLoginDisabled, setisbtnLoginDisabled] = useState(true); // điểu chỉnh sự bật tắt của button login
    const [formMessages, setformMessages] = useState([]);

    useEffect(() => {
        const inputId = document.getElementById(cx('ID'));
        const url = window.location.href;
        const arr = url.split('/');

        if (arr.includes('student')) {
            setOject('student');
        }

        if (arr.includes('lecturers')) {
            setOject('lecturers');
        }

        if (arr.includes('admin')) {
            setOject('admin');
        }

        if (object === 'lecturers') {
            inputId.placeholder = 'Mã giảng viên/ email';
            setTypeAccount(1);
        }
        if (object === 'admin') {
            inputId.placeholder = 'Mã quản trị viên/ email';
            setTypeAccount(0);
        }

        if (JSON.parse(sessionStorage.getItem(object))) {
            window.location.replace(`/${object}`);
        }
    }, [object]);

    useEffect(() => {
        if (countOtp.current <= 0) {
            clearInterval(IntervalId.current); // xóa vòng lặp interval
            setisbtnOtpDisabled(false); // enabled button send otp
            countOtp.current = 300; // reset variables countotp
            setCount('Gửi mã'); // reset text button send ôtp
        }
    }, [countOtp, count]);

    useEffect(() => {
        if (password.length >= 8 && usename.length >= 10) {
            setisbtnOtpDisabled(false); // enable button send otp
        } else {
            setisbtnOtpDisabled(true); // disable button send otp
        }
    }, [password, usename]);

    useEffect(() => {
        if (password.length >= 8 && usename.length >= 10 && otp.length >= 4) {
            setisbtnLoginDisabled(false); // enable button login
        } else {
            setisbtnLoginDisabled(true); // disable button login
        }
    }, [password, usename, otp]);

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

    // component Bottom
    function Bottom() {
        return !isResetPassWord ? (
            <div className={cx('wrapper', 'mar-t-15', 'mar-b-30')}>
                <div className="font-size-14 font-weight-400">
                    Bạn chưa có tài khoản?
                    <Link to={`/${object}/register`}>
                        <span className="primary-color font-weight-600"> Đăng ký</span>
                    </Link>
                </div>
                <div
                    className="font-size-14 primary-color font-weight-600 cursor"
                    onClick={() => {
                        setIsResetPassWord(true);
                        setOTP('');
                        setPassWord('');

                        clearInterval(IntervalId.current);
                        setisbtnOtpDisabled(false);
                        countOtp.current = 300;
                        setCount('Gửi mã');
                    }}
                >
                    Quên mật khẩu?
                </div>
            </div>
        ) : (
            ''
        );
    }

    function validate(evt) {
        var e = evt || window.event;
        var key = e.keyCode || e.which;

        if (
            (!e.shiftKey &&
                !e.altKey &&
                !e.ctrlKey &&
                // numbers
                key >= 48 &&
                key <= 57) ||
            // Numeric keypad
            (key >= 96 && key <= 105) ||
            // Backspace and Tab and Enter
            key === 8 ||
            key === 9 ||
            key === 13 ||
            // Home and End
            key === 35 ||
            key === 36 ||
            // left and right arrows
            key === 37 ||
            key === 39 ||
            // Del and Ins
            key === 46 ||
            key === 45
        ) {
            // input is VALID
        } else {
            // input is INVALID
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
        }
    }

    // Đăng nhập, quên mật khẩu
    async function handleClick() {
        let regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
        //config data gửi lên server
        let data = {
            passWord: password,
            otp: otp,
            typeAccount: typeAccount,
        };

        if (!regex.test(usename)) {
            data = { ...data, Id: usename };
        } else {
            data = { ...data, email: usename };
        }

        try {
            let result;
            if (isResetPassWord) {
                result = await ForgotPassWord(data);
            } else {
                result = await LoginAccount(data);
            }
            if (result) {
                setisbtnLoginDisabled(false);
            }
            const res = result.res;
            const jsonData = result.jsonData;

            let mesage = {
                title: '',
                content: '',
                type: '',
            };
            if (res.status === 400 || res.status === 500) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
                ShowFormMessage(mesage);
            }
            if (res.status === 401 || res.status === 403) {
                RefreshToken();
                return;
            }
            if (res.status === 200) {
                let mesage = {
                    title: 'Success',
                    content: jsonData.msg,
                    type: 'success',
                };

                clearInterval(IntervalId.current);
                setisbtnOtpDisabled(false);
                countOtp.current = 300;
                setCount('Gửi mã');

                ShowFormMessage(mesage);
            }

            if (res.status === 201) {
                clearInterval(IntervalId.current);
                setisbtnOtpDisabled(false);
                countOtp.current = 300;
                setCount('Gửi mã');

                if (!isResetPassWord) {
                    sessionStorage.setItem(object, JSON.stringify(jsonData)); // lưu thông tin vào sessionStorage
                    window.location.replace(`/${object}`); // chuyển hướng
                }
            }
        } catch (error) {
            let mesage = {
                title: 'Error',
                content: 'Đăng nhập không thành công, vui lòng kiểm tra lại thông tin',
                type: 'error',
            };
            setisbtnOtpDisabled(false);
            ShowFormMessage(mesage);
        }
    }
    // đăng nhập
    async function LoginAccount(data) {
        const res = await fetch(`${doumainUrl.current}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const jsonData = await res.json();
        return {
            res,
            jsonData,
        };
    }
    // forgot password
    async function ForgotPassWord(data) {
        const res = await fetch(`${doumainUrl.current}/account/forgot-password`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const jsonData = await res.json();
        return {
            res,
            jsonData,
        };
    }
    // gửi mã otp cho người dùng
    async function SendOTP() {
        let regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');

        let data = {
            typeAccount: typeAccount,
            passWord: password,
        };

        if (!regex.test(usename)) {
            data = { ...data, Id: usename }; // người dùng đăng nhập bằng id
        } else {
            data = { ...data, email: usename }; // người dùng đăng nhập bằng email
        }

        setisbtnOtpDisabled(true);

        // send otp
        try {
            const res = await fetch(`${doumainUrl.current}/auth/send-otp`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const jsonData = await res.json();

            let mesage = {
                title: '',
                content: '',
                type: '',
            };
            if (res.status === 201) {
                // show form message
                mesage.title = 'Success';
                mesage.content = jsonData.msg;
                mesage.type = 'success';

                IntervalId.current = setInterval(() => {
                    countOtp.current = countOtp.current - 1;
                    setCount(countOtp.current);
                }, 1000); // tạo vòng lặp hiển thị thời gian tồn tại của token
            } else {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
                setisbtnOtpDisabled(false);
            }

            ShowFormMessage(mesage);
        } catch (error) {
            setisbtnOtpDisabled(false);
            let mesage = {
                title: 'Error',
                content: 'Gửi mã otp không thành công, vui lòng thử lại',
                type: 'error',
            };

            ShowFormMessage(mesage);
        }
    }

    return (
        <div className="container" style={{ position: 'relative', overflow: 'hidden' }}>
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
            <div className={cx('form__login')}>
                {isResetPassWord ? (
                    <div
                        className={cx('form__login-back')}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsResetPassWord(false);
                            setOTP('');

                            clearInterval(IntervalId.current);
                            setisbtnOtpDisabled(false);
                            countOtp.current = 300;
                            setCount('Gửi mã');
                        }}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                ) : (
                    ''
                )}
                <div className={cx('wrapper', 'mar-b-15')}>
                    <div className={cx('logo')}></div>
                    <h1 className={cx('title')}>{!isResetPassWord ? 'Đăng nhập' : 'Lấy lại mật khẩu'}</h1>
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('wrapper_input')}>
                        <input
                            id="ID"
                            placeholder="Mã sinh viên/email"
                            maxLength={100}
                            value={usename}
                            onChange={(e) => {
                                setUseName(e.target.value);
                            }}
                        />
                    </div>

                    <div className={cx('wrapper_input')} maxLength={100}>
                        <input
                            type="password"
                            placeholder={!isResetPassWord ? 'Mật khẩu' : 'Mật khẩu mới'}
                            value={password}
                            maxLength={50}
                            onChange={(e) => {
                                setPassWord(e.target.value);
                            }}
                        />
                    </div>

                    <div className={cx('wrapper_sendOTP')}>
                        <input
                            placeholder="Nhập mã xác nhận"
                            className="transperent mar-r-10"
                            value={otp}
                            maxLength={4}
                            onKeyDown={validate}
                            onChange={(e) => {
                                setOTP(e.target.value);
                            }}
                        />
                        <button className={cx('btn-sendOTP')} disabled={isbtnOtpDisabled} onClick={SendOTP}>
                            {typeof count === 'string' ? count : `${count}s`}
                        </button>
                    </div>

                    <div className={cx('wrapper_input')}>
                        <button
                            className={cx('btn-login', 'btn-login__active')}
                            disabled={isBtnLoginDisabled}
                            onClick={() => {
                                setisbtnLoginDisabled(true);
                                handleClick();
                            }}
                        >
                            {!isResetPassWord ? 'Đăng nhập' : 'Xác nhận'}
                        </button>
                    </div>
                </div>
                <Bottom />
            </div>
        </div>
    );
}

export default Login;
