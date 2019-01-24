# Klaytn-Based NFT Photo Licensing Application Tutorial

## Table of Contents
* [A. Introduction](1-introduction.md)
* [B. Environment Setup](2-environment-setup.md)
* [C. Scaffolding](3-scaffolding.md)
* [D. Directory Structure](4-directory-structure.md)
* [E. Write Klaystagram Smart Contract](5-write-smart-contract.md)
* [F. Deploy Contract](6-deploy-contract.md)
* [G. Frontend Code Overview](7-frontend-overview.md)
* [H. FeedPage](8-feedpage.md)
  - [H-1. Connect Contract to Frontend](8-1-feedpage-connect-contract.md)
  - [H-2. UploadPhoto Component](8-2-feedpage-uploadphoto.md)
  - [H-3. Feed Component](8-3-feedpage-feed.md)
  - [H-4. TransferOwnership Component](8-4-feedpage-transferownership.md)
* [I. Run App](9-run-app.md)

## A. Introduction

<video src="./static/tutorial/klaystagramo-video.mov" autoplay poster="./static/tutorial/klaystagram-sending-trasaction.png" style="width: 700px;"></video>

In this tutorial, we are going to make "Klaytn-based NFT photo licensing application", also known as `Klaystagram`.

NFT refers to non-fungible token, which is a special type of token that represents a unique asset. As the name non-fungible implies, every single token is unique. And this uniquenss of NFT opens up new horizons of asset digitization. For example it can be used to represent digital art, game items, or any kind of unique assets and allow people to trade them. For more information, refer to this [article](https://coincentral.com/nfts-non-fungible-tokens/).  

In `Klaystagram`, every token represents users' unique pictures. When a user uploads a photo, a unique token is created containing its ownership information and image source. All transactions are recorded on blockchain, so even service provider does not have control over the uploaded photos. Considering the purpose of this tutorial, only core functions are implemented. After finishing this tutorial, try adding some more cool features and make your own creative service.

There are three main features.

1. **Upload photo**  
Users can upload photo along with description on the Klaytn blockchain. The photo will be tokenized.

2. **Feed**  
Shows all the photos uploaded on the blockchain.

3. **Transfer ownership**  
The owner of the photo can transfer photo ownership to another user and it will be shown in ownership history.

We will learn how to make an web application that interacts with smart contracts. Thus, basic knowledge regarding Solidity, Javascript, and React is required.  

[Next: Environment setup](2-environment-setup.md)


---

## B. Environment Setup

### 1) Install node.js(npm)
\- Download node.js(npm) from the official site: https://nodejs.org/  
\- Type `$ npm -v` in your terminal to check if you already have one. 

### 2) Install truffle
\- Truffle is a great tool for compiling and deploying contract files.  
\- Type `$ npm install -g truffle` in your terminal.  
\- Also type `$ truffle -v` in your terminal to check if you already have one.

[Next: Scaffolding](3-scaffolding.md)

---

## C. Scaffolding installation

![yo-klaystagram-install.gif](./static/tutorial/klaystagram-scaffolding.png)

### 1) Install Yeoman Generator  
Yeoman Generator is generic scaffolding tool for creating any kind of app.  
We will use it to create a klaytn-based blockchain application.  
\- `$ npm install -g yo`

### 2) Install Klay-Dapp Generator  
\- `$ npm install -g generator-klay-dapp`

### 3) Scaffold it!  
\- `$ mkdir klaystagram` - Make a new directory called 'klaystagram'  
\- `$ cd klaystagram` - Enter the directory  
\- `$ yo klaystagram` - Scaffold klay-dapp  

Now your 'Klaystagram' directory should be filled with files.
Let's look at them in detail.

#### \*Do you want to run Klaystagram app right now?
Actually the package you just downloaded is ready to go without any modification. If you want to run the app right away and see how it works, type in `$ npm intall` and `$ npm run local`. Application will pop up right away.

[Next: Directory structure](4-directory-structure.md)

---

## D. Directory structure

```
|-- contracts
|-- migrations
|-- truffle.js
|-- static
|-- src
    |-- klaytn
      |-- caver.js
      |-- Klaystagram.js
    |-- redux
    |-- pages
      |-- AuthPage.js
      |-- MainPage.js
    |-- components
      |-- UploadPhoto.js
      |-- Feed.js
      |-- TransferOwnership.js
      |-- ...
    |-- styles
    |-- utils
    |-- index.js
    |-- App.js
```

`contracts/`: Contains Solidity contract files.  

`migrations/`: Contains javascript files that handle smart contract deployments.

`truffle.js`: Truffle configuration file.  

`src/klaytn`: Contains files that help interact with klaytn blockchain.
* `src/klaytn/caver.js`: Instantiates caver within configured setting.  
cf) caver-js is a RPC call library which makes a connection to klaytn node, interacting with node or smart contract deployed on klaytn.
* `src/klaytn/Klaystagram.js`: Creates an instance of contract using caver-js API. You can interact with contract through the instance  

`src/redux`: Creates API functions that interacts with contract and keep tracks of consequent data.

`src/pages`: Contains frontend javascript files. 
* `src/pages/AuthPage.js`: Contains sign up and login form. You can generate private key in the sign up form and use it to login on the app.
* `src/pages/FeedPage.js`: Reads photo data from the contract and show them to users. Also users can upload their pictures.


`src/components`: Contains frontend component files. =  
* `src/components/Feed.js`: Reads data from contract and displays photos
* `src/components/UploadPhoto.js`: Uploads photo by sending transaction to contract 
* `src/components/TransferOwnership.js`: Transfers photo's ownership by sending transaction


