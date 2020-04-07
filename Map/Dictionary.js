export default class Dictionary {
	constructor() {
	    this.map = {}
	}
	
	/**
	 * 获取元素值
	 * */
	get(key) {
		return this.has(key) ? this.map[key] : undefined;
	}
	
	/**
	 * 添加新元素
	 * */
	set(key, value) {
		if (this.has(key)) return false;
		
		this.map[key] = value
	}
	/**
	 * 删除元素
	 * */
	remove(key) {
		if (this.has(key)) {
			delete this.map(key)
			return true
		}
		return false
	}
	
	/**
	 * 打印键值
	 * */
	keys() {
		const temp = [];
		for (let key in this.map) {
			if (this.has(key)) {
				temp.push(key)
			}
		}
		return temp;
	}
	
	/**
	 * 打印值
	 * */
	values() {
		const temp = [];
		for (let key in this.map) {
			if (this.has(key)) {
				temp.push(this.map[key])
			}
		}
		return temp;
	}

	/**
	 * 判断在字典中是否存在
	 * @param { String } key
	*/
	has(key) {
		return this.map.hasOwnProperty(key)
	}
	
	/**
	 * 获取大小
	 * */
	size() {
		let count = 0;
		for (let key in this.map) {
			if (this.has(key)) {
				count++;
			}
		}
		return count;
	}
	
	/**
	 * 清空
	 * */
	clear() {
		this.map = {}
	}
}