import classNames from 'classnames//bind';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import RefreshToken from '@/method/refreshToken';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '@/redux/token';
import Skeleton from '@/components/skeleton';
import Message from '@/components/message/default';

const cx = classNames.bind(styles);

function LecturersInfoFileReport() {
    const [report, setReport] = useState({});
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const reportId = window.location.href.split('/')[window.location.href.split('/').length - 1];
    const Token = useSelector(selectToken);
    const dispatch = useDispatch();
    const [isLoading, setIsloading] = useState(true);
    const [isDisabled, setIsdisabled] = useState(false);
    const [rate, setRate] = useState(100);
    const [formMessages, setformMessages] = useState([]);
    const [isReload, setIsReLoad] = useState(false);

    useEffect(() => {
        if (!report.isFiling) {
            setIsdisabled(true);
        } else {
            setIsdisabled(false);
        }
    }, [report]);

    useEffect(() => {
        fetch(`${doumainUrl}/lecturers/get-report-reportid`, {
            method: 'GET',
            headers: {
                token: Token,
                reportid: reportId,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();
                if (res.status === 200) {
                    setReport(jsonData);
                    setIsloading(false);
                }

                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }

                if (res.status === 500) {
                    console.log(jsonData);
                    return;
                }
            })
            .catch((error) => console.log(error));
    }, [doumainUrl, reportId, Token, dispatch]);

    function FormatCout(data) {
        let count = data;
        if (data > 100) {
            count = 100;
        }
        if (data < 0) {
            count = 0;
        }

        setRate(count);
    }

    async function Submit() {
        const data = {
            rate: rate,
        };
        setIsdisabled(true);

        const res = await fetch(`${doumainUrl}/lecturers/update-report`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
                reportid: reportId,
            },
            body: JSON.stringify(data),
        });

        setIsdisabled(false);
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
    return !isLoading ? (
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
            <div className={cx('wrapper__indomation-basic')}>
                <div className={cx('infomation')}>
                    <div className={cx('icon_k')}>
                        <svg
                            focusable="false"
                            width="24"
                            height="24"
                            fill=" currentColor"
                            viewBox="0 0 24 24"
                            className=" NMm5M hhikbc"
                        >
                            <path d="M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7z"></path>
                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04a2.008 2.008 0 0 0-1.44 1.19c-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"></path>
                        </svg>
                    </div>

                    <div className={cx('wrapper')}>
                        <h3 className={cx('title')}>{report.title}</h3>
                        <div className={cx('content')}>
                            <div
                                className={cx('jkgh')}
                                style={{
                                    padding: '5px 0 10px 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '14px',
                                }}
                            >
                                <span>{`Ngày tạo • ${report.createAt}`}</span>
                                <span>Hạn nộp báo cáo: {report.deadline}</span>
                            </div>
                            <div>
                                {report.isFiling ? (
                                    <div style={{ fontSize: '14px', padding: '5px 0px 10px' }}>
                                        {report.dateOfFliling <= report.deadline
                                            ? report.teamName + ' • Đã nộp • ' + report.dateOfFliling
                                            : report.teamName + ' • Nộp muộn • ' + report.dateOfFliling}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '14px', padding: '5px 0px 10px' }}>
                                        {report.teamName} • Chưa nộp
                                    </div>
                                )}
                            </div>
                            {report.fileReport ? (
                                <p
                                    className={cx('link')}
                                    onClick={() => {
                                        window.open(`https://docs.google.com/gview?url=${report.fileReport}`);
                                    }}
                                >
                                    File báo cáo
                                </p>
                            ) : (
                                <></>
                            )}
                        </div>
                        <hr style={{ borderBlockColor: 'var(--border-color-5)' }} />
                        <span style={{ padding: '15px 0' }}>{report.note}</span>
                        <hr />
                    </div>
                </div>
                <div className={cx('content__add')} style={{ maxHeight: '204.21px' }}>
                    {isDisabled ? <div className={cx('form__disable')}></div> : <></>}

                    <div className={cx('title')}>Đánh giá báo cáo</div>
                    <div>
                        <h3 style={{ marginBottom: '5px' }}>Mức độ hoàn thành dự án:</h3>
                        <div className="flex" style={{ border: '1px solid var(--border-color-2)' }}>
                            <input
                                value={rate}
                                onChange={(e) => {
                                    FormatCout(e.target.value);
                                }}
                                maxLength={3}
                                max={100}
                                height={0}
                                placeholder="Nhập mức độ hoàn thành"
                                type="number"
                                style={{ borderRadius: '4px', background: 'transparent' }}
                            />
                            <p style={{ width: '50px' }}>%</p>
                        </div>
                    </div>
                    <button className={cx('btn_submit')} style={{ marginTop: '10px' }} onClick={Submit}>
                        Đánh giá
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <div className={cx('container')}>
            <div className={cx('wrapper__indomation-basic')}>
                <div className={cx('infomation')}>
                    <Skeleton width={50} height={50} circle={true} />

                    <div className={cx('wrapper')}>
                        <Skeleton width={100} height={40} percent={true} />
                        <div className={cx('content')}>
                            <div
                                style={{
                                    padding: '5px 0 0px 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '14px',
                                }}
                            >
                                <Skeleton width={200} height={21} />
                                <Skeleton width={220} height={21} />
                            </div>
                            <div
                                style={{
                                    padding: '5px 0 10px 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '14px',
                                }}
                            >
                                <Skeleton width={250} height={21} />
                            </div>
                        </div>
                        <hr style={{ borderBlockColor: 'var(--border-color-5)' }} />
                        <span style={{ padding: '15px 0' }}>
                            <Skeleton width={100} height={30} percent={true} /> <br />
                            <Skeleton width={90} height={30} percent={true} /> <br />
                            <Skeleton width={95} height={30} percent={true} /> <br />
                            <Skeleton width={80} height={30} percent={true} /> <br />
                            <Skeleton width={75} height={30} percent={true} /> <br />
                            <Skeleton width={97} height={30} percent={true} /> <br />
                            <Skeleton width={60} height={30} percent={true} /> <br />
                        </span>
                        <hr />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LecturersInfoFileReport;