`src/styles`: Overall style definition regarding stylesheet  
`static/`: Contains static files, such as images.
`src/index.js`: App's index file. ReactDOM.render logic is in here.  
`src/App.js`: App's root component file.  

[Next: Write smart contract](5-write-smart-contract.md)

---

## E. Write Smart Contract

1) Background
2) Contract setup
3) Set events and data structure
4) Write functions
    * `uploadPhoto`
    * `transferOwnership`

### 1) Background
We will make a simple contract called "Klaystagram".  
* `PhotoData` struct is defined to store various photo data.  
* User can upload photo and transfer the ownership photo via `uploadPhoto` and `transferOwnership` functions.

### 2) Contract setup 
* Specify solidity version. We recommend using 0.4.24 stable version.
* We will make use of ERC721 standard to build non-fungible tokens.  
  * Import `ERC721.sol` and `ERC721Enumerable.sol`
  * Check out detailed information about ERC721 at [erc721.org](http://erc721.org)
```solidity
pragma solidity 0.4.24;

import "./ERC721/ERC721.sol";
import "./ERC721/ERC721Enumerable.sol";

contract Klaystagram is ERC721, ERC721Enumerable {
```
### 3) Set events and data structure
We need to set up an event to keep track of activities on blockchain.  

As for data structure, mapping `_photoList` takes a uint256 `tokenId` to map a specific `PhotoData` struct.  
```solidity
event PhotoUploaded (uint indexed tokenId, bytes photo, string title, string location, string description);

mapping (uint256 => PhotoData) private _photoList;

struct PhotoData {
    uint256 tokenId;                       // Unique token id
    address[] ownerHistory;                // History of all previous owners
    bytes photo;                           // Image source
    string title;                          // Title of photo
    string location;                       // Location where photo is taken
    string description;                    // Short description about the photo
    uint256 timestamp;                     // Uploaded time
}
```
### 4) Write functions

Let's write some functions that interact with the contract. In this tutorial let us only consider two functions: `uploadPhoto` and `transferOwnership`. Check out `Klaystagram.sol` to see the whole set of functions.

#### `uploadPhoto`
`uploadPhoto` function takes 4 arguments including photo's image source. To keep things simple, `tokenId` will start from 0 and will increase by 1.  

`_mint` function is from ERC721 contract. It creates a new token and assign it to a specific address, which in this case, `msg.sender`.  

Finally, initialize `PhotoData` struct, locate it inside `_photoList` mapping, and push the owner address into `ownerHistory` array. And don't forget to emit the event we just created.
```solidity
function uploadPhoto(uint8[] photo, string title, string location, string description) public {
    uint256 tokenId = totalSupply() + 1;

    _mint(msg.sender, tokenId);

    address[] memory ownerHistory;

    PhotoData memory newPhotoData = PhotoData({
        tokenId : tokenId,
        ownerHistory : ownerHistory,
        photo : photo,
        title: title,
        location : location,
        description : description,
        timestamp : now
    });

    _photoList[tokenId] = newPhotoData;
    _photoList[tokenId].ownerHistory.push(msg.sender);

    emit PhotoUploaded(tokenId, photo, title, location, description, now);
}
```

#### `transferOwnership`
Let's take a look at `transferOwnership` function. When transfering photo ownership, we need to do two things. First, we have to reassign the owner, and then we have to push new owner address into `ownerHistory` array. 

To do this, `transferOwnership` first calls `safeTransferFrom` function from ERC721 standard, which eventually calls `transferFrom` function. As mentioned above, right after token transfer is successfully done, we have to push new owner information into `ownerHistory` array, and that is exactly why `transferFrom` is overridden as below.
```solidity
/**
  * @notice safeTransferFrom function checks whether receiver is able to handle ERC721 tokens,
  *  thus less possibility of tokens being lost. After checking is done, it will call transferFrom function defined below
  */
function transferOwnership(uint256 tokenId, address to) public returns(uint, address, address, address) {
    safeTransferFrom(msg.sender, to, tokenId);
    uint ownerHistoryLength = _photoList[tokenId].ownerHistory.length;
    return (
        _photoList[tokenId].tokenId, 
        //original owner
        _photoList[tokenId].ownerHistory[0],
        //previous owner, length cannot be less than 2
        _photoList[tokenId].ownerHistory[ownerHistoryLength-2],
        //current owner
        _photoList[tokenId].ownerHistory[ownerHistoryLength-1]);
}

/**
  * @notice Recommand using transferOwnership instead of this function
  * @dev Overrode transferFrom function to make sure that every time ownership transfers
  *  new owner address gets pushed into ownerHistory array
  */
function transferFrom(address from, address to, uint256 tokenId) public {
    super.transferFrom(from, to, tokenId);
    _photoList[tokenId].ownerHistory.push(to);
}
```

[Next: Deploy contract](6-deploy-contract.md)

---

## F. Deploy contract

1) Get some KLAY to deploy contract
2) Truffle configuration  
2) Deploy setup (Which contract do you want to deploy?)  
3) Deploy  


