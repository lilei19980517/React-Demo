import React, { Component } from 'react';
import Search from '../../components/Search/Search'
import Filter from '../../components/Filter/index'
import styles from './index.module.scss'
import instance from '../../utils/axios'
import { Toast } from 'antd-mobile'
class FindHouse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 用来判断是否请求数据的
      scrollTop: 0,
      // 这个用来筛选tab吸顶效果
      tabToTop: [],
      city: '城市',
      listData: [],
      // 已展示页数
      page: 0,
      houses: {
        //默认展示上海
        cityId: 'AREA|dbf46d32-7e76-1196',
        area: [],
        rentType: [],
        price: [],
        start: 1,
        end: 40
      },
      search: {
        history: this.props.history,
        city: '城市',
        leftBtn:
          <span
            style={{ color: '#222', fontSize: '18px' }}
          >
            <i
              className={styles.absolute + ' iconfont icon-back'}
              onClick={this.goback}
            />
            {"城市"}
            <i className='iconfont icon-arrow' />
          </span>,
        leftClick: this.leftClick.bind(this)
      },
      filter: {
        // 获取子组件传来的筛选数据
        getHouseList: this.getHouseList
      }
    }
  }

  async componentDidMount() {
    await this.getCity()
    console.log()
    this.getServerHousesData()
  }

  leftClick(childThis) {
    childThis && childThis.props.history.push('/citylist')
  }

  // 判断子组件传来的筛选数据有没有更改过
  isFilterDataChange = (name, data) => {
    // 初始请求后台的时候把houses中空数组属性都删了
    // data[name]=[]的时候找不到houses[name]也要判断为未修改
    const houses = this.state.houses
    let isChange = false
    console.log(houses[name])
    console.log(data[name][data[name].length - 1])
    //再将他赋值为空数组完美解决
    if (houses[name] === undefined && data[name][data[name].length - 1] !== undefined) {
      houses[name] = []
    }
    if (JSON.stringify(data[name][data[name].length - 1]) !== JSON.stringify(houses[name])) {
      console.log("进来了")
      // 修改state
      this.setState({ houses: Object.assign(this.state.houses, { [name]: data[name] }) })
      isChange = true
    }
    return isChange
  }

  // 请求后台数据
  async getServerHousesData(toast = true) {
    let body = this.state.houses
    // 获取缓存中的cityID值
    const cityId = JSON.parse(window.localStorage.getItem('city'))
    body.cityId = cityId.value
    console.log(body)
    for (let key in body) {
      if (typeof (body[key]) === 'object') {
        if (body[key].length === 0) {
          delete body[key]
        } else {
          body[key] = body[key][body[key].length - 1]
        }
      }
    }
    const { listData, page } = this.state
    body.start += page
    body.end += page
    toast && Toast.loading('', 0, null, false)
    const res = await instance.get('/houses', {
      params: body
    })
    toast && Toast.hide()
    console.log(res)
    const nextData = res.data.body.list
    listData.push(...nextData)
    this.setState({ listData, page: body.end })
  }

  getHouseList = async data => {
    // 更改状态 也要判断有没有改变，没改变无需更改状态
    let isChange = false
    for (let key in data) {
      const a = this.isFilterDataChange(key, data)
      a && (isChange = true)
    }
    // 判断修改了没 如果一个都没改不用请求数据
    if (isChange) {
      // 重新请求数据
      this.setState({ page: 0, listData: [] })
      this.getServerHousesData()
    }

  }

  async getCity() {
    // 首先判断缓存有没有城市
    const city = JSON.parse(window.localStorage.getItem('city'))
    if (city) {
      // 如果有看看有没有修改过
      if (city.label !== this.state.city) {
        this.setState({
          city: city.label,
          search: Object.assign(
            this.state.search,
            {
              leftBtn: <span
                style={{ color: '#222', fontSize: '18px' }}
              >
                <i
                  className={styles.absolute + ' iconfont icon-back'}
                  onClick={this.goback}
                />
                {city.label}
                <i className='iconfont icon-arrow' />
              </span>
            })
        }, () => { console.log(this) })
      }
    } else {
      // 获取当前城市
      const myCity = new window.BMap.LocalCity()
      myCity.get(async results => {
        // // 请求后端
        const res = await instance.get(`/area/info?name=${results.name}`)
        // 存入缓存
        window.localStorage.setItem("city", JSON.stringify(res.data.body))
        const ownCity = { label: results.name, value: '' }
        window.localStorage.setItem("ownCity", JSON.stringify(ownCity))
      })
      // 默认展示
      this.setState({ search: Object.assign(this.state.search, { city: '上海' }) })
    }
  }

  goback = (e) => {
    e.stopPropagation()
    this.props.history.go(-1)
  }

  scrollFn = async (e) => {
    // 如果大于最大scrollTop就是向下翻动
    // 每滑动1500请求一次
    console.log(e.currentTarget.scrollTop)
    console.log(this.state.tabToTop+'wer')
    const scrollTop = e.currentTarget.scrollTop
    if (scrollTop - this.state.scrollTop > 1500) {
      this.setState({ scrollTop })
      // 请求数据库
      console.log('请求了')
      this.getServerHousesData(false)
    }
    //判断下滑还是上滑,上滑增加
    if(e.currentTarget.scrollTop>this.state.tabToTop[0]){
      // 这里是上滑
    this.setState({ tabToTop: [scrollTop,50] })
  }else this.setState({ tabToTop: [scrollTop,0] })
  }

  rowRenderer() {
    const { listData } = this.state
    return (
      listData.map((item, index) => <div className={styles.house} key={item.houseCode}>
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={`http://192.168.1.6:8080${listData[index].houseImg}`}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{listData[index].title}</h3>
          <div className={styles.desc}>{listData[index].desc}</div>
          <div>
            {listData[index].tags.map(tag => (
              <span
                className={[styles.tag, styles[`tag${index % 3 + 1}`]].join(' ')}
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{listData[index].price}</span> 元/月
        </div>
        </div>
      </div>)
    )
  }
  console() { console.log(1) }

  render() {
    return <div
      className={styles['findhouse-root']}
      onScroll={(e) => {
        const top = e.currentTarget.scrollTop
        // 跟着子元素一起动,吸顶效果 最多动50px
        if (e.target.className.indexOf('findhouse-root') >= 0) {
          // 一不做二不休
          return
        } else  { e.currentTarget.scrollTop = this.state.tabToTop[1] } 
      }}
    >
      <Search {...this.state.search} />
      <Filter getHouseList={this.getHouseList} />
      <div className='houses-list' onScroll={(e) => { this.scrollFn(e) }}>
        {this.rowRenderer()}
      </div>
    </div>
  }
}

export default FindHouse;