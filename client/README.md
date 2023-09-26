<<<<<<< HEAD
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
=======
# Web3 NEXT dApp : Random EternalNFT Collection

## Table of Contents

- [Deployed Contract Address](#deployed-contract-address)
- [Project Description](#project-description)
- [Workflow](#workflow)
- [Directory structure](#directory-structure)
- [Clone, Install and Build steps](#clone-install-and-build-steps)
  - [Prerequisites](#prerequisites)
  - [Cloning and installing dependencies](#cloning-and-installing-dependencies)
  - [Testing Contracts](#testing-contracts)
  - [Running the frontend](#running-the-frontend)

## Deployed Contract Address

0x457909D0e16e2C44CEfAb11467EF2831BF32B6fb

## Project Description

A dapp to mint your own text-based **Eternal Character NFT**.

**Eternal Characters** are the residents of **Eternal Domain world**. They consist of 3 main characteristics, Area of Control, Weapon and Rank.

**Area of Control -** Fire, Wind, Wave, Earth, Light, Shadow, Thunder, Space, Time, Gravity, Ice
**Weapon -** Sword, Spear, Shield, Hammer, Saber, Axe, Bow, Staff, Wand, Fist, Dagger, Scythe, Mace, Blade, Katana
**Rank -** Lord, King, Emperor, Venerable, Ancestor, Saint, God

## Workflow

1. Enter the dApp and connect the wallet to goerli network.
2. Click on the Mint Character button.
3. Metamask pops up and asks to confirm the transaction.
4. After the transaction is successfully processed the user can see the minted character.
5. The minted character is also added to My NFT page under Minted Characters section.
6. Collection disponible on Rarible : https://testnet.rarible.com/collection/0x457909D0e16e2C44CEfAb11467EF2831BF32B6fb

## Clone, Install and Build steps

### Prerequisites

1. [Git](https://git-scm.com/)
2. [Node JS](https://nodejs.org/en/) (everything was installed and tested under v15.12.0)
3. A Browser with the [MetaMask extension](https://metamask.io/) installed.
4. Test Ether on the goerli network.

<br>

### Cloning and installing dependencies

1. Clone the project repository on your local machine

```
 git clone https://github.com/adelamare-blockchain/Web3_dApp_Random_EternalNFT_Collection.git
 cd Web3_dApp_Random_EternalNFT_Collection
```

2. Installing dependencies

- For backend -
  ```
  cd backend
  npm install
  ```
- For client -
  ```
  cd client
  npm install
  ```

### Testing Contracts

For testing contracts run command:

```
cd backend
npx hardhat test
```

### Running the frontend

For running frontend locally run command:

```
cd client
npm run dev
```

### Environment variables (not needed for running project locally)

```
PRIVATE_KEY =YOUR_GOERLI_PRIVATE_KEY
```
>>>>>>> f9e4af183c69a0ba1bdffce8ff23789b1b553557
