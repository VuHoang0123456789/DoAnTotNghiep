function loaded() {
    const url = window.location.href;
    const arr = url.split('/');
    if (arr.includes('student')) {
        return 'student';
    } else if (arr.includes('lecturers')) {
        return 'lecturers';
    } else {
        return 'admin';
    }
}
export default loaded;
