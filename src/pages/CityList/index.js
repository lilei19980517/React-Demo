import React from 'react'
import Nav from '../../components/Nav/Nav'
import './CityList.scss'
// axios公共属性
import instance from '../../utils/axios'
import citySort from '../../utils/citySort'
import { List, AutoSizer } from 'react-virtualized'
import { Toast } from 'antd-mobile'

const cityTitle = letter => {
  switch (letter) {
    case "#": return "当前定位"
    case "hot": return "热门城市"
    default: return letter.toUpperCase()
  }
}

class CityList extends React.Component {
  constructor(props) {
    super(props)
    const listRef = React.createRef()
    this.state = {
      cityList: {},
      cityIndex: [],
      // 索引选中
      indexSelected: '#',
      listRef,
    }
  }

  async componentDidMount() {
    await this.getCity()
    //提前计算高度防止bug
    this.state.listRef.current.measureAllRows()
  }

  async getCity() {
    Toast.loading(null,0,null,false)
    const res1 = await instance.get('/area/hot')
    // await this.setState({hotCity:res.data.body})
    const res2 = await instance.get('/area/city?level=1')
    Toast.hide()
    // 调用citySort方法
    const newCityList = citySort(res2.data.body)
    // 将热门城市添加到里面
    newCityList.cityList.hot = res1.data.body
    // 将当前城市插入进去
    const ownCity = window.localStorage.getItem('ownCity')
    newCityList.cityList['#'] = [JSON.parse(ownCity)]
    // console.log(this.setState)
    this.setState({
      cityIndex: newCityList.cityIndex,
      cityList: newCityList.cityList
    })
  }

  //动态计算每一个list的高度
  rowHeightFn = ({ index }) => {
    const { cityIndex, cityList } = this.state
    // 标题高度 + 城市名称数量*城市名称高度
    const number = 50 + cityList[cityIndex[index]].length * 50
    return number
  }

  // list每一个城市的点击事件
  listItemClickFn = (item) => {
    // 有数据的城市信息
    const cityIsOk = ['北京', '上海', '广州', '深圳']
    if (cityIsOk.indexOf(item.label) > -1) {
      // 是有效城市
      const { label, value } = item
      window.localStorage.setItem('city', JSON.stringify({ label, value }))
      Toast.success('城市切换成功',1.5,()=>{this.props.history.go(-1)},false)
    }else Toast.offline('很抱歉当前城市未开通', 2,null,false);
  }

  rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) {
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]
    const cityListRender = cityList[letter]
    return (
      <div key={key} style={style}>
        <div className='citylist-root-listtitle'>{cityTitle(letter)}</div>
        {cityListRender.map(item =>
          <div
            key={item.pinyin}
            className='citylist-root-listitem'
            onClick={() => { this.listItemClickFn(item) }}
          >
            {item.label}
          </div>)}
      </div>
    )
  }

  //索引点击事件
  indexClickFn = (index) => {
    this.state.listRef.current.scrollToRow(index)
  }
  // list滚动事件
  indexScrollFn = (e) => {
    // console.log(e)
    // 判断startIndex和当前选中索引是否一样
    //当前选中是this.state.cityIndex.findIndex(this.state.indexSelected)
    const { cityIndex, indexSelected } = this.state
    const index = cityIndex.indexOf(indexSelected)
    if (index !== e.startIndex) {
      //满足条件代表滚动到第二个城市类别了
      this.setState({ indexSelected: cityIndex[e.startIndex] })
    }
  }

  //解决索引Z的内容没有整个屏幕那么多所以不会出现在第一行，背景设置到y身上了
  // 也是滚动事件 能获取scrollHeight 和scrollTop 和clientHeight
  // 总高度减去可视区高度就是滑动到底部 Z应该选中
  scrollFn = (e) => {
    const foot = e.scrollHeight - e.clientHeight
    if (foot === e.scrollTop) {
      this.setState({ indexSelected: 'z' })
    }
  }
  render() {
    return <div className='citylist-root'>
      <Nav
        title='城市选择'
      />
      <div className='citylist-root-box'>
        <AutoSizer>
          {({ width, height }) =>
            <List
              ref={this.state.listRef}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.rowHeightFn}
              rowRenderer={
                this.rowRenderer.bind(this)
              }
              onRowsRendered={this.indexScrollFn}
              scrollToAlignment='start'
              onScroll={this.scrollFn}
            />
          }
        </AutoSizer>
        <ul className='city-index-box'>
          {this.state.cityIndex.map((item, index) =>
            <li
              key={item}
              className={
                `city-index-box-item 
                ${item === this.state.indexSelected
                  ? ' city-index-box-item-selected'
                  : false}`
              }

            >
              <span
                onClick={() => this.indexClickFn(index)}
              >
                {item === 'hot' ? '热' : item.toUpperCase()}</span>
            </li>)}
        </ul>
      </div>
    </div>
  }
}
export default CityList;