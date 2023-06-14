import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import loaded from '@/method/loaded';
import RefreshToken from '@/method/refreshToken';

const cx = classNames.bind(styles);

function FormUploadfile({ SetIsShowFormUpLoad, CreateNewReport, report, UpdateReport }) {
    const [receiver, setReceiver] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [dealine, setDealine] = useState('');
    const [team, setTeam] = useState([]);
    const [teamSelected, setTeamSelacted] = useState({});
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const [isDisabled, setIsDisabled] = useState(false);
    const [teamFillter, setTeamFillter] = useState([]);
    const [isShowForm, setIsShowForm] = useState(false);

    function ChangeReceiver(e) {
        setReceiver(e.target.value);
        const arr = [...team];
        if (e.target.value.replace(/\s/g, '') === '') {
            setTeamFillter([]);
        } else {
            setTeamFillter(arr.filter((item) => item.TenNhom.toLowerCase().includes(e.target.value.toLowerCase())));
            setIsShowForm(true);
        }
    }

    function ChangeTitle(e) {
        setTitle(e.target.value);
    }

    function ChangeContent(e) {
        setContent(e.target.value);
    }
    function ChangeDealine(e) {
        setDealine(e.target.value);
    }

    function CloseForm(e) {
        e.stopPropagation();
        SetIsShowFormUpLoad();
    }

    useEffect(() => {
        if (report) {
            const teamSelected = team.filter((item) => item.MaNhom === report.receiver);

            setTitle(report.title);
            setContent(report.content);
            setDealine(report.deadline);

            if (teamSelected.length > 0) {
                setReceiver(teamSelected[0].TenNhom);
                setTeamSelacted(teamSelected[0]);
            }
        }
    }, [report, team]);

    useEffect(() => {
        if (
            receiver.replace(/\s/g, '') === '' ||
            title.replace(/\s/g, '') === '' ||
            dealine.replace(/\s/g, '') === ''
        ) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [receiver, title, dealine]);

    useEffect(() => {
        fetch(`${doumainUrl}/lecturers/get-all-team`, {
            method: 'GET',
            headers: {
                token: JSON.parse(sessionStorage.getItem(loaded())).accessToken,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();
                if (res.status === 200) {
                    setTeam(jsonData);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken();
                    return;
                }
                if (res.status === 500) {
                    console.log(jsonData);
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [doumainUrl]);

    useEffect(() => {
        for (let i = 0; i < team.length; i++) {
            if (team[i].TenNhom === receiver) {
                setTeamSelacted(team[i]);
                break;
            }
        }
    }, [receiver, team]);

    return (
        <div className={cx('item')}>
            <div className={cx('header', 'item__pad')}>
                <h5 className={cx('item__left')}>Báo cáo</h5>
                <div className={cx('item__right')}>
                    <div className={cx('icon')} onClick={CloseForm}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
            </div>
            <div className={cx('receiver', 'item__pad')}>
                <div className="flex">
                    <div style={{ position: 'relative', flex: '3' }}>
                        <input
                            placeholder="Người nhận"
                            maxLength={100}
                            value={receiver}
                            onChange={ChangeReceiver}
                            style={{ borderRight: '1px solid var(--border-color-2)', borderRadius: '0' }}
                        />
                        {isShowForm ? (
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '-35px',
                                    right: '5px',
                                    backgroundColor: '#ffff',
                                    zIndex: '2',
                                    boxShadow: '1px 1px 5px rgba(0, 0, 0, 50%)',
                                }}
                            >
                                {teamFillter.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                cursor: 'pointer',
                                                minWidth: '100px',
                                                minHeight: '30px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                paddingLeft: '10px',
                                            }}
                                            onClick={() => {
                                                setTeamSelacted(item);
                                                setReceiver(item.TenNhom);
                                                setIsShowForm(false);
                                            }}
                                        >
                                            {item.TenNhom}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                    <input
                        id="dealine"
                        type="date"
                        value={dealine}
                        style={{ paddingLeft: '10px', flex: '1' }}
                        onChange={ChangeDealine}
                    />
                </div>
                <hr />
            </div>

            <div className={cx('headding', 'item__pad')}>
                <input placeholder="Tiêu đề" maxLength={150} value={title} onChange={ChangeTitle} />
                <hr />
            </div>
            <div className={cx('content', 'item__pad')}>
                <textarea placeholder="Nội dung" maxLength={1000} value={content} onChange={ChangeContent} />
            </div>
            <div className={cx('controll', 'item__pad')}>
                <div
                    className={cx('wrapper')}
                    onClick={() => {
                        if (report) {
                            UpdateReport({
                                dealine: dealine,
                                title: title,
                                content: content,
                                teamId: teamSelected.MaNhom,
                            });
                        } else {
                            CreateNewReport({
                                dealine: dealine,
                                title: title,
                                content: content,
                                teamId: teamSelected.MaNhom,
                            });
                        }

                        setTeamSelacted({});
                    }}
                >
                    <button disabled={isDisabled}>{!report ? 'Tạo mới báo cáo' : 'Cập nhật báo cáo'}</button>
                </div>
            </div>
        </div>
    );
}

export default FormUploadfile;
