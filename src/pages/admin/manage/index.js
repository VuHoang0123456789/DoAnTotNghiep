import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Message from '@/components/message/default';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserObject } from '@/redux/userobject';
import StageCopmonent from './copStage';
import AcamicModleComp from './acamicModule';
import PairingComp from './pairingComp';
import Combobox from './combobox';
import { Link } from 'react-router-dom';
import { selectToken } from '@/redux/token';
import RefreshToken from '@/method/refreshToken';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { RectangleMessage } from '@/components/message';

const cx = classNames.bind(styles);

function ManageAdmin() {
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const stageId = useSelector(selectUserObject);
    const [isStatistical, setIsStatistical] = useState(false);
    const dispatch = useDispatch();

    // biên show form
    const [isShowFormRegistration, setIsShowFormRegistration] = useState(false);
    const [index, setIndex] = useState(1);
    const [indexs, setIndexs] = useState([]);

    const [formMessages, setformMessages] = useState([]);

    const [stageSearch, setStageSearch] = useState([]);
    const [isReloadStage, setIdReLoadStage] = useState(false);
    // const [selectedStageReport, setSelectedStageReport] = useState({
    //     id: '',
    //     name: '',
    //     dateStart: '',
    //     dateEnd: '',
    // });

    const [registrationSearch, setRegistrationSearch] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [selectedRegistrations, setSelectedRegistrations] = useState({
        TenDotDangKy: '',
        dateEnd: '',
        dateStart: '',
    });

    const [selectedPairing, setSelectedPairing] = useState({
        teamId: '',
        teamName: '',
        researchIntruduce: '',
        leaderName: '',
        researchField: '',
        lecturersName: '',
        lecturersId: '',
        stageId: stageId.Id,
    });

    const [teamsSearch, setTeamSearch] = useState([]);
    const [teams, setTeams] = useState([]);

    const [lecturersSearch, setLecturersSearch] = useState([]);
    const [lecturers, setLecturers] = useState([]);

    const [pairingSearch, setPairingSearch] = useState([]);
    const [pairings, setPairing] = useState([]);

    const [report, setReport] = useState({
        title: '',
        dateStart: '',
        dateEnd: '',
        dateFiling: '',
        note: '',
        lecturersId: '',
        teamId: '',
        stageId: -1,
        isFiling: false,
        teamName: '',
        stageName: '',
    });
    const [reportStatiscal, setReportStatical] = useState([]);

    const [isReloadPairing, setIsReLoadPairing] = useState(false);
    const [lecturersStatical, setLecturersStatiscal] = useState([]);
    const [lecturersStaticalSearch, setLecturersStatiscalSearch] = useState([]);

    const [teamStatical, setTeamStatiscal] = useState([]);
    const [teamStaticalSearch, setTeamStaticalSearch] = useState([]);

    const [pairingStatiscal, setPairingStatiscal] = useState([]);
    const [pairingStatiscalSearch, setPairingStatiscalSearch] = useState([]);
    // const [selectedPairingStatiscal, setSelectedPairingStatiscal] = useState({
    //     stageId: '',
    //     lecturersName: '',
    //     lecturersId: '',
    //     teamId: '',
    //     count: 15,
    //     intruduceName: '',
    //     researchFeild: '',
    //     teamName: '',
    //     dateRegisted: '',
    //     dateOk: '',
    //     option: '',
    //     leaderName: '',
    // });

    const [isShowFormMessage, setIsShowFormMessage] = useState(false);
    const [btnStatiscalIsDisable, setBtnStatiscalIsDisable] = useState(true);
    const [btnSendIsDisable, setBtnSendIsDisable] = useState(true);
    const Token = useSelector(selectToken);

    const [currentTeams, setCurrentTeams] = useState([]);
    const [currentStages, setCurrentStages] = useState([]);
    const [isReloadCurrentState, setIsReloadCurrentState] = useState(false);

    useEffect(() => {
        if (selectedRegistrations.dateStart && selectedRegistrations.dateEnd) {
            setBtnStatiscalIsDisable(false);
        } else {
            setBtnStatiscalIsDisable(true);
        }
    }, [selectedRegistrations]);

    useEffect(() => {
        if (report.teamId && report.stageId !== -1 && report.title.replace(/\s/g, '') !== '') {
            setBtnSendIsDisable(false);
        } else {
            setBtnSendIsDisable(true);
        }
    }, [report]);

    useEffect(() => {
        const Labels = document.querySelectorAll('label');
        for (let i = 0; i < Labels.length; i++) {
            Labels[i].setAttribute('index', i);
        }
    }, []);

    useEffect(() => {
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
    }, [stageId]);

    //report
    useEffect(() => {
        if (!isStatistical) {
            return;
        }
        try {
            fetch(`${doumainUrl}/admin/get-all-report-statiscal`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    token: Token,
                },
            }).then(async (res) => {
                if (res.status === 200) {
                    const jsonData = await res.json();
                    let arr = [];
                    jsonData.forEach((item) => {
                        arr.push({
                            lecturersName: item.lecturersName,
                            researchTopicName: item.researchTopicName,
                            reportRate0: item.reportRate0,
                            reportRate1: item.reportRate1,
                            reportRate2: item.reportRate2,
                        });
                    });
                    setReportStatical(arr);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [Token, dispatch, doumainUrl, isStatistical]);

    //cbbox
    useEffect(() => {
        try {
            fetch(`${doumainUrl}/admin/get-current-stage`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    token: Token,
                },
            }).then(async (res) => {
                if (res.status === 200) {
                    const jsonData = await res.json();

                    let arr = [];
                    jsonData.forEach((item) => {
                        arr.push({
                            Id: item.Id,
                            name: item.TenGiaiDoan,
                            dateStart: item.NgayBatDau,
                            dateEnd: item.NgayKetThuc,
                        });
                    });

                    setCurrentStages(arr);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            });

            fetch(`${doumainUrl}/admin/get-all-team-combox`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    token: Token,
                },
            }).then(async (res) => {
                if (res.status === 200) {
                    const jsonData = await res.json();

                    let arr = [];
                    jsonData.forEach((item) => {
                        arr.push({
                            teamName: item.TenNhom,
                            teamId: item.MaNhom,
                        });
                    });

                    setCurrentTeams(arr);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [Token, dispatch, doumainUrl, isReloadCurrentState]);

    //lecturers start
    //hook
    useEffect(() => {
        try {
            fetch(`${doumainUrl}/admin/get-all-lecturers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    token: Token,
                },
            }).then(async (res) => {
                if (res.status === 200) {
                    const jsonData = await res.json();

                    let arr = [];
                    jsonData.forEach((item) => {
                        arr.push({
                            lecturersName: item.HoTen,
                            lecturersId: item.MaGiangVienDk,
                            count: item.SoLuongNhomCoTheNhan,
                            researchIntruduce: item.TenChuyenNganhHuongDan,
                        });
                    });
                    setLecturers(arr);
                    setLecturersSearch(arr);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            });
            if (!isStatistical) {
                return;
            }
            fetch(`${doumainUrl}/admin/get-all-lecturers-statiscal`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    token: Token,
                },
            }).then(async (res) => {
                if (res.status === 200) {
                    const jsonData = await res.json();

                    let arr = [];
                    jsonData.forEach((item) => {
                        arr.push({
                            lecturersName: item.HoTen,
                            count: item.SoLuongNhom,
                            workUnit: item.DonViCongtac,
                        });
                    });
                    setLecturersStatiscalSearch(arr);
                    setLecturersStatiscal(arr);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [doumainUrl, isReloadPairing, Token, dispatch, isStatistical]);
    //lectueres end

    //team start
    //hook
    useEffect(() => {
        try {
            fetch(`${doumainUrl}/admin/get-all-team`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    token: Token,
                },
            }).then(async (res) => {
                if (res.status === 200) {
                    const jsonData = await res.json();

                    let arr = [];
                    jsonData.forEach((item) => {
                        arr.push({
                            leaderName: item.HoTen,
                            bacgroundFile: item.LyLichThanhVien,
                            researchFeildId: item.MaLinhVucNghienCuu,
                            teamId: item.MaNhom,
                            count: item.SoLuongThanhVien,
                            researchField: item.TenLinhVucNghienCuu,
                            teamName: item.TenNhom,
                        });
                    });
                    setTeamSearch(arr);
                    setTeams(arr);
                }

                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            });

            if (!isStatistical) {
                return;
            }
            fetch(`${doumainUrl}/admin/get-all-team-statiscal`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    token: Token,
                },
            }).then(async (res) => {
                if (res.status === 200) {
                    const jsonData = await res.json();

                    let arr = [];
                    jsonData.forEach((item) => {
                        arr.push({
                            leaderName: item.HoTen,
                            className: item.Lop,
                            bacgroundFile: item.LyLichThanhVien,
                            researchFeildId: item.MaLinhVucNghienCuu,
                            teamId: item.MaNhom,
                            phoneNumber: item.SoDienThoai,
                            count: item.SoLuongThanhVien,
                            researchField: item.TenLinhVucNghienCuu,
                            researchTopic: item.TenDeTaiNghienCuu,
                            teamName: item.TenNhom,
                            researchQuestion: item.researchQuestion,
                        });
                    });
                    setTeamStaticalSearch(arr);
                    setTeamStatiscal(arr);
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [doumainUrl, isReloadPairing, Token, dispatch, isStatistical]);
    //team end

    function formatDate(date) {
        const dateFormat = new Date(date);
        return [
            dateFormat.getFullYear(),
            dateFormat.getMonth() + 1 < 10 ? '0' + (dateFormat.getMonth() + 1) : dateFormat.getMonth() + 1,
            dateFormat.getDate() < 10 ? '0' + dateFormat.getDate() : dateFormat.getDate(),
        ].join('-');
    }

    function formatDateVietName(date) {
        const dateFormat = new Date(date);
        return [
            dateFormat.getDate() < 10 ? '0' + dateFormat.getDate() : dateFormat.getDate(),
            dateFormat.getMonth() + 1 < 10 ? '0' + (dateFormat.getMonth() + 1) : dateFormat.getMonth() + 1,
            dateFormat.getFullYear(),
        ].join('/');
    }

    function SelectedPairing(pairing) {
        const Labels = document.querySelectorAll('.label-js');
        for (let i = 0; i < Labels.length; i++) {
            SelecteLabel(Labels[i]);
        }
        setSelectedPairing({ ...selectedPairing, ...pairing });
    }

    function SelectedTeam(pairing) {
        const Labels = document.querySelectorAll('.team-label-js');
        setSelectedPairing({ ...selectedPairing, ...pairing });
        for (let i = 0; i < Labels.length; i++) {
            SelecteLabel(Labels[i]);
        }
    }
    function SelectedLecturers(pairing) {
        const Labels = document.querySelectorAll('.lecturers-label-js');
        setSelectedPairing({ ...selectedPairing, ...pairing });
        for (let i = 0; i < Labels.length; i++) {
            SelecteLabel(Labels[i]);
        }
    }

    async function SelectedPairingStatiscal(data) {
        if (!data) {
            return;
        }

        const Labels = document.querySelectorAll('.report-team-label-js');

        let pairings = [];
        if (data.teamId === 'ALL') {
            pairings.push(data.lecturersName);
        } else {
            pairingStatiscalSearch.forEach((pairing) => {
                if (pairing.teamId === data.teamId) {
                    pairings.push(pairing.lecturersName);
                }
            });
        }

        // console.log(pairingStatiscalSearch);

        let headers = {
            'Content-Type': 'application.json',
            token: Token,
        };

        if (data.teamId === 'ALL') {
            headers = {
                ...headers,
                stageid: report.stageId,
            };
        } else {
            headers = {
                ...headers,
                teamid: data.teamId,
                stageid: report.stageId,
            };
        }
        CallAPI(headers);
        const kq = await CallAPI(headers);

        if (!kq) {
            return;
        }

        setReport({
            ...report,
            teamName: data.teamName,
            teamId: data.teamId,
            title: kq.TieuDe ? kq.TieuDe : '',
            note: kq.Note ? kq.Note : '',
            lecturersName: pairings.join(', '),
        });

        for (let i = 0; i < Labels.length; i++) {
            SelecteLabel(Labels[i]);
        }
    }

    async function SelectedStageReport(data) {
        if (!data) {
            return;
        }

        const Labels = document.querySelectorAll('.report-stage-label-js');

        let headers = {
            'Content-Type': 'application.json',
            token: Token,
        };

        if (report.teamId === 'ALL') {
            headers = {
                ...headers,
                stageid: data.Id,
            };
        } else {
            headers = {
                ...headers,
                teamid: report.teamId,
                stageid: data.Id,
            };
        }
        const kq = await CallAPI(headers);
        if (!kq) {
            return;
        }
        //setSelectedStageReport(data);
        setReport({
            ...report,
            stageName: data.name,
            stageId: data.Id,
            dateStart: data.dateStart,
            dateEnd: data.dateEnd,
            dateFiling: data.dateStart,
            title: kq.TieuDe ? kq.TieuDe : '',
            note: kq.Note ? kq.Note : '',
        });

        for (let i = 0; i < Labels.length; i++) {
            SelecteLabel(Labels[i]);
        }
    }

    async function CallAPI(headers) {
        try {
            const res = await fetch(`${doumainUrl}/admin/get-report`, {
                method: 'GET',
                headers: headers,
            });

            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }

            if (res.status === 200) {
                const jsonData = await res.json();
                const Labels = document.querySelectorAll('.report-label-js');
                for (let i = 0; i < Labels.length; i++) {
                    SelecteLabel(Labels[i]);
                }
                return jsonData;
            } else {
                return {
                    ...report,
                    title: '',
                    note: '',
                };
            }
        } catch (error) {
            console.log(error);
        }
    }

    function SelecteLabel(label) {
        //UnSelecteLabel();

        label.style.left = '20px';
        label.style.width = 'auto';
        label.style.height = 'auto';
        label.style.fontSize = '12px';
        label.style.padding = '0 5px';
        label.style.transform = 'translateY(-50%)';

        setIndexs([...indexs, label.getAttribute('index')]);
    }

    function UnSelecteLabel() {
        const LabelSelected = document.querySelectorAll('label');
        const newArr = Array.from(new Set(indexs));
        const arr = [...newArr];

        for (let i = 0; i < newArr.length; i++) {
            if (!LabelSelected[newArr[i]]) {
                return;
            }

            const InputSelected = LabelSelected[newArr[i]].nextElementSibling;
            if (InputSelected.value.replace(/\s/g, '') === '') {
                LabelSelected[newArr[i]].style.left = '0';
                LabelSelected[newArr[i]].style.width = '100%';
                LabelSelected[newArr[i]].style.height = '100%';
                LabelSelected[newArr[i]].style.fontSize = '14px';
                LabelSelected[newArr[i]].style.padding = '0 20px';
                LabelSelected[newArr[i]].style.transform = 'translateY(0)';

                arr.splice(i, 1);
            }
        }

        setIndexs(arr);
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
    // thông báo
    async function SendEmail() {
        let url = `${doumainUrl}/lecturers/create-new-report`;
        if (report.teamId === 'ALL') {
            url = `${doumainUrl}/lecturers/create-new-reports`;
        }
        try {
            setBtnSendIsDisable(true);
            const Report = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify(report),
            });
            setBtnSendIsDisable(false);
            const result = await Report.json();
            let mesage = {
                title: '',
                content: '',
                type: '',
            };
            if (Report.status === 201) {
                mesage.title = 'Success';
                mesage.content = result.msg;
                mesage.type = 'success';
            }
            if (Report.status === 400) {
                mesage.title = 'Error';
                mesage.content = result.msg;
                mesage.type = 'error';
            }
            if (Report.status === 401 || Report.status === 403) {
                RefreshToken(dispatch);
                return;
            }
            if (Report.status === 500) {
                console.log(result);
                return;
            }
            ShowFormMessage(mesage);
        } catch (error) {
            console.log(error);
            let mesage = {
                title: 'Error',
                content: 'Tạo mới báo cáo không thành công',
                type: 'error',
            };
            ShowFormMessage(mesage);
        }
    }

    async function UpdateEmail() {
        let data = {
            title: report.title,
            note: report.note,
            teamId: report.teamId,
            stageId: report.stageId,
            dateStart: formatDate(report.dateStart),
            dateEnd: formatDate(report.dateEnd),
        };

        if (report.teamId === 'ALL') {
            data = {
                title: report.title,
                note: report.note,
                stageId: report.stageId,
                dateStart: formatDate(report.dateStart),
                dateEnd: formatDate(report.dateEnd),
            };
        }

        try {
            setBtnSendIsDisable(true);
            const Report = await fetch(`${doumainUrl}/admin/update-report`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify(data),
            });
            setBtnSendIsDisable(false);
            const result = await Report.json();
            let mesage = {
                title: '',
                content: '',
                type: '',
            };
            if (Report.status === 200) {
                mesage.title = 'Success';
                mesage.content = result.msg;
                mesage.type = 'success';
            }
            if (Report.status === 400) {
                mesage.title = 'Error';
                mesage.content = result.msg;
                mesage.type = 'error';
            }
            if (Report.status === 401 || Report.status === 403) {
                RefreshToken(dispatch);
                return;
            }
            if (Report.status === 500) {
                console.log(result);
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
    async function DeleteEmail() {
        let data = {
            teamId: report.teamId,
            stageId: report.stageId,
        };

        if (report.teamId === 'ALL') {
            data = {
                stageId: report.stageId,
            };
        }

        try {
            setBtnSendIsDisable(true);
            const Report = await fetch(`${doumainUrl}/admin/delete-report`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify(data),
            });
            setBtnSendIsDisable(false);
            const result = await Report.json();
            let mesage = {
                title: '',
                content: '',
                type: '',
            };
            if (Report.status === 200) {
                mesage.title = 'Success';
                mesage.content = result.msg;
                mesage.type = 'success';
            }
            if (Report.status === 400) {
                mesage.title = 'Error';
                mesage.content = result.msg;
                mesage.type = 'error';
            }
            if (Report.status === 401 || Report.status === 403) {
                RefreshToken(dispatch);
                return;
            }
            if (Report.status === 500) {
                console.log(result);
                return;
            }
            ShowFormMessage(mesage);
        } catch (error) {
            console.log(error);
            let mesage = {
                title: 'Error',
                content: 'Xóa không thành công',
                type: 'error',
            };
            ShowFormMessage(mesage);
        }
    }

    // thống kê
    async function StaticalClick() {
        if (index === 1) {
            const res = await fetch(`${doumainUrl}/admin/get-all-team-statiscal-date`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    date_start: formatDate(selectedRegistrations.dateStart),
                    date_end: formatDate(selectedRegistrations.dateEnd),
                    token: Token,
                },
            });

            if (res.status === 200) {
                const jsonData = await res.json();
                let arr = [];
                jsonData.forEach((item) => {
                    arr.push({
                        leaderName: item.HoTen,
                        className: item.Lop,
                        bacgroundFile: item.LyLichThanhVien,
                        researchFeildId: item.MaLinhVucNghienCuu,
                        teamId: item.MaNhom,
                        phoneNumber: item.SoDienThoai,
                        count: item.SoLuongThanhVien,
                        researchField: item.TenLinhVucNghienCuu,
                        teamName: item.TenNhom,
                        researchQuestion: item.researchQuestion,
                    });
                });
                setTeamStaticalSearch(arr);
                setTeamStatiscal(arr);
            }
            if (res.status === 204) {
                setTeamStaticalSearch([]);
                setTeamStatiscal([]);
            }
            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }
        }
        if (index === 2) {
            const res = await fetch(`${doumainUrl}/admin/get-all-lecturers-statiscal-date`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    date_start: formatDate(selectedRegistrations.dateStart),
                    date_end: formatDate(selectedRegistrations.dateEnd),
                    token: Token,
                },
            });

            if (res.status === 200) {
                const jsonData = await res.json();

                let arr = [];
                jsonData.forEach((item) => {
                    arr.push({
                        lecturersName: item.HoTen,
                        count: item.SoLuongNhom,
                        workUnit: item.DonViCongtac,
                    });
                });
                setLecturersStatiscalSearch(arr);
                setLecturersStatiscal(arr);
            }
            if (res.status === 204) {
                setLecturersStatiscalSearch([]);
                setLecturersStatiscal([]);
            }
            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }
        }

        if (index === 3) {
            const res = await fetch(`${doumainUrl}/admin/get-all-pairing-statiscal-date`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    date_start: formatDate(selectedRegistrations.dateStart),
                    date_end: formatDate(selectedRegistrations.dateEnd),
                    token: Token,
                },
            });

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
                    });
                });
                setPairingStatiscal(arr);
                setPairingStatiscalSearch(arr);
            }
            if (res.status === 204) {
                setPairingStatiscal([]);
                setPairingStatiscalSearch([]);
            }
            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }
        }

        if (index === 4) {
            const res = await fetch(`${doumainUrl}/admin/get-all-report-statiscal-date`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application.json',
                    token: Token,
                    date_start: formatDate(selectedRegistrations.dateStart),
                    date_end: formatDate(selectedRegistrations.dateEnd),
                },
            });

            if (res.status === 200) {
                const jsonData = await res.json();
                let arr = [];
                jsonData.forEach((item) => {
                    arr.push({
                        lecturersName: item.lecturersName,
                        researchTopicName: item.researchTopicName,
                        reportRate0: item.reportRate0,
                        reportRate1: item.reportRate1,
                        reportRate2: item.reportRate2,
                    });
                });
                setReportStatical(arr);
            }
            if (res.status === 204) {
                setReportStatical([]);
            }
            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }
        }
    }

    function SearchStatiscalChange(e) {
        const value = e.target.value.toLowerCase();
        if (index === 1) {
            setTeamStatiscal(
                teamStaticalSearch.filter(
                    (item) =>
                        item.leaderName.toLowerCase().includes(value) ||
                        item.phoneNumber.toLowerCase().includes(value) ||
                        item.className.toLowerCase().includes(value) ||
                        item.teamName.toLowerCase().includes(value) ||
                        item.researchField.toLowerCase().includes(value),
                ),
            );
        }
        if (index === 2) {
            setLecturersStatiscal(
                lecturersStaticalSearch.filter(
                    (item) =>
                        item.lecturersName.toLowerCase().includes(value) || item.workUnit.toLowerCase().includes(value),
                ),
            );
        }
        if (index === 3) {
            setPairingStatiscal(
                pairingStatiscalSearch.filter(
                    (item) =>
                        item.teamName.toLowerCase().includes(value) ||
                        item.leaderName.toLowerCase().includes(value) ||
                        item.phoneNumber.toLowerCase().includes(value) ||
                        item.researchField.toLowerCase().includes(value) ||
                        item.lecturersName.toLowerCase().includes(value) ||
                        item.workUnit.toLowerCase().includes(value),
                ),
            );
        }
    }

    function TablePairing() {
        return (
            <div className={cx('content__table', 'mar-t-20')}>
                <div className={cx('table__header')}>
                    <div className={cx('table__column', 'width-5')}>STT</div>
                    <div className={cx('table__column', 'width-10', 'text-center')}>Nhóm</div>
                    <div className={cx('table__column', 'width-15')}>Trưởng nhóm</div>
                    <div className={cx('table__column', 'width-10')}>Số điện thoại</div>
                    <div className={cx('table__column', 'width-15')}>Lĩnh vực nghiên cứu</div>
                    <div className={cx('table__column', 'width-10')}>Lý lịch nhóm</div>
                    <div className={cx('table__column', 'width-15')}>Tên giảng viên HD</div>
                    <div className={cx('table__column', 'width-10', 'text-center')}>Đơn vị</div>
                    <div className={cx('table__column', 'width-10', 'text-right')}>Trạng thái</div>
                </div>
                <div className={cx('table__content')}>
                    <div style={{ padding: '0 10px' }}>
                        {pairingStatiscal.map((pairing, index) => {
                            return (
                                <div className={cx('table__row')} key={index}>
                                    <div className={cx('table__column', 'width-5')}>{index + 1}</div>
                                    <div className={cx('table__column', 'width-10', 'text-center')}>
                                        {pairing.teamName}
                                    </div>
                                    <div className={cx('table__column', 'width-15')}>{pairing.leaderName}</div>
                                    <div className={cx('table__column', 'width-10')}>{pairing.phoneNumber}</div>
                                    <div className={cx('table__column', 'width-15')}>{pairing.researchField}</div>
                                    <div className={cx('table__column', 'width-10')}>
                                        <Link
                                            to={`https://docs.google.com/viewerng/viewer?url=${pairing.backgroundFile}`}
                                        >
                                            {pairing.backgroundFile}
                                        </Link>
                                    </div>
                                    <div className={cx('table__column', 'width-15')}>{pairing.lecturersName}</div>
                                    <div className={cx('table__column', 'width-10')}>{pairing.workUnit}</div>
                                    <div className={cx('table__column', 'width-10', 'text-right')}>
                                        {pairing.option}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
    function TableLecturers() {
        return (
            <div className={cx('content__table', 'mar-t-20')}>
                <div className={cx('table__header')}>
                    <div className={cx('table__column', 'width-5')}>STT</div>
                    <div className={cx('table__column', 'width-40')}>Họ và tên</div>
                    <div className={cx('table__column', 'width-40')}>Đơn vị công tác</div>
                    <div className={cx('table__column', 'width-15', 'text-right')}>Số nhóm hướng dẫn</div>
                </div>
                <div className={cx('table__content')}>
                    <div style={{ padding: '0 10px' }}>
                        {lecturersStatical.map((pairing, index) => {
                            return (
                                <div className={cx('table__row')} key={index}>
                                    <div className={cx('table__column', 'width-5')}>{index + 1}</div>
                                    <div className={cx('table__column', 'width-40')}>{pairing.lecturersName}</div>
                                    <div className={cx('table__column', 'width-40')}>{pairing.workUnit}</div>
                                    <div className={cx('table__column', 'width-15', 'text-right')}>{pairing.count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
    function TableTeam() {
        return (
            <div className={cx('content__table', 'mar-t-20')}>
                <div className={cx('table__header')}>
                    <div className={cx('table__column', 'width-5')}>STT</div>
                    <div className={cx('table__column', 'width-20')}>Họ và tên sinh viên đại diện</div>
                    <div className={cx('table__column', 'width-15')}>Số điện thoại</div>
                    <div className={cx('table__column', 'width-15')}>Lớp sinh viên</div>
                    <div className={cx('table__column', 'width-10')}>Nhóm</div>
                    <div className={cx('table__column', 'width-15')}>Số lượng thành viên</div>
                    <div className={cx('table__column', 'width-20', 'text-right')}>Lĩnh vực nghiên cứu</div>
                </div>
                <div className={cx('table__content')}>
                    <div style={{ padding: '0 10px' }}>
                        {teamStatical.map((team, index) => {
                            return (
                                <div className={cx('table__row')} key={index}>
                                    <div className={cx('table__column', 'width-5')}>{index + 1}</div>
                                    <div className={cx('table__column', 'width-20')}>{team.leaderName}</div>
                                    <div className={cx('table__column', 'width-15')}>{team.phoneNumber}</div>
                                    <div className={cx('table__column', 'width-15')}>{team.className}</div>
                                    <div className={cx('table__column', 'width-10')}>{team.teamName}</div>
                                    <div className={cx('table__column', 'width-15', 'text-center')}>{team.count}</div>
                                    <div className={cx('table__column', 'width-20', 'text-right')}>
                                        {team.researchField}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
    function TableReport() {
        return (
            <div className={cx('content__table', 'mar-t-20')}>
                <div className={cx('table__header')}>
                    <div className={cx('table__column', 'width-32')}>Tên đề tài</div>
                    <div className={cx('table__column', 'width-17')}>Giảng viên hướng dẫn</div>
                    <div className={cx('table__column', 'width-17', 'text-center')}>Báo cáo giai đoạn 1(%)</div>
                    <div className={cx('table__column', 'width-17', 'text-center')}>Báo cáo giai đoạn 2(%)</div>
                    <div className={cx('table__column', 'width-17', 'text-right')}>Báo cáo giai đoạn 3(%)</div>
                </div>
                <div className={cx('table__content')}>
                    <div style={{ padding: '0 10px' }}>
                        {reportStatiscal.map((report, index) => {
                            return (
                                <div className={cx('table__row')} key={index}>
                                    <div className={cx('table__column', 'width-32')}>{report.researchTopicName}</div>
                                    <div className={cx('table__column', 'width-17')}>{report.lecturersName}</div>
                                    <div className={cx('table__column', 'width-17', 'text-center')}>
                                        {report.reportRate0}
                                    </div>
                                    <div className={cx('table__column', 'width-17', 'text-center')}>
                                        {report.reportRate1}
                                    </div>
                                    <div className={cx('table__column', 'width-17', 'text-right')}>
                                        {report.reportRate2}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    function Question(arr) {
        let str = '';
        for (let i = 0; i < arr.length; i++) {
            str += `${i + 1}: ${arr[i].NoiDungCauHoi} `;
        }
        return str;
    }

    const exportToCSV = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        let sheetName = '';
        let csvData = [];
        let fileName = '';
        let ws = '';

        if (index === 1) {
            teamStatical.forEach((item) => {
                csvData.push({
                    'Họ tên sinh viên đại diện': item.leaderName,
                    'Số điện thoại liên lạc': item.phoneNumber,
                    'Lớp sinh viên': item.className,
                    'Nhóm (lớp)': item.teamName,
                    'Số lượng thành viên': item.count,
                    'Dự kiến lĩnh vực nghiên cứu': item.researchField,
                    'Tên đề tài dự kiến (nếu có)': item.researchTopic,
                    'Câu hỏi nghiên cứu (nếu có)': Question(item.researchQuestion),
                    'Tờ khai lý lịch nhóm sinh viên': item.bacgroundFile,
                });
            });

            fileName = 'Nhom';
            sheetName = 'DS nhóm SV';
        }

        if (index === 2) {
            for (let i = 0; i < lecturersStatical.length; i++) {
                csvData.push({
                    STT: i + 1,
                    'Họ và tên': lecturersStatical[i].lecturersName,
                    'Đơn vị công tác': lecturersStatical[i].workUnit,
                    'Số nhóm HD': lecturersStatical[i].count,
                });
            }
            fileName = 'GiangVienHuongDan';
            sheetName = 'DS GVHD';
        }

        if (index === 3) {
            pairingStatiscal.forEach((item) => {
                csvData.push({
                    Nhóm: item.teamName,
                    'SV đại diện': item.leaderName,
                    'Số điện thoại': item.phoneNumber,
                    'Dự kiến lĩnh vực nghiên cứu': item.researchField,
                    'Lý lịch nhóm sinh viên': item.backgroundFile,
                    'Tên GVHD': item.lecturersName,
                    'Đơn vị': item.workUnit,
                    'Trạng thái': item.option ? 'Đã xác nhân' : 'Chưa xác nhận',
                });
            });

            fileName = 'KetQuaGhepCap';
            sheetName = 'Kết quả ghép cặp';
        }

        if (index === 4) {
            reportStatiscal.forEach((item) => {
                csvData.push({
                    'Tên đề tài': item.researchTopicName,
                    'Giảng viên hướng dẫn': item.lecturersName,
                    'Báo cáo giai đoạn 1(%)': item.reportRate0,
                    'Báo cáo giai đoạn 2(%)': item.reportRate1,
                    'Báo cáo giai đoạn 3(%)': item.reportRate2,
                });
            });

            fileName = 'TienDo';
            sheetName = 'Tiến độ';
        }
        ws = XLSX.utils.json_to_sheet(csvData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    return (
        <div className={cx('container')} onClick={UnSelecteLabel}>
            {isShowFormMessage ? (
                <RectangleMessage
                    CloseForm={() => {
                        setIsShowFormMessage(false);
                    }}
                    title={'Bạn có chắc muốn xóa không?'}
                    Agree={() => {
                        DeleteEmail();
                    }}
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
                <div className={cx('item__top')}>
                    {/* quản lý đợt đăng ký*/}
                    <AcamicModleComp
                        SelecteLabel={SelecteLabel}
                        UnSelecteLabel={UnSelecteLabel}
                        ShowFormMessage={ShowFormMessage}
                        setRegistrations={setRegistrations}
                        registrationSearch={registrationSearch}
                        registrations={registrations}
                        formatDate={formatDate}
                        formatDateVietName={formatDateVietName}
                        setRegistrationSearch={setRegistrationSearch}
                        setSelectedRegistrations={setSelectedRegistrations}
                        indexs={indexs}
                        setIndexs={setIndexs}
                    />
                    {/* quản lý giai đoạn*/}
                    <StageCopmonent
                        SelecteLabel={SelecteLabel}
                        registrations={registrations}
                        setIsShowFormRegistration={setIsShowFormRegistration}
                        isShowFormRegistration={isShowFormRegistration}
                        registrationSearch={registrationSearch}
                        setStageSearch={setStageSearch}
                        stageSearch={stageSearch}
                        isReloadStage={isReloadStage}
                        setIdReLoadStage={setIdReLoadStage}
                        UnSelecteLabel={UnSelecteLabel}
                        ShowFormMessage={ShowFormMessage}
                        formatDateVietName={formatDateVietName}
                        formatDate={formatDate}
                        indexs={indexs}
                        setIndexs={setIndexs}
                        isReloadCurrentState={isReloadCurrentState}
                        setIsReloadCurrentState={setIsReloadCurrentState}
                    />
                </div>
                {/* quản lý ghép cặp đợt 2*/}
                <PairingComp
                    SelecteLabel={SelecteLabel}
                    teamsSearch={teamsSearch}
                    setTeams={setTeams}
                    teams={teams}
                    SelectedPairing={SelectedPairing}
                    lecturersSearch={lecturersSearch}
                    setLecturers={setLecturers}
                    lecturers={lecturers}
                    SelectedTeam={SelectedTeam}
                    setSelectedPairing={setSelectedPairing}
                    SelectedLecturers={SelectedLecturers}
                    pairingSearch={pairingSearch}
                    setPairing={setPairing}
                    pairings={pairings}
                    selectedPairing={selectedPairing}
                    setPairingSearch={setPairingSearch}
                    setPairingStatiscal={setPairingStatiscal}
                    setPairingStatiscalSearch={setPairingStatiscalSearch}
                    isReloadPairing={isReloadPairing}
                    setIsReLoadPairing={setIsReLoadPairing}
                    UnSelecteLabel={UnSelecteLabel}
                    ShowFormMessage={ShowFormMessage}
                />
                {/* quản lý tiến độ*/}
                <div className={cx('item__bottom')} onClick={(e) => e.stopPropagation()}>
                    <h3 className={cx('title')}>{!isStatistical ? 'Thông báo tiến độ' : 'Thống kê'}</h3>
                    <hr />
                    <div className={cx('item__bottom-content')}>
                        {!isStatistical ? (
                            <div className={cx('control')}>
                                <div>
                                    <div className="flex">
                                        <Combobox
                                            itemSource={[
                                                {
                                                    teamName: 'Tất cả',
                                                    lecturersName: 'Tất cả',
                                                    teamId: 'ALL',
                                                    lecturersId: 'All',
                                                },
                                                ...currentTeams,
                                            ]}
                                            handleClick={(value) => {
                                                SelectedPairingStatiscal(value);
                                            }}
                                            displayMember={'teamName'}
                                            SelecteLabel={SelecteLabel}
                                            title={'Nhóm'}
                                        />

                                        <div className={cx('content__item', 'mar-b-20')} style={{ flex: '1' }}>
                                            <div className={cx('wrapper__input')}>
                                                <label htmlFor="lecturers-report" className="report-team-label-js">
                                                    Giảng viên
                                                </label>
                                                <input
                                                    id="lecturers-report"
                                                    value={report.lecturersName}
                                                    onChange={SelectedPairingStatiscal}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cx('content__item', 'mar-b-20')}>
                                        <div className={cx('wrapper__input')}>
                                            <label
                                                htmlFor="title-report"
                                                onClick={(e) => SelecteLabel(e.target)}
                                                className="report-label-js"
                                            >
                                                Tiêu đề
                                            </label>
                                            <input
                                                id="title-report"
                                                value={report.title}
                                                maxLength={300}
                                                onChange={(e) => {
                                                    setReport({ ...report, title: e.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {currentStages.length > 0 ? (
                                            <Combobox
                                                itemSource={currentStages}
                                                handleClick={(value) => {
                                                    SelectedStageReport(value);
                                                }}
                                                displayMember={'name'}
                                                SelecteLabel={SelecteLabel}
                                                title={'Giai đoạn'}
                                            />
                                        ) : (
                                            <></>
                                        )}

                                        <div className={cx('content__item', 'mar-b-20')}>
                                            <div className={cx('wrapper__input')}>
                                                <label htmlFor="report-dateStart" className="report-stage-label-js">
                                                    Ngày bắt đầu
                                                </label>
                                                <input
                                                    id="report-dateStart"
                                                    value={formatDateVietName(report.dateStart)}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className={cx('content__item', 'mar-b-20')}>
                                            <div className={cx('wrapper__input')}>
                                                <label htmlFor="report-dateEnd" className="report-stage-label-js">
                                                    Ngày kết thúc
                                                </label>
                                                <input
                                                    id="report-dateEnd"
                                                    value={formatDateVietName(report.dateEnd)}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cx('content__item', 'mar-b-20')}>
                                        <div className={cx('wrapper__input')}>
                                            <label
                                                htmlFor="report-note"
                                                onClick={(e) => SelecteLabel(e.target)}
                                                className="report-label-js"
                                            >
                                                Nội dung
                                            </label>
                                            <textarea
                                                style={{ borderRadius: '4px' }}
                                                id="report-note"
                                                onChange={(e) => {
                                                    setReport({ ...report, note: e.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <button
                                            className={cx('btn', 'btn-add', 'mar-r-10')}
                                            onClick={SendEmail}
                                            disabled={btnSendIsDisable}
                                        >
                                            Gửi
                                        </button>
                                        <button
                                            className={cx('btn', 'btn-update', 'mar-r-10')}
                                            onClick={UpdateEmail}
                                            disabled={btnSendIsDisable}
                                        >
                                            Cập nhật
                                        </button>
                                        <button
                                            className={cx('btn', 'btn-delete', 'mar-r-10')}
                                            onClick={() => {
                                                setIsShowFormMessage(true);
                                            }}
                                            disabled={btnSendIsDisable}
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            className={cx('btn', 'btn-statiscal')}
                                            onClick={() => {
                                                setIsStatistical(true);
                                            }}
                                        >
                                            Thống kê
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={cx('control')}>
                                <div className="flex mar-t-10">
                                    <div className={cx('wrapper__btn')}>
                                        <div className="mar-r-20">
                                            <button
                                                className={cx('btn', 'btn-add', 'mar-b-20')}
                                                onClick={() => {
                                                    setIsStatistical(false);
                                                }}
                                            >
                                                Thông báo tiến độ
                                            </button>
                                            <button
                                                className={cx('btn', 'btn-update', 'mar-b-20')}
                                                onClick={StaticalClick}
                                                disabled={btnStatiscalIsDisable}
                                            >
                                                Thống kê
                                            </button>
                                        </div>

                                        <div className="mar-r-20" style={{ minWidth: '350px' }}>
                                            <Combobox
                                                title={'Kiểu'}
                                                itemSource={[
                                                    { id: 1, name: 'Nhóm' },
                                                    { id: 2, name: 'Giảng viên hướng dẫn' },
                                                    { id: 3, name: 'Ghép cặp' },
                                                    { id: 4, name: 'Tiến độ' },
                                                ]}
                                                handleClick={(value) => {
                                                    if (!value) {
                                                        return;
                                                    }
                                                    setIndex(value.id);
                                                }}
                                                displayMember={'name'}
                                                SelecteLabel={SelecteLabel}
                                            />
                                            <div className={cx('wrapper__search')}>
                                                <input
                                                    placeholder="Nhập từ tim kiếm"
                                                    onChange={SearchStatiscalChange}
                                                />
                                                <div className={cx('icon')}>
                                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ minWidth: '450px' }} className="mar-r-20">
                                            {registrationSearch.length > 0 ? (
                                                <Combobox
                                                    title={'Đợt đăng ký'}
                                                    itemSource={registrationSearch}
                                                    handleClick={(value) => {
                                                        if (!value) {
                                                            return;
                                                        }
                                                        setSelectedRegistrations(value);
                                                    }}
                                                    displayMember={'name'}
                                                    SelecteLabel={SelecteLabel}
                                                />
                                            ) : (
                                                <></>
                                            )}

                                            <div className="flex">
                                                <div className={cx('content__item', 'mar-b-20')} style={{ flex: '1' }}>
                                                    <div className={cx('wrapper__input')}>
                                                        <label
                                                            htmlFor="report-dateStart"
                                                            style={{
                                                                left: '20px',
                                                                width: 'auto',
                                                                height: 'auto',
                                                                fontSizeize: '12px',
                                                                padding: '0px 5px',
                                                                transform: 'translateY(-50%)',
                                                            }}
                                                            className="report-stage-label-js"
                                                        >
                                                            Ngày bắt đầu
                                                        </label>
                                                        <input
                                                            id="report-dateStart"
                                                            type="date"
                                                            value={formatDate(selectedRegistrations.dateStart)}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className={cx('content__item', 'mar-b-20')} style={{ flex: '1' }}>
                                                    <div className={cx('wrapper__input')}>
                                                        <label
                                                            htmlFor="report-dateEnd"
                                                            style={{
                                                                left: '20px',
                                                                width: 'auto',
                                                                height: 'auto',
                                                                fontSizeize: '12px',
                                                                padding: '0px 5px',
                                                                transform: 'translateY(-50%)',
                                                            }}
                                                            className="report-stage-label-js"
                                                        >
                                                            Ngày kết thúc
                                                        </label>
                                                        <input
                                                            id="report-dateEnd"
                                                            type="date"
                                                            value={formatDate(selectedRegistrations.dateEnd)}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                style={{
                                                    marginBottom: '20px',
                                                    background: 'transparent',
                                                    color: 'transparent',
                                                }}
                                            >
                                                Export
                                            </button>
                                            <button className={cx('btn', 'mar-b-10')} onClick={exportToCSV}>
                                                <img
                                                    className="mar-r-5"
                                                    src="https://pma-mysql-addon-clevercloud-customers.services.clever-cloud.com/themes/pmahomme/img/b_export.png"
                                                    alt="Export"
                                                />
                                                Export
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {index === 1 ? <TableTeam /> : <></>}
                                {index === 2 ? <TableLecturers /> : <></>}
                                {index === 3 ? <TablePairing /> : <></>}
                                {index === 4 ? <TableReport /> : <></>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ManageAdmin;
