# Getting Started with Create React App

## Get Started

### Install Dependencies

```
npm i
```

### Expose INFURA_ID and IPFS_HOST

```
export INFURA_ID=xxx && export INFURA_ID=http://localhost:10098
```

### Start frontend

```
npm run serve
```

## Deploy Contract

### Download Ganache

Download ganache from [https://www.trufflesuite.com/ganache](https://www.trufflesuite.com/ganache) and start ganache gui.

### Install truffle

```
npm i truffle -g
```

### Deploy contract

```
cd blockchain && truffle migrate --network development; cd -
```

## Mint

```
npm run mint -- --network-id 5777 --wallet-address 0x570A6F85c22ad6aAC932060c6b30aa3167171E0E --json-rpc-address http://127.0.0.1:7545
```
