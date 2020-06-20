var abiDir;
if (process.env.NETWORK) {
  abiDir = "./build/"+process.env.NETWORK
} else {
  abiDir = "./build/contracts"
}

module.exports = {
  "server": {
    "baseDir": ["./src", abiDir]
  },
  "port": process.env.PORT
}
