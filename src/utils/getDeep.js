function getDeep(obj) {
	let res = 1
	// 递归函数
	function fn(obj) {
		let arr = []
		let arrLength = arr.length
		// 先遍历是不是里面还有对象类型，是就计数
		for (let item in obj) {
			if (typeof (obj[item]) === 'object') {
				// 然后把这个再存到数组中下次遍历
				// arr.push([...obj[item]])
				// 要分别存入，否则下次死循环
				for (let key in obj[item]) {
					arr.push(obj[item][key])
				}
			}
		}
		// 循环结束后判断arr有没有增加
		if (arr.length > arrLength) {
			res++
			arrLength = arr.length
			// 继续递归
			return fn(arr)
		} else return res
	}
	return fn(obj)
}
export default getDeep