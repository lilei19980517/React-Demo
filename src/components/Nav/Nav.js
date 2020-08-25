import React from 'react';
import { NavBar } from 'antd-mobile';
import {withRouter} from 'react-router-dom'
import './Nav.scss'

class Nav extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            title:this.props.title||'NavBar'
        }
    }
    render() {
        return (
            <div className='nav-root'>
                <NavBar
                    mode="light"
                    icon={<i className='iconfont icon-back' />}
                    onLeftClick={()=>{this.props.onLeftClick?this.props.onLeftClick():this.props.history.go(-1)}}
                >
                    {
                        this.state.title
                    }
                </NavBar>
            </div>
        )
    }
}                               
export default withRouter(Nav)