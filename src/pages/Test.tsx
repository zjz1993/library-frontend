import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './index.module.less';

const Test: React.FC = () => {
  const [visible, setVisible] = useState(true);
  return (
    <div className={styles.test_page}>
      <CSSTransition
        timeout={1000}
        addEndListener={() => {}}
        in={visible}
        classNames={{
          enterActive: styles.enterActive,
          enterDone: styles.enterDone,
          exitActive: styles.exitActive,
          exitDone: styles.exitDone
        }}
        // unmountOnExit
      >
        <div className={styles.test_page_left}>
          <div
            className={styles.test_page_left_btn}
            onClick={() => {
              setVisible(!visible);
            }}
          >
            123
          </div>
        </div>
      </CSSTransition>
      <div className={styles.test_page_right}>2</div>
    </div>
  );
};
export default Test;
