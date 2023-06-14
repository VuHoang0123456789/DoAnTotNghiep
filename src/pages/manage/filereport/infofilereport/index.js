import classNames from 'classnames//bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Message from '@/components/message/default';
import RefreshToken from '@/method/refreshToken';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '@/redux/token';
import Skeleton from '@/components/skeleton';
import { selectUserObject } from '@/redux/userobject';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

const cx = classNames.bind(styles);

function InfoFileReport() {
    const [report, setReport] = useState({});
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const [path, setPath] = useState({});
    const [isShow, setIshow] = useState(false);
    const [formMessages, setformMessages] = useState([]);
    const [isReload, setIsRepoad] = useState(false);
    const reportId = window.location.href.split('/')[window.location.href.split('/').length - 1];
    const Token = useSelector(selectToken);
    const dispatch = useDispatch();
    const [isDisabled, setIsDisable] = useState(false);
    const [isLoading, setIsloading] = useState(true);
    const stageId = useSelector(selectUserObject);

    useEffect(() => {
        if (stageId === '') {
            return;
        }
        fetch(`${doumainUrl}/student/get-report-reportid`, {
            method: 'GET',
            headers: {
                token: Token,
                teamid: reportId,
                stageid: stageId.Id,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();

                if (res.status === 200) {
                    if (jsonData.fileReport) {
                        const names = jsonData.fileReport.split('/');
                        const name = names[names.length - 1];
                        setPath({ name: name });
                        setIshow(true);
                    }

                    setReport(jsonData);
                    setIsloading(false);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            })
            .catch((error) => console.log(error));
    }, [doumainUrl, isReload, reportId, Token, dispatch, stageId]);

    function GettopicName() {
        return new Promise((reslove, reject) => {
            if (stageId.STT === 4) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const content = e.target.result;
                    var doc = new Docxtemplater(new PizZip(content));
                    var text = doc.getFullText();
                    const arr = text.split('Tên dự án');
                    const topicName = arr[1].split('Mục tiêu dự án')[0];
                    reslove(topicName);
                };
                reader.readAsBinaryString(path);
            }
        });
    }

    async function Submit() {
        let topicName = await GettopicName();

        try {
            const data = new FormData();
            data.append('uploadfile', path);
            setIsDisable(true);

            const res = await fetch(`${doumainUrl}/student/upload-file-report`, {
                method: 'PUT',
                headers: {
                    token: Token,
                    teamid: reportId,
                    stageid: stageId.Id,
                },
                body: data,
            });
            setIsDisable(false);
            const jsonData = await res.json();

            let mesage = {
                title: '',
                content: '',
                type: '',
            };

            if (res.status === 200) {
                if (!topicName) {
                    return;
                }
                const result = await fetch(`${doumainUrl}/student/update-researchfield-topic-name`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        token: Token,
                        teamid: reportId,
                    },
                    body: JSON.stringify({ topicName: topicName }),
                });

                if (result.status === 200) {
                    setIsRepoad(!isReload);
                }

                mesage.title = 'Success';
                mesage.content = jsonData.msg;
                mesage.type = 'success';
            }

            if (res.status === 400 || res.status === 404) {
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
                                    padding: '5px 0 0px 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '14px',
                                }}
                            >
                                <span>{`${report.lecturersName.join(', ')} • ${report.createAt}`}</span>
                                <span>Hạn nộp báo cáo: {report.deadline}</span>
                            </div>
                            {report.isFiling ? (
                                <div
                                    style={{
                                        padding: '5px 0 10px 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '14px',
                                    }}
                                >
                                    <span>Ngày nộp: {report.dateOfFliling}</span>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <hr style={{ borderBlockColor: 'var(--border-color-5)' }} />
                        <span style={{ padding: '15px 0' }}>{report.note}</span>
                        <hr />
                    </div>
                </div>
                <div className={cx('content__add')}>
                    {isDisabled ? <div className={cx('form__disable')}></div> : <></>}

                    <div className={cx('title')}>Thêm file báo cáo</div>
                    {!isShow ? (
                        <div
                            className={cx('btn_add')}
                            onClick={() => {
                                const AddFile = document.getElementById('add-file');
                                AddFile.click();
                            }}
                        >
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                            Thêm mới
                        </div>
                    ) : (
                        <div
                            className={cx('form__file')}
                            onClick={() => {
                                window.open(`https://docs.google.com/gview?url=${report.fileReport}`);
                            }}
                        >
                            <span>{path ? path.name : ''}</span>
                            <div
                                className={cx('icon')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIshow(false);
                                    setPath({});
                                }}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        </div>
                    )}

                    <div
                        className={cx('btn_submit')}
                        onClick={(e) => {
                            e.stopPropagation();
                            Submit();
                        }}
                    >
                        {!report.isFiling ? 'Nộp' : 'Cập nhật'}
                    </div>
                    <input
                        type="file"
                        className="is-hidden"
                        id="add-file"
                        onChange={(e) => {
                            setPath(e.target.files[0]);
                            setIshow(true);
                        }}
                    />
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
                <div className={cx('content__add')}>
                    <Skeleton width={70} height={33} percent={true} />
                    <div style={{ height: '5px', width: '5px' }}></div>
                    <Skeleton width={100} height={38.6} percent={true} /> <br />
                    <div style={{ height: '10px', width: '5px' }}></div>
                    <Skeleton width={100} height={37} percent={true} /> <br />
                </div>
            </div>
        </div>
    );
}
export default InfoFileReport;
