import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Message from '@/components/message/default';
import RefreshToken from '@/method/refreshToken';
import loaded from '@/method/loaded';

const cx = classNames.bind(styles);

function Register() {
    const [userId, setUserId] = useState(''); // id của người dùng
    const [usename, setUseName] = useState(''); // tên đăng nhập
    const [password, setPassWord] = useState(''); // mật khẩu
    const [otp, setOTP] = useState(''); // mã otp
    const [object, setOject] = useState(''); // kiểu người dùng
    const countOtp = useRef(300); // biến đếm thời gian otp hợp lệ
    const IntervalId = useRef(0); // id interval đếm thời gian hợp lệ của otp
    const doumainUrl = useRef(process.env.REACT_APP_DOUMAIN_URL); // biến tên miên api
    const [typeAccount, setTypeAccount] = useState(2); // kiểu tài khoản
    const [count, setCount] = useState('Gửi mã'); //  biến hiển thị thời gian tồn tịa otp
    const [isbtnOtpDisabled, setisbtnOtpDisabled] = useState(true); // điểu chỉnh sự bật tắt của nút send otp
    const [isBtnLoginDisabled, setisbtnLoginDisabled] = useState(true); // điểu chỉnh sự bật tắt cảu button login
    const [isInputDisabled, setIsInputDisabled] = useState(false); // điều chỉnh sự bật tắt input
    const [formMessages, setformMessages] = useState([]);

    useEffect(() => {
        const inputId = document.getElementById(cx('ID'));
        const url = window.location.href;
        const arr = url.split('/');
        // set kiểu người dùng
        if (arr.includes('student')) {
            setOject('student');
        }

        if (arr.includes('admin')) {
            setOject('admin');
        }

        if (arr.includes('lecturers')) {
            setOject('lecturers');
        }

        if (object === 'lecturers') {
            inputId.placeholder = 'Mã giảng viên';
            setTypeAccount(1);
        }
        if (object === 'admin') {
            inputId.placeholder = 'Mã quản trị viên';
            setTypeAccount(0);
        }
        // kiểm tra đã đăng nhập chưa, rồi thid chuyển hướng
        if (JSON.parse(sessionStorage.getItem(object))) {
            window.location.replace(`/${object}`);
        }
    }, [object]);

    useEffect(() => {
        if (countOtp.current <= 0) {
            clearInterval(IntervalId.current); // xóa vòng lặp interval
            setisbtnOtpDisabled(false); // enabled button send otp
            setIsInputDisabled(false); // enable input
            countOtp.current = 300; // reset variables countotp
            setCount('Gửi mã'); // reset text button send ôtp
        }
    }, [countOtp, count]);

    useEffect(() => {
        if (password.length >= 8 && usename.length >= 10 && userId.length >= 10) {
            setisbtnOtpDisabled(false);
        } else {
            setisbtnOtpDisabled(true); // disable button send otp
        }
    }, [password, usename, userId]);

    useEffect(() => {
        if (password.length >= 8 && usename.length >= 10 && userId.length >= 10 && otp.length >= 4) {
            setisbtnLoginDisabled(false);
        } else {
            setisbtnLoginDisabled(true); // disable button login
        }
    }, [password, usename, userId, otp]);

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

    //send otp
    async function sendOTP() {
        setisbtnOtpDisabled(true);
        let data = {
            Id: userId,
            email: usename,
            typeAccount: typeAccount,
            passWord: password,
        };

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
                mesage.title = 'Success';
                mesage.content = jsonData.msg;
                mesage.type = 'success';
                // thay đổi props form mesage

                setIsInputDisabled(true);
                IntervalId.current = setInterval(() => {
                    countOtp.current = countOtp.current - 1;
                    setCount(countOtp.current);
                }, 1000); // tạo vòng lặp đếm thời gian tồn tại của mã otp
            }

            if (res.status === 400) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
                setisbtnOtpDisabled(false);
            }

            if (res.status === 401 || res.status === 403) {
                setisbtnOtpDisabled(false);
                RefreshToken();
                return;
            }

            if (res.status >= 500) {
                console.log(jsonData);
                setisbtnOtpDisabled(false);
                return;
            }

            ShowFormMessage(mesage);
        } catch (error) {
            setisbtnOtpDisabled(false);
            let mesage = {
                title: 'Error',
                content: 'Gửi mã otp không thành công',
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

    async function RegisterAccout() {
        const errorMessage = document.getElementsByClassName(cx('error_message'))[0];

        let regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
        if (regex.test(usename)) {
            errorMessage.style.display = 'none';
            setisbtnOtpDisabled(true);
            let data = {
                Id: userId,
                email: usename,
                typeAccount: typeAccount,
                passWord: password,
                otp: otp,
            };

            try {
                // Đăng ký
                const res = await fetch(`${doumainUrl.current}/account/register`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                setisbtnLoginDisabled(false);
                setIsInputDisabled(false); // enable input
                let mesage = {
                    title: '',
                    content: '',
                    type: '',
                };

                if (res.status === 400) {
                    const jsonData = await res.json();
                    mesage.title = 'Error';
                    mesage.content = jsonData.msg;
                    mesage.type = 'error';

                    ShowFormMessage(mesage);
                }

                if (res.status === 401 || res.status === 403) {
                    RefreshToken();
                    return;
                }

                if (res.status >= 500) {
                    const jsonData = await res.json();
                    console.log(jsonData);
                    return;
                }

                if (res.status === 201) {
                    clearInterval(IntervalId.current); // xóa vòng lặp interval
                    setisbtnOtpDisabled(false); // enabled button send otp
                    countOtp.current = 300; // reset variables countotp
                    setCount('Gửi mã'); // reset text button send otp

                    // Khi tạo tài khoản xong thì đăng nhập
                    const res = await fetch(`${doumainUrl.current}/auth/login/no-otp`, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (res.status === 201) {
                        const jsonData = await res.json();
                        sessionStorage.setItem(object, JSON.stringify(jsonData)); // thêm thông tin vào session localstore
                        window.location.replace(`/${object}`); // redirect
                    }
                }
            } catch (error) {
                let mesage = {
                    title: 'Error',
                    content: 'Đăng ký tài khoản không thành công',
                    type: 'error',
                };

                ShowFormMessage(mesage);
            }
        } else {
            errorMessage.style.display = 'block';
        }
    }

    return (
        <div className="container" style={{ overflow: 'hidden', position: 'relative' }}>
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
                <div className={cx('wrapper', 'mar-b-15')}>
                    <div className={cx('logo')}></div>
                    <h1 className={cx('title')}>Đăng ký tài khoản</h1>
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('wrapper_input')}>
                        <input
                            id="ID"
                            placeholder="Mã sinh viên"
                            maxLength={10}
                            value={userId}
                            onKeyDown={loaded() === 'student' ? validate : () => {}}
                            onChange={(e) => {
                                setUserId(e.target.value);
                            }}
                            disabled={isInputDisabled}
                        />
                    </div>
                    <div className={cx('wrapper_input')}>
                        <input
                            placeholder="Địa chỉ email"
                            maxLength={100}
                            value={usename}
                            onChange={(e) => {
                                setUseName(e.target.value);
                            }}
                            disabled={isInputDisabled}
                        />
                        <div className={cx('error_message')}>Địa chỉ email không đúng, vui lòng kiểm tra lại</div>
                    </div>
                    <div className={cx('wrapper_input')} maxLength={100}>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            maxLength={50}
                            value={password}
                            onChange={(e) => {
                                setPassWord(e.target.value);
                            }}
                            disabled={isInputDisabled}
                        />
                    </div>
                    <span className={cx('font-size-12', 'suggest')}>Gợi ý: Mật khẩu cần có ít nhất 8 ký tự</span>
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
                        <button className={cx('btn-sendOTP')} disabled={isbtnOtpDisabled} onClick={sendOTP}>
                            {typeof count === 'string' ? count : `${count}s`}
                        </button>
                    </div>
                    <div className={cx('wrapper_input')}>
                        <button
                            className={cx('btn-login', 'btn-login__active')}
                            disabled={isBtnLoginDisabled}
                            onClick={RegisterAccout}
                        >
                            Đăng ký
                        </button>
                    </div>
                </div>
                <div className={cx('wrapper', 'mar-t-15', 'mar-b-30')}>
                    <div className="font-size-14 font-weight-400">
                        Bạn đã có tài khoản?
                        <Link to={`/${object}/login`}>
                            <span className="primary-color font-weight-600"> Đăng nhập</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
