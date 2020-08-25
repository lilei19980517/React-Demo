// 首先将数组每一项改装成 {a:[a开头的城市]}，数组每一项有short取第一个
function citySort(arr) {
  const cityList = {}
  const cityIndex = []
  arr.forEach(item => {
    const first = item.short.substr(0, 1)
    if (cityList[first]) {
      cityList[first].push(item)
    } else {
      cityList[first] = [item]
      cityIndex.push(first)
    }
  });
  cityIndex.sort()
  cityIndex.unshift('#','hot')
  return {
    cityList,
    cityIndex
  }
}
export default citySort