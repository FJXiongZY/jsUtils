// 散列表 - 线性探测法解决散列碰撞
export default class HashTable {
	constructor() {
		this.dataStore = []; // 存储散列表的 key值
	    this.table = []; // 存储散列表数据
	}
	// 获取
	get(key) {
		const { table, dataStore } = this;
		let position = this.getHashCode(key);
		while (table[position] && dataStore[position] !== key) {
			position++;
		}
		return this.table[position]
	}
	// 获取全部数据
	getAll() {
		return this.table
	}
	// 添加
	set(key, value) {
		let position = this.getHashCode(key);
		while (this.table[position]) {
			position++;
		}
		this.dataStore[position] = key
		this.table[position] = value
	}
	// 删除
	remove(key) {
		const { table, dataStore } = this;
		let position = this.getHashCode(key);
		while (table[position] && dataStore[position] !== key) {
			position++;
		}
		this.table[position] = undefined;
	}
	// 获取大小
	size() {
		return this.table.length;
	}
	// 获取key的 Unicode 编码
	getHashCode(key) {
		let hash = 0;
		for (let i = 0, len = key.length; i < len; i ++) {
			hash += key.charCodeAt(i)
		}
		return hash % 37;
	}
}
