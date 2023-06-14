import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserObject } from '@/redux/userobject';
import { selectToken } from '@/redux/token';
import RefreshToken from '@/method/refreshToken';

const cx = classNames.bind(styles);

function PairingComp({
    SelecteLabel,
    teamsSearch,
    setTeams,
    teams,
    SelectedPairing,
    lecturersSearch,
    setLecturers,
    lecturers,
    SelectedTeam,
    setSelectedPairing,
    SelectedLecturers,
    pairingSearch,
    setPairing,
    pairings,
    selectedPairing,
    setPairingSearch,
    setPairingStatiscal,
    setPairingStatiscalSearch,
    isReloadPairing,
    setIsReLoadPairing,
    UnSelecteLabel,
    ShowFormMessage,
}) {
    const dispatch = useDispatch();
    const Token = useSelector(selectToken);
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const stageId = useSelector(selectUserObject);
    const [isShowFormLecturers, setIsShowFormLecturers] = useState(false);
    const [isShowFormTeam, setIsShowFormTeam] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        if (
            selectedPairing.teamId.replace(/\s/g, '') !== '' &&
            selectedPairing.teamName.replace(/\s/g, '') !== '' &&
            selectedPairing.researchIntruduce.replace(/\s/g, '') !== '' &&
            selectedPairing.leaderName.replace(/\s/g, '') !== '' &&
            selectedPairing.researchField.replace(/\s/g, '') !== '' &&
            selectedPairing.lecturersName.replace(/\s/g, '') !== '' &&
            selectedPairing.lecturersId.replace(/\s/g, '') !== ''
        ) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [selectedPairing]);

    //pairing start
    //hook
    useEffect(() => {
        // pariring ghép cặp đợt 2
        fetch(`${doumainUrl}/admin/get-all-pairing`, {
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
                            Id: item.STT,
                            stageId: item.Id,
                            lecturersName: item.HoTen,
                            lecturersId: item.MaGiangVienDk,
                            teamId: item.MaNhom,
                            count: item.SoLuongThanhVien,
                            researchIntruduce: item.TenChuyenNganhHuongDan,
                            researchField: item.TenLinhVucNghienCuu,
                            teamName: item.TenNhom,
                            dateRegisted: item.ThoiDiemDangKy,
                            dateOk: item.ThoiDiemXacNhan,
                            option: item.YKienGiangVien,
                            leaderName: item.leaderName,
                        });
                    });

                    setPairing(arr);
                    setPairingSearch(arr);
                }
                if (res.status === 204) {
                    setPairing([]);
                    setPairingSearch([]);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            });

        //
        fetch(`${doumainUrl}/admin/get-all-pairing-statiscal`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
            },
        })
            .then(async (res) => {
                if (res.status === 200) {
                    const jsonData = await res.json();

                    let arr = [];
                    jsonData.forEach((item) => {
                        arr.push({
                            lecturersName: item.TenGiangVien,
                            workUnit: item.DonViCongtac,
                            researchField: item.TenLinhVucNghienCuu,
                            teamName: item.TenNhom,
                            option: item.YKienGiangVien ? 'Đã xác nhận' : 'Chưa xác nhận',
                            leaderName: item.TenSinhVien,
                            backgroundFile: item.LyLichThanhVien,
                            phoneNumber: item.SoDienThoai,
                            teamId: item.MaNhom,
                            lecturersId: item.MaGiangVienDk,
                        });
                    });

                    setPairingStatiscal(arr);
                    setPairingStatiscalSearch(arr);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [
        doumainUrl,
        isReloadPairing,
        setPairing,
        setPairingSearch,
        setPairingStatiscal,
        setPairingStatiscalSearch,
        dispatch,
        Token,
    ]);
    //method

    async function AddNewPaing() {
        try {
            setIsDisabled(true);
            const res = await fetch(`${doumainUrl}/admin/create-new-pairing`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify({
                    lecturersId: selectedPairing.lecturersId,
                    teamId: selectedPairing.teamId,
                    stageId: selectedPairing.stageId,
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
                setIsReLoadPairing(!isReloadPairing);

                setSelectedPairing({
                    teamId: '',
                    teamName: '',
                    researchIntruduce: '',
                    leaderName: '',
                    researchField: '',
                    lecturersName: '',
                    lecturersId: '',
                    stageId: stageId.Id,
                });
                UnSelecteLabel();
            }

            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }

            if (res.status === 400 || res.status === 500) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }
            ShowFormMessage(mesage);
        } catch (error) {
            ShowFormMessage({ title: 'Error', content: 'Thêm mới không thành công', type: 'error' });
        }
    }

    async function UpdatePaing() {
        try {
            setIsDisabled(true);
            const res = await fetch(`${doumainUrl}/admin/update-pairing`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    id: selectedPairing.Id,
                    token: Token,
                },
                body: JSON.stringify({
                    lecturersId: selectedPairing.lecturersId,
                    teamId: selectedPairing.teamId,
                    stageId: selectedPairing.stageId,
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

                setIsReLoadPairing(!isReloadPairing);

                setSelectedPairing({
                    teamId: '',
                    teamName: '',
                    researchIntruduce: '',
                    leaderName: '',
                    researchField: '',
                    lecturersName: '',
                    lecturersId: '',
                    stageId: stageId.Id,
                });
                UnSelecteLabel();
            }

            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }

            if (res.status === 400 || res.status === 500) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }
            ShowFormMessage(mesage);
        } catch (error) {
            ShowFormMessage({ title: 'Error', content: 'Cập nhật không thành công', type: 'error' });
        }
    }
    async function DeletePairing() {
        try {
            setIsDisabled(true);
            const res = await fetch(`${doumainUrl}/admin/delete-paring`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify({
                    lecturersId: selectedPairing.lecturersId,
                    teamId: selectedPairing.teamId,
                    stageId: selectedPairing.stageId,
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

                setIsReLoadPairing(!isReloadPairing);
                setSelectedPairing({
                    teamId: '',
                    teamName: '',
                    researchIntruduce: '',
                    leaderName: '',
                    researchField: '',
                    lecturersName: '',
                    lecturersId: '',
                    stageId: stageId.Id,
                });
                UnSelecteLabel();
            }

            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }

            if (res.status === 400 || res.status === 500) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            }
            ShowFormMessage(mesage);
        } catch (error) {
            ShowFormMessage({ title: 'Error', content: 'Xóa không thành công', type: 'error' });
        }
    }
    //paing end

    return (
        <div className={cx('item__bottom')} onClick={(e) => e.stopPropagation()}>
            <h3 className={cx('title')}>Quản lý ghép cặp đợt 2</h3>
            <hr />

            <div className={cx('item__bottom-content')}>
                <div className={cx('content')}>
                    <div className={cx('content__item', 'item__left')}>
                        <div className={cx('wrapper__search')}>
                            <input
                                placeholder="Nhập từ tim kiếm"
                                onChange={(e) => {
                                    const arr = [...teamsSearch];
                                    setTeams(
                                        arr.filter(
                                            (team) =>
                                                team.leaderName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                                team.teamName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                                team.researchField.toLowerCase().includes(e.target.value.toLowerCase()),
                                        ),
                                    );
                                }}
                            />
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                        </div>
                        <div className={cx('content__table')}>
                            <div className={cx('table__header')}>
                                <div className={cx('table__column', 'width-10')}>STT</div>
                                <div className={cx('table__column', 'width-20')}>Tên nhóm</div>
                                <div className={cx('table__column', 'width-35')}>Trưởng nhóm</div>
                                <div className={cx('table__column', 'width-35', 'text-right')}>Lĩnh vực nghiên cứu</div>
                            </div>
                            <div className={cx('table__content')}>
                                <div style={{ padding: '0 10px' }}>
                                    {teams.map((team, index) => {
                                        return (
                                            <div
                                                className={cx('table__row')}
                                                key={index}
                                                onClick={() => SelectedPairing(team)}
                                            >
                                                <div className={cx('table__column', 'width-10')}>{index + 1}</div>
                                                <div className={cx('table__column', 'width-20')}>{team.teamName}</div>
                                                <div
                                                    className={cx('table__column', 'width-35')}
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {team.leaderName}
                                                </div>
                                                <div
                                                    className={cx('table__column', 'width-35', 'text-right')}
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {team.researchField}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('content__item', 'item__right')}>
                        <div className={cx('wrapper__search')}>
                            <input
                                placeholder="Nhập từ tim kiếm"
                                onChange={(e) => {
                                    const lecturers = [...lecturersSearch];
                                    setLecturers(
                                        lecturers.filter(
                                            (lecturer) =>
                                                lecturer.lecturersName
                                                    .toLowerCase()
                                                    .includes(e.target.value.toLowerCase()) ||
                                                lecturer.researchIntruduce
                                                    .toLowerCase()
                                                    .includes(e.target.value.toLowerCase()),
                                        ),
                                    );
                                }}
                            />
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                        </div>
                        <div className={cx('content__table')}>
                            <div className={cx('table__header')}>
                                <div className={cx('table__column', 'width-10')}>STT</div>
                                <div className={cx('table__column', 'width-50')}>Tên giảng viên</div>
                                <div className={cx('table__column', 'width-40', 'text-right')}>
                                    Chuyên ngành hướng dẫn
                                </div>
                            </div>
                            <div className={cx('table__content')}>
                                <div style={{ padding: '0 10px' }}>
                                    {lecturers.map((lecturer, index) => {
                                        return (
                                            <div
                                                className={cx('table__row')}
                                                key={index}
                                                onClick={() => SelectedPairing(lecturer)}
                                            >
                                                <div className={cx('table__column', 'width-10')}>{index + 1}</div>
                                                <div
                                                    className={cx('table__column', 'width-50')}
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {lecturer.lecturersName}
                                                </div>
                                                <div className={cx('table__column', 'width-40', 'text-right')}>
                                                    {lecturer.researchIntruduce}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className={cx('control')}>
                    <div className="flex flex-wrap width-100">
                        <div className={cx('wrapper__input')} style={{ position: 'relative' }}>
                            <label
                                className="label-js team-label-js"
                                htmlFor="teamName"
                                onClick={(e) => SelecteLabel(e.target)}
                            >
                                Tên nhóm
                            </label>
                            <input
                                id="teamName"
                                value={selectedPairing.teamName}
                                onChange={(e) => {
                                    if (
                                        e.target.value.replace(/\s/g, '') !== '' &&
                                        teamsSearch.filter((item) =>
                                            item.teamName.toLowerCase().includes(e.target.value),
                                        )[0]
                                    ) {
                                        SelectedTeam({
                                            ...selectedPairing,
                                            teamName: e.target.value,
                                            leaderName: teamsSearch.filter((item) =>
                                                item.teamName.toLowerCase().includes(e.target.value),
                                            )[0].lecturersName,
                                            teamId: teamsSearch.filter((item) =>
                                                item.teamName.toLowerCase().includes(e.target.value),
                                            )[0].MaNhom,
                                            researchField: teamsSearch.filter((item) =>
                                                item.teamName.toLowerCase().includes(e.target.value),
                                            )[0].TenLinhVucNghienCuu,
                                        });
                                    } else {
                                        setSelectedPairing({ ...selectedPairing, teamName: e.target.value });
                                    }

                                    setIsShowFormTeam(true);
                                }}
                            />
                            <div
                                className={cx('icon')}
                                onClick={() => {
                                    setIsShowFormTeam(!isShowFormTeam);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                            {isShowFormTeam ? (
                                <div className={cx('form-controll')}>
                                    <ul>
                                        {teamsSearch
                                            .filter((item) =>
                                                item.teamName
                                                    .toLowerCase()
                                                    .includes(selectedPairing.teamName.toLowerCase()),
                                            )
                                            .map((value, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        onClick={() => {
                                                            SelectedTeam({
                                                                ...selectedPairing,
                                                                teamName: value.teamName,
                                                                teamId: value.teamId,
                                                                leaderName: value.leaderName,
                                                                researchField: value.researchField,
                                                            });

                                                            setIsShowFormTeam(false);
                                                        }}
                                                    >
                                                        {value.teamName}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className={cx('wrapper__input')}>
                            <label className="label-js team-label-js">Tên trưởng nhóm</label>
                            <input
                                disabled
                                value={selectedPairing.leaderName}
                                onChange={(e) => {
                                    setSelectedPairing({ ...selectedPairing, leaderName: e.target.value });
                                }}
                            />
                        </div>
                        <div className={cx('wrapper__input')}>
                            <label className="label-js team-label-js">Chuyên nghành nghiên cứu</label>
                            <input
                                disabled
                                value={selectedPairing.researchField}
                                onChange={(e) => {
                                    setSelectedPairing({ ...selectedPairing, researchField: e.target.value });
                                }}
                            />
                        </div>

                        <div className={cx('wrapper__input', 'input__lecturers')}>
                            <label
                                className="label-js lecturers-label-js "
                                htmlFor="leaturers"
                                onClick={(e) => SelecteLabel(e.target)}
                            >
                                Giảng viên hướng dẫn
                            </label>
                            <input
                                id="leaturers"
                                value={selectedPairing.lecturersName}
                                onChange={(e) => {
                                    if (
                                        e.target.value.replace(/\s/g, '') !== '' &&
                                        lecturersSearch.filter((item) =>
                                            item.lecturersName.toLowerCase().includes(e.target.value),
                                        )[0]
                                    ) {
                                        SelectedLecturers({
                                            ...selectedPairing,
                                            lecturersName: e.target.value,
                                            lecturersId: lecturersSearch.filter((item) =>
                                                item.lecturersName.toLowerCase().includes(e.target.value),
                                            )[0].MaNhom,
                                            researchIntruduce: lecturersSearch.filter((item) =>
                                                item.lecturersName.toLowerCase().includes(e.target.value),
                                            )[0].TenChuyenNganhHuongDan,
                                        });
                                    } else {
                                        setSelectedPairing({
                                            ...selectedPairing,
                                            lecturersName: e.target.value,
                                        });
                                    }

                                    setIsShowFormLecturers(true);
                                }}
                            />
                            <div
                                className={cx('icon')}
                                onClick={() => {
                                    setIsShowFormLecturers(!isShowFormLecturers);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                            {isShowFormLecturers ? (
                                <div className={cx('form-controll')}>
                                    <ul>
                                        {lecturersSearch
                                            .filter((item) =>
                                                item.lecturersName
                                                    .toLowerCase()
                                                    .includes(selectedPairing.lecturersName.toLowerCase()),
                                            )
                                            .map((value, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        onClick={() => {
                                                            SelectedLecturers({
                                                                ...selectedPairing,
                                                                lecturersName: value.lecturersName,
                                                                lecturersId: value.lecturersId,
                                                                researchIntruduce: value.researchIntruduce,
                                                            });

                                                            setIsShowFormLecturers(false);
                                                        }}
                                                    >
                                                        {value.lecturersName}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className={cx('wrapper__input')}>
                            <label className="label-js lecturers-label-js">Chuyên ngành hướng dẫn</label>
                            <input
                                disabled
                                value={selectedPairing.researchIntruduce}
                                onChange={(e) => {
                                    setSelectedPairing({
                                        ...selectedPairing,
                                        researchIntruduce: e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex mar-t-10">
                        <div className={cx('wrapper__btn')}>
                            <button className={cx('btn', 'btn-add')} onClick={AddNewPaing} disabled={isDisabled}>
                                Ghép cặp
                            </button>
                            <button
                                className={cx('btn', 'mar-l-10', 'mar-r-10', 'btn-update')}
                                onClick={UpdatePaing}
                                disabled={selectedPairing.Id && !isDisabled ? false : true}
                            >
                                Cập nhật
                            </button>
                            <button className={cx('btn', 'btn-delete')} onClick={DeletePairing} disabled={isDisabled}>
                                Xóa
                            </button>
                        </div>
                        <div className={cx('wrapper__search')}>
                            <input
                                placeholder="Nhập từ tim kiếm"
                                onChange={(e) => {
                                    const pairings = [...pairingSearch];
                                    setPairing(
                                        pairings.filter(
                                            (pairing) =>
                                                pairing.teamName.includes(e.target.value) ||
                                                pairing.leaderName.includes(e.target.value) ||
                                                pairing.lecturersName.includes(e.target.value),
                                        ),
                                    );
                                }}
                            />
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                        </div>
                    </div>

                    <div className={cx('content__table', 'mar-t-20')}>
                        <div className={cx('table__header')}>
                            <div className={cx('table__column', 'width-5')}>STT</div>
                            <div className={cx('table__column', 'width-10', 'text-center')}>Tên nhóm</div>
                            <div className={cx('table__column', 'width-10', 'text-center')}>Số lượng</div>
                            <div className={cx('table__column', 'width-15')}>Trưởng nhóm</div>
                            <div className={cx('table__column', 'width-20')}>Lĩnh vực nghiên cứu</div>
                            <div className={cx('table__column', 'width-20')}>Giảng viên hướng dẫn</div>
                            <div className={cx('table__column', 'width-20', 'text-right')}>Chuyên nghành hướng dẫn</div>
                        </div>
                        <div className={cx('table__content')}>
                            <div style={{ padding: '0 10px' }}>
                                {pairings.map((pairing, index) => {
                                    return (
                                        <div
                                            className={cx('table__row')}
                                            key={index}
                                            onClick={() =>
                                                SelectedPairing({
                                                    Id: pairing.Id,
                                                    teamId: pairing.teamId,
                                                    teamName: pairing.teamName,
                                                    researchIntruduce: pairing.researchIntruduce,
                                                    leaderName: pairing.leaderName,
                                                    researchField: pairing.researchField,
                                                    lecturersName: pairing.lecturersName,
                                                    lecturersId: pairing.lecturersId,
                                                    stageId: pairing.stageId,
                                                })
                                            }
                                        >
                                            <div className={cx('table__column', 'width-5')}>{index + 1}</div>
                                            <div className={cx('table__column', 'width-10', 'text-center')}>
                                                {pairing.teamName}
                                            </div>
                                            <div className={cx('table__column', 'width-10', 'text-center')}>
                                                {pairing.count}
                                            </div>
                                            <div className={cx('table__column', 'width-15')}>{pairing.leaderName}</div>
                                            <div className={cx('table__column', 'width-20')}>
                                                {pairing.researchField}
                                            </div>
                                            <div className={cx('table__column', 'width-20')}>
                                                {pairing.lecturersName}
                                            </div>
                                            <div className={cx('table__column', 'width-20', 'text-right')}>
                                                {pairing.researchIntruduce}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PairingComp;
