import Header from '@/components/header';
import SiteBar from '@/components/sitebar';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('inter')}>
            <Header />
            <div className={cx('wrapper')}>
                <SiteBar />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
