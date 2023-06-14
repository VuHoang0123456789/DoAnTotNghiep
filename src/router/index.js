import { DefaultLayout, NoneLayout, DefaultLayoutOfAdmin } from '@/layout';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Setting from '@/pages/setting';
import { StudentInformationPersonal, LecturersInformationPersonal } from '@/pages/personal';
import { Register, RegisterTeam, LecturersPlatform, StudentPlatform, RegisterLecturers } from '@/pages/register';
import { ManageTeamOfStudent, ManageReport, ManageMyTeam, InfoFileReport } from '@/pages/manage';
import ManageAdmin from '@/pages/admin/manage';
import ManageLeturersReport from '@/pages/manage/filereport/lecturers';
import LecturersInfoFileReport from '@/pages/manage/filereport/infofilereport/lecturersfileinfo';

const publicRouter = [
    {
        path: '/student',
        component: Home,
        layout: DefaultLayout,
    },
    {
        path: '/lecturers',
        component: Home,
        layout: DefaultLayout,
    },

    {
        path: '/student/login',
        component: Login,
        layout: NoneLayout,
    },
    {
        path: '/student/register',
        component: Register,
        layout: NoneLayout,
    },
    {
        path: '/lecturers/login',
        component: Login,
        layout: NoneLayout,
    },
    {
        path: '/lecturers/register',
        component: Register,
        layout: NoneLayout,
    },
    {
        path: '/admin/login',
        component: Login,
        layout: NoneLayout,
    },
    {
        path: '/admin/register',
        component: Register,
        layout: NoneLayout,
    },
];
const privateRouter = [
    {
        path: '/student/register/platform',
        component: StudentPlatform,
        layout: DefaultLayout,
    },
    {
        path: '/student/register/lecturers',
        component: RegisterLecturers,
        layout: DefaultLayout,
    },
    {
        path: '/student/manage/report',
        component: ManageReport,
        layout: DefaultLayout,
    },
    {
        path: '/student/manage/report/:slug',
        component: InfoFileReport,
        layout: DefaultLayout,
    },
    {
        path: '/student/manage/team',
        component: ManageTeamOfStudent,
        layout: DefaultLayout,
    },
    {
        path: '/student/personal',
        component: StudentInformationPersonal,
        layout: NoneLayout,
    },
    {
        path: '/student/personal/setting',
        component: Setting,
        layout: NoneLayout,
    },

    {
        path: '/lecturers/register/platform',
        component: LecturersPlatform,
        layout: DefaultLayout,
    },
    {
        path: '/lecturers/register/team',
        component: RegisterTeam,
        layout: DefaultLayout,
    },
    {
        path: '/lecturers/manage/report',
        component: ManageLeturersReport,
        layout: DefaultLayout,
    },
    {
        path: '/lecturers/manage/report/:slug',
        component: LecturersInfoFileReport,
        layout: DefaultLayout,
    },
    {
        path: '/lecturers/manage/team',
        component: ManageMyTeam,
        layout: DefaultLayout,
    },
    {
        path: '/lecturers/personal',
        component: LecturersInformationPersonal,
        layout: NoneLayout,
    },
    {
        path: '/lecturers/personal/setting',
        component: Setting,
        layout: NoneLayout,
    },
    {
        path: '/admin',
        component: ManageAdmin,
        layout: DefaultLayoutOfAdmin,
    },
];

export { publicRouter, privateRouter };
