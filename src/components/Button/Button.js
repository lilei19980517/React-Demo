import React from 'react';
import styles from './Button.module.scss'

class Button extends React.Component {
  render() {
    return (
      <div class={styles.butonsBox}>
        {this.props.buttons.map(item =>
          <button
            key={item.key}
            className='button-root'
            style={{ backgroundColor: item.backgroundColor }}
            onClick={item.clickFn && (() => item.clickFn(item.key))}
          >
            {item.value}
          </button>
        )}
      </div>
    );
  }
}

Button.defaultProps = {
  buttons: [
    {
      value: '返回',
      key: 'close',
      backgroundColor: '#fff',
      clickFn() {
        console.log(this)
      }
    },
    {
      value: '确认',
      key: 'confirm',
      backgroundColor: '#4caf50'
    }
  ]
}
export default Button;