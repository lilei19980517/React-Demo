import React from 'react';
import styles from './index.module.scss'
import FilterTitle from '../FilterTitle/index'
import FilterPicker from '../FilterPicker/index'
import instance from '../../utils/axios'
import getDeep from '../../utils/getDeep'
import Drawer from '../Drawer/index'

class Filter extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			filterTitle: {
				tabs: [
					{ title: '区域', key: 'area' },
					{ title: '方式', key: 'rentType' },
					{ title: '租金', key: 'price' },
					{ title: '筛选', key: 'more' },
				],
				isHighlight: [],
				activeColor: '#108ee9',
				tabClickFn: this.tabClickFn,
			},
			filterPicker: {
				values: {
					area: [],
					rentType: [],
					price: []
				},
				//区域
				area: {
					type: 'area',
					data: [],
					cols: 3,
					value: [],
					pickerChange: this.pickerChange
				},
				// 方式
				rentType: {
					type: 'rentType',
					data: [],
					cols: 3,
					value: [],
					pickerChange: this.pickerChange
				},
				// 价格
				price: {
					type: 'price',
					data: [],
					cols: 3,
					value: [],
					pickerChange: this.pickerChange
				},
				// 确定和取消按钮
				buttons: [
					{
						value: '取消',
						key: 'close',
						backgroundColor: '#fff',
						clickFn: this.closeFn,
					},
					{
						value: '确认',
						key: 'confirm',
						backgroundColor: '#4caf50',
						clickFn: this.confirmFn
					}
				],
				// 控制所展示的筛选内容
				isPickerShow: '',
			},
			filterMore: {
				itemClick: this.filterMoreItemClick,
				onOpenChange: this.filterMoreOpenChange,
				open: false,
				data: [
					{ type: 'roomType', title: '户型', id: 1, items: [], values: [] },
					{ type: 'subway', title: '地铁', id: 2, items: [], values: [] },
					{ type: 'oriented', title: '朝向', id: 3, items: [], values: [] },
					{ type: 'floor', title: '楼层', id: 4, items: [], values: [] },
					{ type: 'characteristic', title: '其他', id: 5, items: [], values: [] },
				],
				buttons: [
					{
						value: '重置',
						key: 'close',
						backgroundColor: '#fff',
						clickFn: this.filterMoreReset
					},
					{
						value: '确认',
						key: 'confirm',
						backgroundColor: '#4caf50'
					}
				]
			}
		}
	}

	componentDidMount() {
		this.getFilterData()
	}
	//FilterTitle组件所需props
	tabClickFn = (key) => {

		// 如果点了最后一个筛选更多 key='more'
		if (key === 'more') return this.setFilterState('filterMore', { open: true })
		// 组件不能给已经卸载的设置state，所以在setState回调中设置
		this.setFilterState('filterPicker', { isPickerShow: key }, () => {
			// 恢复默认值为values里面的，values是点过确定的
			this.resetPickerValue()
			this.setFilterState('filterTitle', { activeColor: '#108ee9' })
		})
		console.log(this.state.filterPicker.price.value)
	}
	// FilterPicker组件所需props函数
	// 拿到选中的数据
	getPickerData = (values) => {
		// 拿区域数据要拿最后一个有效值，如果最后一个为null则取前一个
		const { area, rentType, price } = values
		const length = area.length
		if(length!==0){
			area[length-1]==='null'&&area.splice(length-1)//最后一个不要
		}
		return {area,rentType,price}
	}

	confirmFn = () => {
		// 点击了确认将选中值存入values中进行记录
		const values = this.state.filterPicker.values
		// 获取各个类别的values
		const { area, rentType, price } = this.state.filterPicker
		values['area'] = area.value
		values['rentType'] = rentType.value
		values['price'] = price.value
		// 判断有没有有效选择，有则让当前标题高亮
		// 获取当前展开的类别时哪一个
		const { isPickerShow } = this.state.filterPicker
		console.log(isPickerShow)
		const { isHighlight } = this.state.filterTitle
		// 通过当前展示的类别去针对性判断并设置是否高亮
		const index = isHighlight.indexOf(isPickerShow)
		if (values[isPickerShow][0]) {
			// 进来证明不是什么都没选，不是空状态
			// 看看是不是选的null
			if (values[isPickerShow][0] !== 'null') {
				// ok可以高亮了
				isHighlight.push(isPickerShow)
			} else {
				console.log(index)
				if (index >= 0) {
					isHighlight.splice(index, 1)
				}
			}
		}
		// 暂存values中，因为有点击取消按钮，不能直接设置默认值
		this.setFilterState('filterPicker', { values }, () => {
			this.setFilterState('filterPicker', { isPickerShow: '' })
		})
		this.setFilterState('filterTitle', { isHighlight })
	// 	// 拿到筛选数据
		const pickerData = this.getPickerData(values)
	// 	// 调用父组件getListData将筛选数据传入父组件
		this.props.getHouseList(pickerData)
	}
	closeFn = () => {
		// 获取刚刚打开没有更改之前的默认值
		this.setFilterState('filterPicker', { isPickerShow: '' })
	}

	pickerChange = (val, type) => {// pikerChange 选中后的回调，获取选中值
		const state = this.state.filterPicker[type]
		state.value = val
		// 暂时先设置一下选中默认值，否则滑动后自动归位默认值了
		this.setFilterState('filterPicker', { [type]: state })
		console.log(val)
	}
	// Drawer所需props
	filterMoreOpenChange = () => {
		this.setFilterState('filterMore', { open: false })
	}
	filterMoreReset = () => {
		// 清除所有values
		const { data } = this.state.filterMore
		for (let name in data) {
			data[name].values = []
		}
		this.setFilterState('filterMore', { data })
	}
	// 每个一按钮点击事件 子组件传来type用来判断哪个类型，value用来提供设置values
	// 还有一个问题当已经选中了再点击就是取消
	filterMoreItemClick = (type, value) => {
		const { data } = this.state.filterMore
		for (let key in data) {
			if (data[key].type === type) {
				// 判断是否已经选中了，indexOf>=0就是已经有了
				const index = data[key].values.indexOf(value)
				index >= 0
					?
					data[key].values.splice(index, 1)
					:
					data[key].values.push(value)
				this.setFilterState('filterMore', { data })
			}
		}
	}
	// Filter自身
	// 请求数据
	async getFilterData() {
		const city = window.localStorage.getItem('city')
		const value = city ? JSON.parse(city).value : 'AREA|88cff55c-aaa4-e2e0'
		const res = await instance.get(`/houses/condition?id=${value}`)
		const {
			area: { children: area },
			rentType,
			price,
			roomType,
			subway: { children: subway },
			oriented,
			floor,
			characteristic
		} = res.data.body
		const { data } = this.state.filterMore
		data[0].items = roomType
		data[1].items = subway
		data[2].items = oriented
		data[3].items = floor
		data[4].items = characteristic
		this.setFilterState('filterMore', { data }, () => { console.log(this) })
		const {
			area: stateArea,
			rentType: stateRentType,
			price: statePrice
		} = this.state.filterPicker
		stateArea.data = area
		stateArea.cols = getDeep(area) / 2
		stateRentType.data = rentType
		stateRentType.cols = getDeep(rentType) / 2
		statePrice.data = price
		statePrice.cols = getDeep(price) / 2
		this.setFilterState('filterPicker', { area: stateArea })
		this.setFilterState('filterPicker', { rentType: stateRentType })
		this.setFilterState('filterPicker', { price: statePrice })
	}
	// 为对象类型state更新状态 
	setFilterState(name, obj, callback) {
		this.setState({
			[name]: Object.assign(this.state[name], obj)
		}, () => { callback && callback() })
	}
	// 恢复filterPicker组件原始默认选中值
	resetPickerValue() {
		const { area, rentType, price } = this.state.filterPicker
		const { values } = this.state.filterPicker
		console.log(values)
		area.value = values['area']
		rentType.value = values['rentType']
		price.value = values['price']
		this.setFilterState('filterPicker', { area, rentType, price })
	}
	// 遮罩隐藏
	maskHidnFn = () => {
		this.setFilterState('filterTitle', { activeColor: '#000' })
		this.setFilterState('filterPicker', { isPickerShow: '' })
	}
	// 条件渲染FilterPicker
	renderFilterPicker() {
		const {
			area,
			rentType,
			price
		} = this.state.filterPicker
		const buttons = this.state.filterPicker.buttons
		const areaProps = { ...area, buttons }
		const rentTypeProps = { ...rentType, buttons }
		const priceProps = { ...price, buttons }
		switch (this.state.filterPicker.isPickerShow) {
			case 'area': return <FilterPicker {...areaProps} />;
			case 'rentType': return <FilterPicker {...rentTypeProps} />;
			case 'price': return <FilterPicker {...priceProps} />;
			default: return <div></div>;
		}
	}

	render() {
		return <div class={styles.filter}>
			<FilterTitle {...this.state.filterTitle} />
			{/* 遮罩层  如果FilterPicker都显示了那么遮罩层一定显示*/}
			{this.state.filterPicker.isPickerShow.length !== 0
				&& <div
					class={styles.mask}
					onClick={this.maskHidnFn} />}
			{/* 前三个TitlePicker */}
			{this.renderFilterPicker()}
			{/* 最后一个more */}
			<Drawer {...this.state.filterMore} />
		</div>
	}
}
export default Filter