# Gremlin

A NFT demo dapp with marketplace.

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

### Deploy to test network

[Signup](https://infura.io/) your INFURA account and get your JSON_RPC_ADDRESS.

```
export PRIVATE_KEYS=xxx;
export JSON_RPC_ADDRESS=https://rinkeby.infura.io/v3/xxx;
cd blockchain && truffle migrate --network rinkeby; cd -
```

## Mint

### Local

Get you `wallet-private-key` from ganache ui `accounts` list

```
npm run mint -- --network-id 5777 --wallet-private-key xxx --json-rpc-address http://127.0.0.1:7545 --ipfs-gateway-address http://43.132.190.75:5001
```

### Test net

```
npm run mint -- --network-id 4 --wallet-private-key 2a251a2ad5695a8b5c693d76df0c7e275e10b82d402f2721dcfd8fd78d5b57c2 --json-rpc-address https://rinkeby.infura.io/v3/xxx --ipfs-gateway-address http://43.132.190.75:5001
```
