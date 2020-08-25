module.exports = {
	// 处理数组对象中图片路径加前缀
	arr1(arr, attr, string) {
		return arr.filter(item => {
			return item[attr] = string + item[attr]
		})
	},
}
