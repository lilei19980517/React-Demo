import React from 'react';
import { Route } from 'react-router-dom'
import Index from '../Index/index'
import FindHouse from '../FindHouse/index'
import Profile from '../Profile/index'
import { TabBar } from 'antd-mobile';
import './index.css'
// axios公共属性
class Home extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      selectedTab: 'shouye',
      hidden: false,
      fullScreen: true,
      list: [
        {
          title: '首页',
          key: 'shouye',
          path: '/home',
          icon: <i className='iconfont icon-ind' />,
          selectedIcon: <i className='iconfont icon-ind' />,
          // onPress =  () => {this.props.history.push('/home/index')}  
        },
        {
          title: '找房',
          key: 'zhaofang',
          path: '/home/findhouse',
          icon: <i className='iconfont icon-findHouse' />,
          selectedIcon: <i className='iconfont icon-findHouse' />,
          // onPress =  () => {this.props.history.push('/home/list')}  
        },
        // {
        //   title: '资讯',
        //   key: 'zixun',
        //   path: '/home/news',
        //   icon: <i className='iconfont icon-infom' />,
        //   selectedIcon: <i className='iconfont icon-infom' />,
        //   // onPress =  () => {this.props.history.push('/home/news')}  
        // },
        {
          title: '我的',
          key: 'wode',
          path: '/home/my',
          icon: <i className='iconfont icon-my' />,
          selectedIcon: <i className='iconfont icon-my' />,
          // onPress =  () => {this.props.history.push('/home/my')}  
        }
      ],

    };
  }

  componentWillMount() {
    // 判断路由地址与tab栏选中是否对应
    const path = this.state.list.filter(item => item.path === this.props.location.pathname)
    path[0].key !== this.state.selectedTab && this.setState({ selectedTab: path[0].key })
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const path = this.state.list.filter(item => item.path === this.props.location.pathname)
      this.setState({
        selectedTab: path[0].key
      })
    }
  }

  render() {
    return (
      <div className='home-root'>
        {/* <Search /> */}
        <Route exact path='/home' component={Index} />
        <Route exact path='/home/findhouse' component={FindHouse} />
        {/* <Route exact path='/home/news' component={News} /> */}
        <Route exact path='/home/my' component={Profile} />
        <TabBar
          prefixCls='home-root-tabs am-tab-bar'
          unselectedTintColor="#888"
          tintColor="#1a237e"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          {this.state.list.map(item =>
            <TabBar.Item
              title={item.title}
              key={item.key}
              icon={item.icon}
              selectedIcon={item.selectedIcon}
              selected={item.key === this.state.selectedTab}
              onPress={() => {
                this.setState({ selectedTab: item.key })
                this.props.history.push(item.path)
              }}
            />)}
        </TabBar>
      </div>
    );
  }
}

// ReactDOM.render(<TabBarExample />, mountNode);
export default Home
