import React from 'react';
// import './Map.scss'
import styles from './Map.module.scss'
import Nav from '../Nav/Nav'
import instance from '../../utils/axios'
import { Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { AutoSizer, List } from 'react-virtualized'
import { BASE_URL } from '../../utils/url';
const BMap = window.BMap

class Map extends React.Component {
  constructor(props) {
    super(props)
    const ref = React.createRef()
    this.state = {
      isShowList: false,
      housesList: [],
      ref:this.ref,
    }
  }

  onLeftClick = () => {
    this.props.history.go(-1)
  }

  componentDidMount() {
    const city = JSON.parse(window.localStorage.getItem('city'))
    var map = new BMap.Map("map-root-container");
    // 获取当前城市信息
    const label = city ? city.label : "上海"
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野   
    const { getHouse, renderOverlay } = this
    myGeo.getPoint(label, async function (point) {
      if (point) {
        map.centerAndZoom(point, 11);
        map.addControl(new BMap.ScaleControl());
        map.addControl(new BMap.NavigationControl());
        // 地图渲染后
        // 获取房源信息
        const house = await getHouse(city ? city.value : 'AREA|dbf46d32-7e76-1196')
        // 设置文本标注
        // house.forEach(item => {
        // 	const { coord: { longitude, latitude }, label: name, count, value } = item
        // 	const textPoint = new BMap.Point(longitude, latitude)
        // 	const opts = {
        // 		position: textPoint,
        // 		offset: new BMap.Size(30, -30)
        // 	}
        // 	const Label = new BMap.Label('', opts)        // 创建标注
        // 	Label.setContent(`
        // 	<div class="${styles.overlay}">
        // 		<p class="${styles.overlayText}">${name}</p>
        // 		<span class="${styles.overlayNum}">${count}</span>
        // 	</div>
        // `)
        // 	Label.addEventListener('click', () => { overlayClickFn(map, textPoint, 13) })
        // 	map.addOverlay(Label);
        // });
        // 获取下一个应该设置的级别与类型
        renderOverlay(map, house, { zoom: 11, type: 'circle' })

      }
    },
      label);
  }

  // 获取房源信息
  getHouse = async (area, type) => {
    Toast.loading("正在加载...", 0, null, false)
    if (type === 'list') {
      const res = await instance.get(`/houses?cityId=${area}`)
      Toast.hide()
      return res.data.body.list
    }
    const res = await instance.get(`/area/map?id=${area}`).catch(err => err)
    Toast.hide()
    if (res.name === 'Error') {
      Toast.hide()
      if (res.request) {
        // 重新设置请求时间为15秒 state.num默认15
        Toast.loading(`请求超时正在重试...`, 0, null, false)
        const res = await instance.get(
          `/area/map?id=${area}`,
          { timeout: 22000 })
          .catch(err => err)
        if (res.name !== "Error") {
          Toast.hide()
          return res.data.body
        }

      }
      Toast.fail('异常错误', 1, null, false)

      return []
    }
    return res.data.body
  }

  //地图标注点击事件
  overlayClickFn = async (map, value, point) => {
    // 判断下次渲染类型
    const obj = this.nextContent(map)
    if (obj.type !== 'list') {
      //清除标注
      setTimeout(() => {
        map.clearOverlays()
      }, 0)
      // 先放大地图和设置中心点
      // 重新渲染地图
    } else {
      // 要展示房屋列表信息了
      const house = await this.getHouse(value, obj.type)
      map.centerAndZoom(point, obj.zoom)
      // Toast.hide()
      return this.setState({
        housesList: house,
        isShowList: true
      })
    }
    // Toast.loading("正在加载...", 0, null)
    // 之后重新获取数据
    const house = await this.getHouse(value, obj.type)
    map.centerAndZoom(point, obj.zoom)
    this.renderOverlay(map, house, obj)
  }

  nextContent = (map) => {
    const zoom = map.getZoom()
    // 判断下一次渲染级别和类型
    switch (zoom) {
      case 11: return {
        zoom: 13,
        type: 'circle'
      }
      case 13: return {
        zoom: 15,
        type: 'rect'
      }
      default: return {
        zoom,
        type: 'list'
      }
    }
  }

  // 渲染标记 arr请求回来的数组 obj {zoom,type} type "circle" or "rect"
  renderOverlay = (map, arr, obj) => {
    arr.forEach(item => {
      const { coord: { longitude, latitude }, label: name, count, value } = item
      const textPoint = new BMap.Point(longitude, latitude)
      let opts = {
        position: textPoint,
        offset: new BMap.Size(30, -30)
      }
      let Label = new BMap.Label('', opts)        // 创建标注
      if (obj.type === 'circle') {
        Label.setContent(`
				<div class="${styles.overlay}">
					<p class="${styles.overlayText}">${name}</p>
					<span class="${styles.overlayNum}">${count}</span>
				</div>
			`)
        Label.addEventListener('click', () => { this.overlayClickFn(map, value, textPoint) })
      } else {
        // 修改标注偏移
        let opts = {
          position: textPoint,
          offset: new BMap.Size(0, 40)
        }
        Label = new BMap.Label('', opts)
        Label.setContent(`
			<div class="${styles.overlayRect}">
			<p class="${styles.overlayRectText}">${name}</p>
			<span class="${styles.overlayRectNum}">${count}</span>
			<div class='${styles.triganle}'>
			</div>
			</div>
			`)
        Label.addEventListener('click', () => { this.overlayClickFn(map, value, textPoint) })
      }

      map.addOverlay(Label);
    });
  }

  // 房屋信息
  rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) {
    const { housesList } = this.state
    return (
      <div className={styles.house} key={key}>
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={`${BASE_URL}${housesList[index].houseImg}`}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{housesList[index].title}</h3>
          <div className={styles.desc}>{housesList[index].desc}</div>
          <div>
            {housesList[index].tags.map(tag => (
              <span
                className={[styles.tag, styles[`tag${index%3+1}`]].join(' ')}
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{housesList[index].price}</span> 元/月
        </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles['map-root']}>
        <Nav
          onLeftClick={this.onLeftClick}
          title="地图找房"
        />
        <div id='map-root-container' className={styles.box}></div>
        {/* 房屋信息 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : ''
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/findhouse">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            <AutoSizer>
              {({ width, height }) =>
                <List
                  ref={this.state.ref}
                  width={width}
                  height={height}
                  rowCount={this.state.housesList.length}
                  rowHeight={120}
                  rowRenderer={
                    this.rowRenderer.bind(this)
                  }
                  // overscanRowCount={10}
                />
              }
            </AutoSizer>
            {/* {this.state.housesList.map(item => (
							<div className={styles.house} key={item.houseCode}>
								<div className={styles.imgWrap}>
									<img
										className={styles.img}
										src={`http://192.168.1.6:8080${item.houseImg}`}
										alt=""
									/>
								</div>
								<div className={styles.content}>
									<h3 className={styles.title}>{item.title}</h3>
									<div className={styles.desc}>{item.desc}</div>
									<div>
										{item.tags.map(tag => (
											<span
												className={[styles.tag, styles.tag1].join(' ')}
												key={tag}
											>
												{tag}
											</span>
										))}
									</div>
									<div className={styles.price}>
										<span className={styles.priceNum}>{item.price}</span> 元/月
                  </div>
								</div>
							</div>
						))} */}
          </div>
        </div>
      </div>
    )
  }
}

export default Map