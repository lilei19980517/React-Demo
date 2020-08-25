import React from 'react';
import { Flex } from 'antd-mobile';
import './Search.scss'
class Search extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='search-root'>
                <Flex 
                    className='search-root-input' 
                    justify="end"
                >
                    <Flex
                        className='search-root-input-box'
                    >
                        <div onClick={()=>this.props.leftClick(this)}>
                            {this.props.leftBtn}
                        </div>
                        <div
                            className='search-root-input-value'
                        >
                            {this.props.inputIcon}
                            <input
                                type='text'
                                placeholder={this.props.placeholder}
                                value={this.props.value}
                                style={this.props.inputStyle}
                            />
                        </div>
                    </Flex>
                    <span onClick={this.props.rightBtnClickFn.bind(this)}>{this.props.rightBtn}</span>
                </Flex>
            </div>
        )
    }
}


Search.defaultProps ={
    leftBtn: <span
        style={{ color: '#222', fontSize: '18px' }}
    >
        {"城市"}
        <i className='iconfont icon-arrow' />
    </span>,
    leftClick(){
        this.history.go(-1)
    },
    inputIcon: <i
        className='iconfont icon-seach'
        style={{ fontSize: '18px', color: '#ccc' }}
    />,
    placeholder: '请输入您感兴趣的小区',
    inputStyle: {
        backgroundColor: '#fff',
        border: 'none',
        outline: 'none',
        height: '30px',
        color: '#666'
    },
    rightBtn: <span><i
        className='iconfont icon-map'
        style={{ fontSize: '25px', color: '#fff' }}
    /></span>,
    rightBtnClickFn() {
        this.props.history.push('/map')
    }
}

export default Search