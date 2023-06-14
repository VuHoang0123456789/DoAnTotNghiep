import { useEffect, useState } from 'react';
import Personal from '../personal';
import { selectAccount } from '@/redux/account';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserObject } from '@/redux/userobject';
import RefreshToken from '@/method/refreshToken';
import { selectToken } from '@/redux/token';

function LecturersInformationPersonal() {
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const [userForm, setuserForm] = useState({});
    const [resData, setResData] = useState();
    const account = useSelector(selectAccount);
    const stageId = useSelector(selectUserObject);
    const Token = useSelector(selectToken);
    const dispatch = useDispatch();
    let user = [];

    if (resData) {
        user = [
            {
                title: 'Thông tin cá nhân',
                items: [
                    {
                        values: [
                            { title: 'Họ và tên', value: resData.lecturersInfomation.HoTen },
                            { title: 'Ngày sinh', value: FormatDate(resData.lecturersInfomation.NgaySinh) },
                            { title: 'Học Hoàm/ học vị', value: resData.lecturersInfomation.TenHocHamHocVi },
                            { title: 'Địa chỉ email', value: resData.lecturersInfomation.Email },
                            { title: 'Ngôn ngữ hướng dẫn', value: resData.lecturersInfomation.TenNgonNguHuongDan },
                            {
                                title: 'Chuyên ngành hướng dẫn',
                                value: resData.lecturersInfomation.TenChuyenNganhHuongDan,
                            },
                        ],
                    },
                ],
            },
            {
                title: 'Thông tin nhóm đang hướng dẫn',
                items: CreateItem('Thông tin nhóm', resData.teamInfomation),
            },
        ];
    }

    useEffect(() => {
        if (stageId === '') {
            return;
        }
        fetch(`${doumainUrl}/lecturers/get-infro-lecturers-pesonal`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
                stageid: stageId.Id,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();

                if (res.status === 200) {
                    setResData(jsonData);
                }
                if (res.status === 204) {
                    setResData({});
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [doumainUrl, stageId, Token, dispatch]);

    function CreateItem(title, values) {
        let arr = [];
        for (let i = 0; i < values.length; i++) {
            arr.push({
                title: `${title} ${i < 10 ? '0' + (i + 1) : i + 1}`,
                values: [
                    { title: 'Tên nhóm', value: values[i].TenNhom },
                    { title: 'Tên trưởng nhóm', value: values[i].HoTen },
                    { title: 'Số lượng thành viên', value: values[i].SoLuongThanhVien },
                ],
                isSeeDetail: true,
            });
        }
        return arr;
    }

    function FormatDate(date) {
        const dateFormat = new Date(date);
        return [
            dateFormat.getDate() < 10 ? '0' + dateFormat.getDate() : dateFormat.getDate(),
            dateFormat.getMonth() + 1 < 10 ? '0' + (dateFormat.getMonth() + 1) : dateFormat.getMonth() + 1,
            dateFormat.getFullYear(),
        ].join('/');
    }

    function selectedUser(type, index) {
        let userForm = {
            title: 'Thông tin nhóm',
            arr: [
                {
                    title: 'Tên nhóm',
                    value: resData.teamInfomation[index].TenNhom,
                },
                {
                    title: 'Trưởng nhóm',
                    value: resData.teamInfomation[index].HoTen,
                },
                {
                    title: 'Số lượng thành viên',
                    value: resData.teamInfomation[index].SoLuongThanhVien,
                },
                {
                    title: 'Lĩnh vực nghiên cứu',
                    value: resData.teamInfomation[index].TenLinhVucNghienCuu,
                },
                {
                    title: 'Đề tài nghiên cứu',
                    value: resData.teamInfomation[index].TenDeTaiNghienCuu,
                },
            ],
            question: {
                arr: resData.teamInfomation[index].rearchQuestions,
                title: 'Câu hỏi nghiên cứu:',
            },
            link: {
                url: resData.teamInfomation[index].LyLichThanhVien,
                title: 'Download để xem thêm thông tin về nhóm (bấm vào đây để download)',
            },
        };

        setuserForm(userForm);
    }
    return <Personal User={user} UserForm={userForm} selectedUser={selectedUser} Account={account} />;
}

export default LecturersInformationPersonal;
