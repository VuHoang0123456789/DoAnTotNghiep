import styles from './styles.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Table() {
    return (
        <div className={cx('table')}>
            <div className={cx('table__header')}>
                <div className={cx('header__column')}>header column 1</div>
                <div className={cx('header__column')}>header column 2</div>
                <div className={cx('header__column')}>header column 3</div>
            </div>
            <div className={cx('table__content')}>
                <div className={cx('content__row')}>
                    <div className={cx('content__row-column')}>column 1</div>
                    <div className={cx('content__row-column')}>column 2</div>
                    <div className={cx('content__row-column')}>column 3</div>
                </div>
            </div>
        </div>
    );
}

export default Table;
