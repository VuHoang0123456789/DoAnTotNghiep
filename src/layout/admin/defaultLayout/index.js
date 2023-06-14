import Header from '@/components/header';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

function DefaultLayoutOfAdmin({ children }) {
    return (
        <div className={cx('inter')}>
            <Header />
            <div className={cx('wrapper')}>{children}</div>
        </div>
    );
}

export default DefaultLayoutOfAdmin;
