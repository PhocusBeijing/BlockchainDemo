/*
* Project: 用JavaScript写一个区块链
* Author: Steve @ Phocus
* Inspired By: Savjee
* Date: 2018-07-24
*/

/* 
* 引入SHA256函数
*/
const SHA256 = require('crypto-js/sha256')

/*
* 构建Block区块的类
*/
class Block {
  /*
  * index，当前Block的序号
  * timestamp，当前Block的时间戳
  * data，当前Block包含的数据
  * previousHash，前一个Block的Hash值
  */
  constructor (index, timestamp, data, previousHash = '') {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }
  
  /* 
  * 构建Hash计算函数，用于生成当前Block的Hash值
  * 这里使用SHA-256算法来计算，需要提前安装
  */
  calculateHash () {
    var hashResult = '', hashData = ''
    // 需要计算的数据
    hashData = this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce
    // 将返回的对象转化为字符串
    hashResult = SHA256(hashData).toString()
    return hashResult
  }

  /*
  * Block Mining区块挖矿函数
  * 挖矿函数需要参数Difficulty难度级别
  */
  mineBlock (difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++
      this.hash = this.calculateHash()
    }
    console.log('恭喜，挖矿成功：' + this.hash)
  }
}

/*
* 构建Blockchain区块链的类
*/
class Blockchain {
  /*
  * 负责对Blockchain区块链进行初始化
  */
  constructor () {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 3
  }
  /*
  * 创建初始化Block区块
  */
  createGenesisBlock () {
    return new Block(0, '01/01/2018', 'Genesis block created by Steve', '0')
  }
  /*
  * 获取最新的Block区块
  */
  getLatestBlock () {
    return this.chain[this.chain.length - 1]
  }
  /*
  * 添加新的Block区块
  */
  addBlock (newBlock) {
    // 获取当前最新Block的hash值，赋值给新添加Block区块的previousHash属性
    newBlock.previousHash = this.getLatestBlock().hash
    // 通过挖矿的方式计算新添加Block区块的Hash值，每添加一个新区块都需要计算一次
    newBlock.mineBlock(this.difficulty)
    // 将新的Block区块添加至Blockchain区块链数组中
    this.chain.push(newBlock)
  }
  /*
  * 判断当前区块链是否有效
  */
  isChainValid () {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]
      // 比较当前Block的hash值是否与重新计算的Hash值一致
      // 如果不一致，说明数据被篡改了，则返回false
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }
      // 比较当前Block的previousHash值与前一个区块的Hash值是否一直
      // 如果不一致，说明其中一个区块被篡改了，返回false
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }
}

/*
* 创建Instance实例
*/
let PhocusCoin = new Blockchain()
PhocusCoin.addBlock(new Block(1, '01/23/2018', {amount: 4}))
PhocusCoin.addBlock(new Block(2, '02/12/2018', {amount: 8}))
PhocusCoin.addBlock(new Block(3, '03/18/2018', {amount: 12}))

/*
* 打印当前区块链结果
*/
console.log(JSON.stringify(PhocusCoin, null, 4))
console.log('当前区块链是有效的吗? ' + PhocusCoin.isChainValid())

// End of the code



