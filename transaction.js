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
* 交易Transaction类
* 交易需要包含三个核心属性：发送人地址fromAddress
* 接受人地址toAddress，交易数量amount
*/
class Transaction {
	constructor (fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress
		this.toAddress = toAddress
		this.amount = amount
	}
}

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
  constructor (timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp
    this.transactions = transactions
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
    this.pendingTransactions = []
    this.miningReward = 100
  }
  /*
  * 创建初始化Block区块
  */
  createGenesisBlock () {
    return new Block('01/01/2018', 'Genesis block created by Steve', '0')
  }
  /*
  * 获取最新的Block区块
  */
  getLatestBlock () {
    return this.chain[this.chain.length - 1]
  }
  /*
  * 交易挖矿函数，接受参数：挖矿成功者的钱包地址
  */
  minePendingTransactions (miningRewardAddress) {
  	// 选择需要进行挖矿的待产生交易
  	let block = new Block(Date.now(), this.pendingTransactions)
    // 获取当前最新Block的hash值，赋值给新添加Block区块的previousHash属性
    block.previousHash = this.getLatestBlock().hash
  	// 开始挖矿
  	block.mineBlock(this.difficulty)
    // 挖矿成功后，将新的Block添加至区块链数组中
    this.chain.push(block)
    // 给挖矿成功者发放奖励，进入待产生交易数组中
    // 由于发放奖励没有fromAddress地址，所以为null
    this.pendingTransactions = [
   		new Transaction(null, miningRewardAddress, this.miningReward)
   	]
  }
  /*
  * 创建交易记录
  */
  createTransaction (transaction) {
  	this.pendingTransactions.push(transaction)
  }
  /*
  * 查询账户余额
  */
  getBalanceOfAddress (address) {
  	let balance = 0
  	for (const block of this.chain) {
  		for (const trans of block.transactions) {
  			if (trans.fromAddress === address) {
  				balance -= trans.amount
  			}
  			if (trans.toAddress === address) {
  				balance += trans.amount
  			}
  		}
  	}
  	return balance
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
PhocusCoin.createTransaction(new Transaction('address1', 'address2', 100))
PhocusCoin.createTransaction(new Transaction('address2', 'address3', 80))

console.log('\n 开始挖矿Start Mining...')
PhocusCoin.minePendingTransactions('Steve-Wallet-Address')
console.log('\n 您的账户余额为：' + PhocusCoin.getBalanceOfAddress('Steve-Wallet-Address'))

console.log('\n 再次开始挖矿Start Mining...')
PhocusCoin.minePendingTransactions('Steve-Wallet-Address')
console.log('\n 您的账户余额为：' + PhocusCoin.getBalanceOfAddress('Steve-Wallet-Address'))

console.log(JSON.stringify(PhocusCoin, null, 4))



