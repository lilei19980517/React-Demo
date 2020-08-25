import React from 'react';
import styles from './index.module.scss'
import Button from '../Button/Button'
import { PickerView } from 'antd-mobile'

class FilterPicker extends React.Component {
	constructor(props) {
		super(props)
		// this.state = {
		// }
	}



	render() {
		return <div class={styles.picker}>
			<PickerView
				cols={this.props.cols || 3}
				data={this.props.data}
				value={this.props.value}
				indicatorStyle={{ backgroundColor: '#ddd5' }}
				onChange={(val)=>{this.props.pickerChange(val,this.props.type)}}
			/>
			<Button buttons={this.props.buttons} />
		</div>
	}
}

FilterPicker.defaultProps = {
	// pikerChange(val){
	// 	console.log(val)
	// },
	data: [
		{
			label: '北京',
			value: '01',
			children: [
				{
					label: '东城区',
					value: '01-1',
				},
				{
					label: '西城区',
					value: '01-2',
				},
				{
					label: '崇文区',
					value: '01-3',
				},
				{
					label: '宣武区',
					value: '01-4',
				},
			],
		},
		{
			label: '浙江',
			value: '02',
			children: [
				{
					label: '杭州',
					value: '02-1',
					children: [
						{
							label: '西湖区',
							value: '02-1-1',
						},
						{
							label: '上城区',
							value: '02-1-2',
						},
						{
							label: '江干区',
							value: '02-1-3',
						},
						{
							label: '下城区',
							value: '02-1-4',
						},
					],
				},
				{
					label: '宁波',
					value: '02-2',
					children: [
						{
							label: 'xx区',
							value: '02-2-1',
						},
						{
							label: 'yy区',
							value: '02-2-2',
						},
					],
				},
				{
					label: '温州',
					value: '02-3',
				},
				{
					label: '嘉兴',
					value: '02-4',
				},
				{
					label: '湖州',
					value: '02-5',
				},
				{
					label: '绍兴',
					value: '02-6',
				},
			],
		},
	]

}
export default FilterPicker