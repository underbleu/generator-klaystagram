# Klaytn-Based NFT Photo Licensing Application Tutorial

> Klaystagram, Klaytn NFT-based photo licensing DApp tutorial

## Table of Contents
* [1. Environment Setup](https://docs.klaytn.com/tutorials/klaystagram/1-environment-setup)
* [2. Scaffolding](https://docs.klaytn.com/tutorials/klaystagram/2-scaffolding)
* [3. Directory Structure](https://docs.klaytn.com/tutorials/klaystagram/3-directory-structure)
* [4. Write Klaystagram Smart Contract](https://docs.klaytn.com/tutorials/klaystagram/4-write-smart-contract)
* [5. Deploy Contract](https://docs.klaytn.com/tutorials/klaystagram/5-deploy-contract)
* [6. Frontend Code Overview](https://docs.klaytn.com/tutorials/klaystagram/6-frontend-overview)
* [7. FeedPage](https://docs.klaytn.com/tutorials/klaystagram/7-feedpage)
  - [7-1. Connect Contract to Frontend](https://docs.klaytn.com/tutorials/klaystagram/7-feedpage/7-1-feedpage-connect-contract)
  - [7-2. UploadPhoto Component](https://docs.klaytn.com/tutorials/klaystagram/7-feedpage/7-2-feedpage-uploadphoto)
  - [7-3. Feed Component](https://docs.klaytn.com/tutorials/klaystagram/7-feedpage/7-3-feedpage-feed)
  - [7-4. TransferOwnership Component](https://docs.klaytn.com/tutorials/klaystagram/7-feedpage/7-4-feedpage-transferownership)
* [8. Run App](https://docs.klaytn.com/tutorials/klaystagram/8-run-app)

## Introduction

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
