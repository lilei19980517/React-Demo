import React from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile';
import CardList from "../../components/CardList/Card"
import './index.scss'
import axios from 'axios'
// 轮播图下面按钮图片地址
import navImgUrl1 from '../../assets/images/nav-1.png'
import navImgUrl2 from '../../assets/images/nav-2.png'
import navImgUrl3 from '../../assets/images/nav-3.png'
import navImgUrl4 from '../../assets/images/nav-4.png'
// 处理请求回来的数组中图片路径前缀方法
const arrHandle = require('../../utils/arrHandle')
const url = 'http://localhost:8080'
const instance = axios.create({
  baseURL: url,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' }
});

// 轮播图下面的菜单
class CaiDan extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      this.props.data.map(item =>
        <Flex.Item className='caidan-centent' onClick={() => { this.props.history.push(item.path) }}>
          <img
            src={item.imgSrc}
            alt={item.title}
            style={{ width: `${this.props.imgWidth}px` }}
          />
          <h2 className='caidan-text'>{item.title}</h2>
        </Flex.Item>
      )
    )
  }
}
CaiDan.defaultProps = {
  imgWidth: 48,
  data: [
    {
      id: 1,
      title: '整租',
      path: '/home/findhouse',
      imgSrc: navImgUrl1
    },
    {
      id: 2,
      title: '合租',
      path: '/home/findhouse',
      imgSrc: navImgUrl2
    },
    {
      id: 3,
      title: '地图找房',
      path: '#',
      imgSrc: navImgUrl3
    },
    {
      id: 4,
      title: '去出租',
      path: '#',
      imgSrc: navImgUrl4
    },
  ]
}

class Index extends React.Component {
  state = {
    isLoading:false,
    data: [],
    renderElement: <h1>123</h1>,
    // 渲染租房小组宫格的数据
    gridsData: {
      area: 'AREA%7C88cff55c-aaa4-e2e0',
      list: []
    },
    // 最新资讯
    newsData: {
      area: 'AREA%7C88cff55c-aaa4-e2e0',
      list: [],
      imgStyle:{
        width: '120px',
        height:'auto'
      }
    }
  }

  async getPictures() {
    const res = await instance.get('/home/swiper')
    this.setState({
      data: res.data.body
    })
  }

  async getGroups() {
    const res = await instance.get('/home/groups', {
      data: {
        area: this.state.gridsData.area
      }
    })
    this.setState({
      gridsData: Object.assign(
        this.state.gridsData,
        { list: res.data.body })
    })
  }

  async getNews() {
    const res = await instance.get('/home/news', {
      params: {
        area: this.state.newsData.area
      }
    })
    // 处理一下图片路径
    const newArr = arrHandle.arr1(res.data.body, 'imgSrc', url)
    this.setState({
      newsData: Object.assign(
        this.state.newsData,
        { list: newArr })
    ,isLoading:true})
  }

  async componentWillMount() {
    // 获取轮播图数据
    await this.getPictures()
    // 获取租房小组数据
    await this.getGroups()
    // 获取最新资讯
    await this.getNews()
    // console.log(this.state.newsData.list)
   
  }
  componentWillUpdate(nextProps, nextState) {
  }

  render() {
    return (
      <div className='index-root'>
        <Carousel
          autoplay={true}
          infinite={true}
        >
          {this.state.data.map(item =>
            <img
              key={item.id}
              src={url + item.imgSrc}
              alt=''
              style={{ width: '100%' }}
            />
          )}
        </Carousel>
        <Flex style={{ backgroundColor: '#fff' }}>
          <CaiDan history={this.props.history} />
        </Flex>
        <Flex align='stretch'>
          <Flex.Item className="align-l index-root-groups">
            租房小组
          </Flex.Item>
          <Flex.Item className="align-r index-root-groups">
            更多
          </Flex.Item>
        </Flex>
        <Grid
          data={this.state.gridsData.list}
          className='index-root-grid'
          columnNum={2}
          hasLine={false}
          square={false}
          // itemStyle={{
          //   height: '120px',
          //   margin: '10px',
          //   backgroundColor:'red'
          // }}
          renderItem={(item) => (
            <Flex className='grid-flexbox'
              justify='around'
            >
              {/* 右边上下两个文字 */}
              <div className='grid-item-text'>
                <h1>{item.title}</h1>
                <h2>{item.desc}</h2>
              </div>
              {/* 左边图片 */}
              <img
                className='grid-img'
                src={url + item.imgSrc}
                alt={item.title}
              />
            </Flex>
          )}
        />
        {/* <CardList {...this.state.newsData} /> */}
          <h1>{this.state.isLoading?1:2}</h1>
      </div>
    )
  }
}
export default Index;