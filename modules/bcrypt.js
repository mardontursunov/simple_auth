const bcrypt = require('bcrypt')
const saltRounds = 10

async function generateHash(data) {
	let salt = await bcrypt.genSalt(saltRounds)
	let hash = await bcrypt.hashSync(data, salt)
	return hash
}

async function confirmHash(data, hash) {
	let compare = await bcrypt.compareSync(data, hash)
	return compare
}

module.exports = {
	generateHash,
	confirmHash
}