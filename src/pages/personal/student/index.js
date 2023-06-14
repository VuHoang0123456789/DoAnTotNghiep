import { useEffect, useState } from 'react';
import Personal from '../personal';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccount } from '@/redux/account';
import RefreshToken from '@/method/refreshToken';
import { selectToken } from '@/redux/token';

function StudentInformationPersonal() {
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;
    const [userForm, setuserForm] = useState({});
    const [resData, setResData] = useState();
    const account = useSelector(selectAccount);
    let user = [];
    const Token = useSelector(selectToken);
    const dispatch = useDispatch();

    if (resData) {
        user = [
            {
                title: 'Thông tin cá nhân',
                type: 'studentInfomation',
                items: [
                    {
                        values: [
                            { title: 'Mã sinh viên', value: resData.studentInfomation.MaSinhVien },
                            { title: 'Họ và tên', value: resData.studentInfomation.HoTen },
                            { title: 'Lớp', value: resData.studentInfomation.Lop },
                            { title: 'Ngày sinh', value: FormatDate(resData.studentInfomation.NgaySinh) },
                            { title: 'Địa chỉ email', value: resData.studentInfomation.Email },
                        ],
                    },
                ],
            },
            {
                title: 'Thông tin nhóm',
                type: 'teamInfomation',
                items: [
                    {
                        values: [
                            { title: 'Tên nhóm', value: resData.studentInfomation.TenNhom },
                            { title: 'Tên trưởng nhóm', value: resData.studentInfomation.HoTen },
                            {
                                title: 'Số lượng thành viên',
                                value: resData.studentInfomation.SoLuongThanhVien,
                            },
                        ],
                        isSeeDetail: true,
                    },
                ],
            },
            {
                title: 'Thông tin giảng viên hướng dẫn',
                type: 'lecturersInfomation',
                items: CreateItem('Giảng viên hướng dẫn', resData.lecturersInfomation),
            },
        ];
    }

    useEffect(() => {
        fetch(`${doumainUrl}/student/show-infomation-pesonal`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
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
    }, [doumainUrl, dispatch, Token]);

    function CreateItem(title, values) {
        let arr = [];
        for (let i = 0; i < values.length; i++) {
            arr.push({
                title: `${title} ${i + 1}`,
                values: [
                    { title: 'Họ và tên', value: values[i].HoTen },
                    { title: 'Ngày sinh', value: FormatDate(values[i].NgaySinh) },
                    { title: 'Học hàm/ học vị', value: values[i].TenHocHamHocVi },
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
            dateFormat.getMonth() + 1 < 10 ? '0' + dateFormat.getMonth() + 1 : dateFormat.getMonth() + 1,
            dateFormat.getFullYear(),
        ].join('/');
    }

    function selectedUser(type, index) {
        let userForm = {};

        if (type === 'teamInfomation') {
            userForm = {
                title: 'Thông tin nhóm',
                arr: [
                    {
                        title: 'Tên nhóm',
                        value: resData.studentInfomation.TenNhom,
                    },
                    {
                        title: 'Trưởng nhóm',
                        value: resData.studentInfomation.HoTen,
                    },
                    {
                        title: 'Số lượng thành viên',
                        value: resData.studentInfomation.SoLuongThanhVien,
                    },
                    {
                        title: 'Lĩnh vực nghiên cứu',
                        value: resData.studentInfomation.TenLinhVucNghienCuu,
                    },
                    {
                        title: 'Đề tài nghiên cứu',
                        value: resData.studentInfomation.TenDeTaiNghienCuu,
                    },
                ],
                question: {
                    arr: resData.rearchQuestion,
                    title: 'Câu hỏi nghiên cứu:',
                },
                link: {
                    url: resData.studentInfomation.LyLichThanhVien,
                    title: 'Download để xem thêm thông tin về nhóm (bấm vào đây để download)',
                },
            };
        }

        if (type === 'lecturersInfomation') {
            userForm = {
                title: 'Thông tin giảng viên',
                arr: [
                    {
                        title: 'Tên giảng viên: ',
                        value: resData.lecturersInfomation[index].HoTen,
                    },
                    {
                        title: 'Ngày sinh: ',
                        value: FormatDate(resData.lecturersInfomation[index].NgaySinh),
                    },
                    {
                        title: 'Học hàm, học vị: ',
                        value: resData.lecturersInfomation[index].TenHocHamHocVi,
                    },
                    {
                        title: 'Chuyên ngành hướng dẫn: ',
                        value: resData.lecturersInfomation[index].TenChuyenNganhHuongDan,
                    },
                    {
                        title: 'Ngôn ngữ hướng dẫn: ',
                        value: resData.lecturersInfomation[index].TenNgonNguHuongDan,
                    },
                ],
                link: {
                    url: resData.lecturersInfomation[index].FileLyLichUrl,
                    title: 'Download để xem thêm thông tin về giảng viên(bấm vào đây để download)',
                },
                image_url: resData.lecturersInfomation[index].FileAnhUrl,
            };
        }

        setuserForm(userForm);
    }
    return <Personal User={user} UserForm={userForm} selectedUser={selectedUser} Account={account} />;
}

export default StudentInformationPersonal;