### 1) Get some KLAY  
To deploy contract, we need some KLAY in your account to pay for gas price. You can get 1000 test KLAY via Klaytn Wallet in the testnet.
1. Create your Klaytn account at [KlaytnWallet](https://wallet.klaytn.com/create)  
-> `PRIVATE KEY` will be used in truffle configuration. So copy it down somewhere
2. After creating your Klaytn account, run faucet to receive 1000 KLAY in [KlaytnFaucet](https://wallet.klaytn.com/faucet)

![create-accout & run-klay-faucet](./static/tutorial/klaystagram-run-faucet.png)

> &#9888; Klaytn Wallet is for testing.  
>The KLAY Faucet can only be used for development purpose by authorized IP.
If you need the KLAY faucet for development purpose, please contact us at contact@klaytn.com
### 2) truffle configuration  

`truffle.js` is a configuration file including deployment configuration. There are 2 different methods to deploy your contract.  

- DEPLOY METHOD 1: By private key
- [DEPLOY METHOD 2: By unlocked account](http://docs.klaytn.net/tutorials/7-deploy-contract.html#2-deploy-method-2-by-unlocked-account-difficult)

We are going to deploy our contract by using `private key` we've just created in the previous step.
*WARNING: You shouldn't expose your private key. Otherwise, your account would be hacked.*

```js
//truffle.js

const PrivateKeyConnector = require('connect-privkey-to-provider')

/**
 * truffle network variables
 * for deploying contract to klaytn network.
 */
const NETWORK_ID = '1000'
const GASLIMIT = '20000000'

/**
 * URL: URL for the remote node you will be using
 * PRIVATE_KEY: Private key of the account that pays for the transaction (Change it to your own private key)
 */
const URL = `http://aspen.klaytn.com`
const PRIVATE_KEY = '0x2c4078447e583b57f0666f0db32e14020aef12b02b2607409bfe35962d8f1aad'

module.exports = {
  networks: {
    klaytn: {
      provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },
  },

  // Specify the version of compiler, we use 0.4.24
  compilers: {
    solc: {
      version: '0.4.24',
    },
  },
}
```

#### `networks` property
See `networks` property above. `klaytn` network has 4 properties,  
`provider`, `network_id`, `gas`, `gasPrice`.

* `provider: new PrivateKeyConnector(PRIVATE_KEY, URL)`  
Just as the name indicates, it injects private key and url defined above.  

* `network_id: NETWORK_ID`  
Specify network id in Klaytn, you should set it to `1000` to use Klaytn Aspen network (testnet).  

* `gas: GASLIMIT`  
Maximum gas you are willing to spend.   

* `gasPrice: null`  
This is price per every gas unit. Currently in Klaytn, the gas price is fixed to `'25000000000'`. By setting it to `null`, truffle will automatically set the gas price.

#### `compiler` property
Remember that for Solidity contract we used version 0.4.24, thus specify compiler version here.

### 3) Deployment setup
`migrations/2_deploy_contracts.js`:  

```js
const Klaystagram = artifacts.require('./Klaystagram.sol')
const fs = require('fs')

module.exports = function (deployer) {
  deployer.deploy(Klaystagram)
    .then(() => {
    // 1. Save abi file to 'deployedABI'
    if (Klaystagram._json) {
      fs.writeFile(
        'deployedABI',
        JSON.stringify(Klaystagram._json.abi, 2),
        (err) => {
          if (err) throw err
          console.log(`The abi of ${Klaystagram._json.contractName} is recorded on deployedABI file`)
        })
    }

    // 2. Save contract address to 'deployedAddress'
    fs.writeFile(
      'deployedAddress',
      Klaystagram.address,
      (err) => {
        if (err) throw err
        console.log(`The deployed contract address * ${Klaystagram.address} * is recorded on deployedAddress file`)
    })
  })
}
```

You can specify which contract code will you deploy in your `contracts/` directory.  

1. Import your contract file (`Klaystagram.sol`) via  
`const Klaystagram = artifacts.require('./Klaystagram.sol')`  
2. Use `deployer` to deploy your contract,  `deployer.deploy(Klaystagram)`.  
3. If you want to add more logic after deploying your contract, use `.then()` (optional)  
4. To save contracts' `deployedABI` and `deployedAddress`, use `fs` node.js module  
`fs.writeFile(filename, content, callback)` (optional)

cf. For further information about `artifacts.`, refer to truffle official documentation at https://truffleframework.com/docs/truffle/getting-started/running-migrations#artifacts-require-.


### 4) Deploy

![deploy-contract](./static/tutorial/klaystgram-deploy-contract.png)  
In your terminal type `$ truffle deploy --network klaytn`.  
It will deploy your contract according to `truffle.js` and `migrations/2_deploy_contracts.js` configuration.  

cf) `--reset` option  
If you provide this option, truffle will recompile and redeploy your contract even if contracts haven't changed.  
ex) `$ truffle deploy --reset --network klaytn`

Terminal will display deployed contract address if deployment was successful.  

[Next: Frontend code overview](7-frontend-overview.md)

---

## G. Front-end overview  
1. Overview
2. `src/App.js`
3. `src/pages`
4. What we are going to learn?

### 1) Overview
In this section, we are going to build front-end. 
This tutorial's main purpose is to learn how to connect contract with front-end code. We will thus briefly explain React codes and focus on the API functions interacting with contract deployed on Klaytn.

```
|-- src
    |-- klaytn
      |-- caver.js
      |-- Klaystagram.js
    |-- redux
      |-- auth.js
      |-- photos.js
    |-- pages
      |-- AuthPage.js
      |-- MainPage.js
    |-- components
      |-- UploadPhoto.js
      |-- Feed.js
      |-- TransferOwnership.js
      |-- ...
    |-- App.js
```

`src/klaytn`: Contains files that help interact with Klaytn blockchain.
* `src/klaytn/caver.js`: Instantiates caver within configured setting.  
cf) caver-js is a RPC call library which makes a connection to Klaytn node, interacting with node or smart contract deployed on klaytn.
* `src/klaytn/Klaystagram.js`: Creates an instance of contract using caver-js API. You can interact with contract through the instance.

`src/redux`: Creates API functions that interact with contract and keeps tracks of consequent data.
* `redux/actions/auth.js`
* `redux/actions/photos.js`

`src/pages`: Contains frontend javascript files. 
* `src/pages/AuthPage.js`: Contains sign up and login form. You can generate private key in the sign up form, and use it to login on the app.
* `src/pages/FeedPage.js`: Shows read photos from the contract, shows them to users, and provides upload feature.


`src/components`: Contains frontend component files.  
* `src/components/Feed.js`: Reads data from contract and displays photos.
* `src/components/UploadPhoto.js`: Uploads photo by sending transaction to contract. 
* `src/components/TransferOwnership.js`: Transfers the ownership of photo by sending transaction.

`src/App.js`: Our tutorial app's root component file for overall components.  

### 1) App.js
`'App.js'` is root component file for overall components. It renders two pages depending on user's login status. Each page has functions that interact with contract, and to send transactions to blockchain, you must add wallet instance to caver. Let’s briefly look at the code for overview. 


cf. caver-js(or `cav` in the code) is a library for interacting with Klaytn blockchain. We are going to learn in detail in the next chapter - [F-1. Connect contract to frontend](8-1-feedpage-connect-contract.md)

```js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AuthPage from 'pages/AuthPage'
import FeedPage from 'pages/FeedPage'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import Modal from 'components/Modal'
import Toast from 'components/Toast'

import * as authActions from 'redux/actions/auth'

import './App.scss'

class App extends Component {
  constructor(props) {
    super(props)
    /**
     * 1. Initialize store state `isLoggedIn`
     * sessionStorage is internet browser's feature which stores data
     * until the browser tab is closed.
     */
    const walletFromSession = sessionStorage.getItem('walletInstance')
    const { integrateWallet, removeWallet } = this.props

    if (walletFromSession) {
      try {
        /**
         * 2-1. Integrate wallet
         * If 'walletInstance' value exists,
         * intergrateWallet method adds the instance to caver's wallet and redux store
         * cf) redux/actions/auth.js -> integrateWallet()
         */
        integrateWallet(JSON.parse(walletFromSession).privateKey)
      } catch (e) {
        /**
         * 2-2. Remove wallet
         * If value in sessionStorage is invalid wallet instance,
         * removeWallet method removes the instance from caver's wallet and redux store
         * cf) redux/actions/auth.js -> removeWallet()
         */
        removeWallet()
      }
    }
  }
  /**
   * 3. Render the page
   * Redux will initialize isLoggedIn state to true or false,
   * depending on walletInstance in the session storage,
   */
  render() {
    const { isLoggedIn } = this.props
    return (
      <div className="App">
        <Modal />
        <Toast />
        {isLoggedIn && <Nav />}
        {isLoggedIn ? <FeedPage /> : <AuthPage />}
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
})

const mapDispatchToProps = (dispatch) => ({
  integrateWallet: (privateKey) => dispatch(authActions.integrateWallet(privateKey)),
  removeWallet: () => dispatch(authActions.removeWallet()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
```
cf) `JSON.parse` is needed since `walletInstance` session is stored as JSON string.

**1. Initialize state `isLoggedIn`**  
To initialize state `isLoggedIn`, we use `constructor` life cycle method on App component. It checks for `walletInstance` session in browser's sessionStorage before component is mounted.  


**2. Inject/Remove wallet**  
If you have never logged in before, `walletInstance` session may not exist. Otherwise, `walletInstance` session may exist as JSON string in the sessionStorage. 
1. Inject - If `walletInstance` session exist in sessionStorage, try adding wallet instance to caver and redux store.
2. Remove - If wallet instance in sessionStorage is invalid, remove it from caver's wallet and redux store.
```js
// redux/actions/auth.js

export const integrateWallet = (privateKey) => (dispatch) => {
  // 1. Make wallet instance with caver's privateKeyToAccount API
  const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey)
  // 2. To send a transaction, add wallet instance to caver
  cav.klay.accounts.wallet.add(walletInstance)
  // 3. To maintain logged-in status, store walletInstance at sessionStorage
  sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance))
  // 4. To globally access walletInstance information, save it in redux store
  return dispatch({
    type: INTEGRATE_WALLET,
    payload: {
      privateKey,
      address: walletInstance.address,
    },
  })
}

export const removeWallet = () => (dispatch) => {
  cav.klay.accounts.wallet.clear()
  sessionStorage.removeItem('walletInstance')
  return dispatch({
    type: REMOVE_WALLET,
  })
}
```
cf. For further information about caver's `privateKeyToAccount` API, refer to Klaytn documentation site. https://docs.klaytn.com/api/toolkit.html#privatekeytoaccount

**3. Render the page**  
Redux will initialize `isLoggedIn` state to either true or false, depending on walletInstance in the session storage.

### 2) `src/pages`
As we described in [Frontend Overview](7-frontend-overview.md) part, `src/pages` contains two page files.  
One of these two pages will be renderded on the app depending on whether the user is logged in or not.

* `AuthPage.js`: Contains sign up and login form. You can generate private key in the sig nup form, and use it to login on the app.
* `FeedPage.js`: Reads photo data from the contract and shows them to users. Users can also upload their pictures.

### 3) What we are going to learn?
In blockchain based app, there are two ways of interacting with contracts.    
`1) Reading data from contract.`  
`2) Writing data to contract.`  

Reading data from contract is cost-free. On the otherhand, there is cost for writing data to contract (Sending a transaction). For this reason, in order to write data, you must have Klaytn account that has some KLAY to pay for it.  

`AuthPage` helps you to create Klaytn account(=private key). Then, you can login with private key and pay for trasaction fee.  

If you want more detail about `AuthPage`, refer to [AuthPage.js code](@TODO) with [Count tutorial_Frontend Auth component](http://docs.klaytn.net/tutorials/6-2-frontend-auth-component.html) 

**In this tutorial, we are going to focus on `FeedPage`, so that we can learn how application reads and writes data to contracts.**

[Next: Feedpage](8-feedpage.md)

---

## H. FeedPage
![FeedPage](./static/tutorial/klaystagram-feedpage.png)

FeedPage is consisted of 3 main components that interact with `Klaystagram` contract.  

F-2. `Feed` component  
F-3. `UploadPhoto` component  
F-4. `TransferOwnership` component

```js
// src/pages/FeedPage.js

const FeedPage = () => (
  <main className="FeedPage">
    <UploadButton />               // F-3. UploadPhoto
    <Feed />                       // F-2. Feed
  </main>
)
```

```js
// src/components/Feed.js

<div className="Feed">
  {feed.length !== 0
    ? feed.map((photo) => {
      // ...
      return (
        <div className="FeedPhoto" key={id}>
        
            // ...
            {
              userAddress === currentOwner && (
                <TransferOwnershipButton   // F-4. TransferOwnership
                  className="FeedPhoto__transferOwnership"
                  id={id}
                  issueDate={issueDate}
                  currentOwner={currentOwner}
                />
              )
            }
            // ...
        </div>
      )
    })
    : <span className="Feed__empty">No Photo :D</span>
  }
</div>
)
```
To make component interact with contract, there are 3 steps.

**First**, create `KlaystagramContract` instance to connect contract with front-end. 
**Second**, using `KlaystagramContract` instance, make API functions that interact with contract in `redux/actions`  
**Third**, call functions in each component (`src/components/..`)

Let's build it!


[Next: Connect contract](8-1-feedpage-connect-contract.md)

---

## H-1. Connect contract to front-end

1. `src/klaytn`
    * caver.js
    * KlaystagramContract.js
2. `src/redux`


### 1) `src/klaytn`
`src/klaytn`: Contains files that help interact with Klaytn blockchain.
* `src/klaytn/caver.js`: Instantiates caver within configured setting.  
cf) caver-js is a RPC call library which makes a connection to klaytn node, interacting with node or smart contract deployed on Klaytn.
* `src/klaytn/Klaystagram.js`: Creates an instance of contract using caver-js API. You can interact with contract through the instance  


#### `caver.js`
```js
/**
 * caver-js library helps making connection with klaytn node.
 * You can connect to specific klaytn node by setting 'rpcURL' value.
 * default rpcURL is 'http://aspen.klaytn.com'.
 */
import Caver from 'caver-js'

export const config = {
  rpcURL: 'http://aspen.klaytn.com'
}

export const cav = new Caver(config.rpcURL)

export default cav
```

After making the connection, you can call methods on smart contract with caver.

#### `KlaystagramContract.js`
```js
import { cav } from 'klaytn/caver'

class KlaystagramContract {
  constructor() {
    // 1. Create contract instance
    // You can call contract methods through this instance.
    this.instance = DEPLOYED_ABI
      && DEPLOYED_ADDRESS
      && new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
  }

  static getInstance() {
    if (this.instance) return this.instance
    this.instance = new KlaystagramContract()
    return this.instance
  }
}

export default KlaystagramContract
```

To interact with contract, we need a contract instance created with deployed contract address. 

`KlaystagramContract` creates a contract instance to interact with Klaystagram contract, by providing `DEPLOYED_ABI` and `DEPLOYED_ADDRESS` to `cav.klay.Contract` API.

When compiling & deploying Klaystagram.sol contract ([F. Deploy contract](6-deploy-contract.md)), we already created `deployedABI` and `deployedAddress` files. They contain ABI of Klaystagram contract and deployed contract address.  
And thanks to [webpack's configuration](@TODO), we can access it as variable.(`DEPLOYED_ADDRESS`, `DEPLOYED_ABI`)

* `DEPLOYED_ADDRESS` returns deployed Address  
* `DEPLOYED_ABI` returns Klaystagram contract ABI

`contract ABI`(Application Binary Interface) is the interface for calling contract methods. With this interface, we can call contract methods as below
* `contractInstance.methods.methodName().call()`  
* `contractInstance.methods.methodName().send({ ... })`  

**Now we are ready to interact with contract in the application.**  

*cf. For more information, refer to  `caver.klay.Contract`. (https://docs.klaytn.com/api/toolkit.html#caverklaycontract)*


### 2) `src/redux`
We are going to make API functions with Klaystagram instance. After calling API functions, we use redux store to save data from contract.


1. Import contract instance  
By using `KlaystagramContract` instance, we can call contract's methods when components need to interact with contract.

2. Call contract method

3. Store data from contract    
If transaction is successful, we will call redux action to save information from contract to redux store.

**Redux store controls all data flow in front-end**

```js
// src/redux/photo.js

import contract from 'klaytn/KlaystagramContract'

/**
 * 1. Import contract instance
*/
const KlaystagramContract = contract.getInstance().instance

const setFeed = (feed) => ({
  type: SET_FEED,
  payload: { feed },
})

const updateFeed = (tokenId) => (dispatch, getState) => {
  /**
   * 2. Call contract method (CALL): getPhoto()
   * For example, if you want to call `getPhoto` function do it as below
  */
  KlaystagramContract.methods.getPhoto(tokenId).call()
    .then((newPhoto) => {
      const { photos: { feed } } = getState()
      const newFeed = [newPhoto, ...feed]
      /** 
       * 3. Dispaching setFeed action
       * to save transaction data to redux store
      */
      dispatch(setFeed(newFeed))
    })
}
```


[Next: Feed component](8-2-feedpage-uploadphoto.md)

---

## H-2. Feed component

![klaystagram-feed](./static/tutorial/klaystagram-feed.png)

1. `Feed` component's role
2. Read data from contract: `getFeed` method  
3. Save data to store: `setFeed` action  
4. Show data in component: `Feed` component

### 1) `Feed` component's role  
In chapter [E. Write Klaystagram smart contract](@TODO),  we wrote `PhotoData` struct, and located it inside `_photoList` mapping. Feed component's role is as follows:
1. Read `PhotoData` via calling Klaystagram contract method (`redux/actions/photos.js`)
2. Show `PhotoData`(feed) with its owner information (`components/Feed.js`)

### 2) Read data from contract: `getPhoto` method  
1. Call contract method: `getTotalPhotoCount()`  
If there 0 photo, call `setFeed` action with empty array.
2. Call contract method:`getPhoto(id)`  
If there is photo data, call all of photo data as promises and push it in the feed array. When all promises have resolved, return feed array. 
3. Call redux action: `setFeed(feed)`  
Get resolved feed array and save it to redux store.
```js
// src/redux/photos.js

const setFeed = (feed) => ({
  type: SET_FEED,
  payload: { feed },
})

export const getFeed = () => (dispatch) => {
  // 1. Call contract method(READ): `getTotalPhotoCount()`
  // If there is no photo data, call `setFeed` action with empty array
  KlaystagramContract.methods.getTotalPhotoCount().call()
    .then((res) => {
      if (res === 0) return dispatch(setFeed([]))
      let total = res
      const feed = []
      while (total) {
        // 2. Call contract method(READ):`getPhoto(id)`
        // If there is photo data, call all of them
        feed.push(KlaystagramContract.methods.getPhoto(total).call())
        total--
      }
      return Promise.all(feed)
    })
    .then((feed) => {
      // 3. Call actions: `setFeed(feed)`
      // Save photo data(feed) to store
      dispatch(setFeed(feed))
    })
}
```

### 3) Save data to store: `setFeed` action
After we successfully fetch photo data(feed) from Klaystagram contract, we call `setFeed(feed)` action. This action takes payloads of information from contract and save it in redux store.

### 4) Show data in component: `Feed` component
```js
// src/components/Feed.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Loading from 'components/Loading'
import PhotoHeader from 'components/PhotoHeader'
import PhotoInfo from 'components/PhotoInfo'
import CopyrightInfo from 'components/CopyrightInfo'
import TransferOwnershipButton from 'components/TransferOwnershipButton'
import { drawBytesToImage, last } from 'utils/misc'

import * as photoActions from 'redux/actions/photos'

import './Feed.scss'

class Feed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: !props.feed,
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const isUpdatedFeed = (nextProps.feed !== prevState.feed) && (nextProps.feed !== null)
    if (isUpdatedFeed) {
      return { isLoading: false }
    }
    return null
  }

  componentDidMount() {
    const { feed, getFeed } = this.props
    if (!feed) getFeed()
  }

  finishLoading = () => this.setState({ isLoading: false })

  render() {
    const { feed, userAddress } = this.props

    if (this.state.isLoading) return <Loading />

    return (
      <div className="Feed">
        {feed.length !== 0
          ? feed.map((photo) => {
            const {
              0: id,
              1: ownerHistory,
              2: data,
              3: name,
              4: location,
              5: caption,
              6: timestamp,
            } = photo
            const originalOwner = ownerHistory && ownerHistory[id]
            const currentOwner = ownerHistory && last(ownerHistory)
            const imageUrl = drawBytesToImage(data)
            const issueDate = moment(timestamp).fromNow()
            return (
              <div className="FeedPhoto" key={id}>
                <PhotoHeader
                  currentOwner={currentOwner}
                  location={location}
                />
                <div className="FeedPhoto__image">
                  <img src={imageUrl} alt={name} />
                </div>
                <div className="FeedPhoto__info">
                  <PhotoInfo
                    name={name}
                    issueDate={issueDate}
                    caption={caption}
                  />
                  <CopyrightInfo
                    className="FeedPhoto__copyrightInfo"
                    id={id}
                    issueDate={issueDate}
                    originalOwner={originalOwner}
                    currentOwner={currentOwner}
                  />
                  {
                    userAddress === currentOwner && (
                      <TransferOwnershipButton
                        className="FeedPhoto__transferOwnership"
                        id={id}
                        issueDate={issueDate}
                        currentOwner={currentOwner}
                      />
                    )
                  }
                </div>
              </div>
            )
          })
          : <span className="Feed__empty">No Photo :D</span>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  feed: state.photos.feed,
  userAddress: state.auth.address,
})


const mapDispatchToProps = (dispatch) => ({
  getFeed: () => dispatch(photoActions.getFeed()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Feed)
```

At the first time, you can only see the text "No photo :D" because there is no photo data in contract yet.  
Let's make a UploadPhoto component to send photo data to contract! 

[Next: UploadPhoto component](@TODO)

---

## H-2. UploadPhoto component
![upload photo](./static/tutorial/klaystagram-uploadphoto.png)

1. `UploadPhoto` component's role
2. Component code
3. Interact with contract  
4. Update data to store: `updateFeed` function

### 1) `UploadPhoto` component's role
Through `UploadPhoto` component, we can upload photos to the Klaytn blockchain in the form of NFT(non-fungible-token). To do this, it works as follows:
1. Send transaction by calling `uploadPhoto`.
2. After sending transaction, show progress with `Toast` component in trasaction life cycle.
3. When transaction gets into block, update new `PhotoData` to store.


### 2) Component code  
```js
// src/components/UploadPhoto.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Input from 'components/Input'
import InputFile from 'components/InputFile'
import Button from 'components/Button'

import * as photoActions from 'redux/actions/photos'

import './UploadPhoto.scss'

class UploadPhoto extends Component {
  state = {
    file: '',
    fileName: '',
    location: '',
    caption: '',
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.files[0].name,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { file, fileName, location, caption } = this.state

    /** Write data to contract (Sending transction) **/
    this.props.uploadPhoto(file, fileName, location, caption)
    ui.hideModal()
  }

  render() {
    const { fileName, location, caption } = this.state
    return (
      <form className="UploadPhoto" onSubmit={this.handleSubmit}>
        <InputFile
          className="UploadPhoto__file"
          name="file"
          type="file"
          fileName={fileName}
          accept="image/png, image/jpeg"
          onChange={this.handleFileChange}
          required
        />
        <div className="UploadPhoto__content">
          <Input
            className="UploadPhoto__location"
            name="location"
            value={location}
            onChange={this.handleInputChange}
            placeholder="Where did you take this photo?"
            required
          />
          <textarea
            className="UploadPhoto__caption"
            name="caption"
            value={caption}
            onChange={this.handleInputChange}
            placeholder="Upload your memories"
            required
          />
        </div>
        <Button
          className="UploadPhoto__upload"
          type="submit"
          title="Upload"
        />
      </form>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  uploadPhoto: (file, fileName, location, caption) =>
    dispatch(photoActions.uploadPhoto(file, fileName, location, caption)),
})

export default connect(null, mapDispatchToProps)(UploadPhoto)
```

### 3) Interact with contract
```js
// src/redux/actions/photo.js

export const uploadPhoto = (
  file,
  fileName,
  location,
  caption
) => (dispatch, getState) => {

  // 1. Read file(image)'s data as an ArrayBuffer
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onloadend = () => {

    // 2. Convert ArrayBuffer to bytes
    const buffer = Buffer.from(reader.result)
    const bytesString = "0x" + buffer.toString('hex')

    /**
     * 3. Call contract method(SEND): uploadPhoto
     * Send transaction with bytes of photo image and descriptions
    */
    KlaystagramContract.methods.uploadPhoto(buffer, fileName, location, caption).send({
      from: getWallet().address,
      gas: '20000000',
    })
      .once('transactionHash', (txHash) => {
        // 4. After sending transaction,
        // Show progress with `Toast` component in trasaction life cycle
        ui.showToast({
          status: 'pending',
          message: `Sending a transaction... (uploadPhoto)`,
          txHash,
        })
      })
      .once('receipt', (receipt) => {
        ui.showToast({
          status: receipt.status ? 'success' : 'fail',
          message: `Received receipt! It means your transaction is
          in klaytn block (#${receipt.blockNumber}) (uploadPhoto)`,
          txHash: receipt.transactionHash,
        })receipt)

        /**
         * 5. If transaction successfully gets into block,
         * Call updateFeed function to add new photo data
        */
        const tokenId = receipt.events.PhotoUploaded.returnValues[0]
        dispatch(updateFeed(tokenId))
      })
      .once('error', (error) => {
        ui.showToast({
          status: 'error',
          message: error.toString(),
        })
      })
  }
}
```

#### Send transaction to contract: `uploadPhoto` method
We created Contract instance above. Let's make function to write photo data on Klaytn.  
Although reading data is free, writing data pays cost for computation & data storage. This cost is called `'gas'` and this process is called `'Sending a transaction'`.

For these reasons, sending a transaction needs two property `from` and `gas`.

1. Read file's data from `UploadPhoto` component as an ArrayBuffer using `FileReader`.
2. Convert ArrayBuffer to bytes (ArrayBuffer -> hex -> bytes).
    * Prefix `0x` - to satisfy bytes format
3. Call contract method (SEND): `uploadPhoto` .
    * `from:` account that sends this transaction (= who will pay for this transaction)  
    * `gas:` amount of maximum cost willing to pay for sending the transaction
4. After sending transaction, show progress with `Toast` component in trasaction life cycle.
5. If transaction success to get into block, Call updateFeed function to add new photo data to feed in store.

>[Toast (pending, success, error) gif](@TODO)

**cf) Transaction life cycle:**  
After sending transaction, you can get transaction life cycle (`transactionHash`, `receipt`, `error`).  
- In `transactionHash` cycle, you can get transaction hash before sending actual transaction.  
- In `receipt` cycle, you can get transaction receipt. It means your transaction got into the block. You can check the block number by `receipt.blockNumber`.  
- `error` cycle is triggered when something goes wrong.



### 4. Update data to store: `updateFeed` function
After successfully sending transaction to contract, FeedPage needs to be updated.  
In order to update feed we need to get the new photo data we've just uploaded. Let's call `getPhoto()` with tokenId in receipt that comes right after sending transaction. Then add a new photo data to feed in store.  

```js
// src/redux/actions/photo.js

/**
 * 1. Call contract method (CALL): getPhoto()
 * To get new photo data we've just uploaded,
 * call `getPhoto()` with tokenId from receipt after sending transaction
*/
const updateFeed = (tokenId) => (dispatch, getState) => {
  KlaystagramContract.methods.getPhoto(tokenId).call()
    .then((newPhoto) => {
      const { photos: { feed } } = getState()
      const newFeed = [newPhoto, ...feed]
      
      // 2. update new feed to store
      dispatch(setFeed(newFeed))
    })
}
```

[Next: TransferOwnership component](8-4-feedpage-transferownership.md)

---

## H-4. TransferOwnership component
![transfer ownership](./static/tutorial/klaystagram-transferownership.png)

1. `TransferOwnership` component's role
2. Component code
    2-1. Rendering `transferOwnership` button
    2-2. `TransferOwnership` component
3. Interact with contract: `transferOwnership` method  
4. Update data to store: `updateOwnerAddress` action  

### 1) `TransferOwnership` component's role
The owner of photo can transfer photo's ownership to another user. By sending `transferOwnership` transaction, new owner's address will be saved in ownership history, which keep tracks of past owner addresses.

### 2) Component code

#### 2-1) Rendering `TransferOwnership` button
We are going to render `TransferOwnership` button on the `FeedPhoto` component only when photo's owner address matches with logged-in user's address (which means you are the owner).
```js
// src/components/FeedPhoto.js

<div className="FeedPhoto__actions">
  {
    userAddress === currentOwner && (
      <IconButton
        className="FeedPhoto__transferOwnership"
        icon="icon-transfer.png"
        alt="Transfer Ownership"
        onClick={() => ui.showModal({
          header: 'Transfer Ownership',
          content: (
            <TransferOwnership
              id={id}
              issueDate={issueDate}
              currentOwner={currentOwner}
            />
          ),
        })}
      />
    )
  }
  // ...
</div>
```

#### 2-2) `TransferOwnership` component
```js
// src/components/TransferOwnership.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as photoActions from 'redux/actions/photos'
import Input from 'components/Input'
import Button from 'components/Button'

import './TransferOwnership.scss'

class TransferOwnership extends Component {
  state = {
    to: null,
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { id, transferOwnership } = this.props
    const { to } = this.state
    /** 
     * Write data to contract (Sending transction)
     * id: photo's token id
     * to: new owner's address
    */
    transferOwnership(id, to)
    ui.hideModal()
  }

  render() {
    const { id, issueDate, currentOwner } = this.props
    return (
      <div className="TransferOwnership">
        <div className="TransferOwnership__info">
          <p className="TransferOwnership__infoCopyright">Copyright. {id}</p>
          <p>Issue Date  {issueDate}</p>
        </div>
        <form className="TransferOwnership__form" onSubmit={this.handleSubmit}>
          <Input
            className="TransferOwnership__from"
            name="from"
            label="CURRENT OWNER"
            value={currentOwner}
            disabled
          />
          <Input
            className="TransferOwnership__to"
            name="to"
            label="NEW OWNER"
            onChange={this.handleInputChange}
            placeholder="Transfer Ownership to..."
            required
          />
          <Button
            className="TransferOwnership__transfer"
            type="submit"
            title="Transfer Ownership"
          />
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  transferOwnership: (id, to) => dispatch(photoActions.transferOwnership(id, to)),
})

export default connect(null, mapDispatchToProps)(TransferOwnership)
```

### 3) Interact with contract: `transferOwnership` method  
We already made `transferOwnership` function in Klaystagram contract at chapter [E. Write Smart Contract](5-write-smart-contract.md). Let's call it from application.

1. Call contract method (SEND): Send `transferOwnership` transaction
    * `id:` photo's tokenId
    * `to:` Address to tranfer photo's ownership
2. Set options 
    * `from:` account that sends this transaction (= who will pay for this transaction)  
    * `gas:` amount of maximum cost willing to pay for sending the transaction
3. After sending transaction, show progress with `Toast` component in trasaction life cycle
4. If transaction successfully gets into block, call `updateOwnerAddress` function to update feed  

```js
// src/redux/photo.js

export const transferOwnership = (tokenId, to) => (dispatch) => {
  /** 
   * 1. Call contract method (SEND): transferOwnership(id, to)
   * id: photo's token id
   * to: new owner's address
  */
  KlaystagramContract.methods.transferOwnership(tokenId, to).send({
    // 2. Set options
    from: getWallet().address,
    gas: '20000000',
  })
    .once('transactionHash', (txHash) => {
      // 3. Show transaction progress in transaction life cycle
      ui.showToast({
        status: 'pending',
        message: `Sending a transaction... (transferOwnership)`,
        txHash,
      })
    })
    .once('receipt', (receipt) => {
      ui.showToast({
        status: receipt.status ? 'success' : 'fail',
        message: `Received receipt! It means your transaction is
          in klaytn block (#${receipt.blockNumber}) (transferOwnership)`,
        txHash: receipt.transactionHash,
      })

      /**
       * 4. If transaction successfully gets into block,
       * call updateOwnerAddress function to update feed 
      */
      dispatch(updateOwnerAddress(tokenId, to))
    })
    .once('error', (error) => {
      ui.showToast({
        status: 'error',
        message: error.toString(),
      })
    })
}
```



### 4) Update information in redux store: `updateOwnerAddress` action

After transfering ownership, FeedPhoto needs to be rerendered with new owner's address.  
To update new owner's address, let's call `feed` data from store and find the photo that has the tokenId from the receipt. Then push new owner's address to photo's `OWNER_HISTORY` and setFeed.


```js
const updateOwnerAddress = (tokenId, to) => (dispatch, getState) => {
  const { photos: { feed } } = getState()
  const newFeed = feed.map((photo) => {
    if (photo[ID] !== tokenId) return photo
    photo[OWNER_HISTORY].push(to)
    return photo
  })
  dispatch(setFeed(newFeed))
}
```

[Next: Run app](9-run-app.md)

---

## H. Let's run our app

<video src="./static/tutorial/klaystagramo-video.mov" autoplay poster="./static/tutorial/klaystagram-sending-trasaction.png" style="width: 700px;"></video>

Run our app in browser.  
type `$ npm run local`