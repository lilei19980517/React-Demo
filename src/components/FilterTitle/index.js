import React from 'react';
import styles from './index.module.scss'
import { Tabs} from 'antd-mobile';

class FilterTitle extends React.Component {

  isHighlight(key) {
    return this.props.isHighlight.indexOf(key) !== -1 ? true : false
  }

  render() {
    return <div class={styles.filter}>
      <Tabs
        tabs={this.props.tabs}
        animated={false}
        tabBarPosition="bottom"
        renderTab={tab =>
          <span class={this.isHighlight(tab.key)&&styles.highlight}>
            {tab.title}
            <i className='iconfont icon-arrow' />
          </span>
        }
        tabBarUnderlineStyle={{ border: 'none' }}
        tabBarActiveTextColor={this.props.activeColor}
        onTabClick={(tab)=>{this.props.tabClickFn(tab.key)}}
      >
      </Tabs>
    </div>
  }
}

FilterTitle.defaultProps = {
  tabs: [
    { title: '区域', key: '1' },
    { title: '方式', key: '2' },
    { title: '租金', key: '3' },
    { title: '筛选', key: '4' },
  ],
  isHighlight:['2','4'],
  tabClickFn(tab,index){
    console.log(tab,index)
  }
}
export default FilterTitle