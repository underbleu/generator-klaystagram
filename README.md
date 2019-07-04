# generator-klaystagram
Generate klaytn-based NFT photo licensing application skeleton through yeoman generator.

## Installation
First, install Yeoman and generator-klaystagram using npm (we assume you have pre-installed node.js).

```
npm install -g yo
npm install -g generator-klaystagram
```

Then generate your new project:
```
yo klaystagram
```


## Introduction

> Klaystagram, Klaytn NFT-based photo licensing DApp tutorial  
> You can see the full tutorial in [Klaystagram Tutorial Docs](https://docs.klaytn.com/tutorials/klaystagram)

[![Klaystagram Introduction Video](https://i.vimeocdn.com/video/771199900_1280x720.jpg)](https://vimeo.com/327033594)

In this tutorial, we will learn how to make `Klaystagram`, a Klaytn-based NFT photo licensing application. This simple web application requires basic knowledge of Solidity, Javascript and React.  

NFT refers to a non-fungible token, which is a special type of token that represents a unique asset. As the name non-fungible implies, every single token is unique. And this uniquenss of NFT opens up new horizons of asset digitization. For example, it can be used to represent digital art, game items, or any kind of unique assets and allow people to trade them. For more information, refer to this [article](https://coincentral.com/nfts-non-fungible-tokens/).  

In `Klaystagram`, every token represents users' unique pictures. When a user uploads a photo, a unique token is created containing its ownership information and image source. All transactions are recorded on blockchain, so even service providers do not have control over the uploaded photos. Considering the purpose of this tutorial, only core functions will be implemented. After finishing this tutorial, try adding some more cool features and make your own creative service.

There are three main features.

1. **Photo upload**  
Users can upload photos along with descriptions on the Klaytn blockchain. The photos will be tokenized.

2. **Feed**  
Users can see all the photos uploaded on the blockchain.

3. **Transfer ownership**  
The owner of the photo can transfer ownership of the photo to another user, and the transaction will be shown in the ownership history.

We will learn how to make an web application that interacts with smart contracts. Thus, basic knowledge regarding Solidity, JavaScript and React is required.  


## License
MIT © [underbleu](underbleu.dev@gmail.com)
