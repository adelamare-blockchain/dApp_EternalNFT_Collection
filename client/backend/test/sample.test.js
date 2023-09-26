const { expect, assert } = require('chai');

describe('EternalNFT Contract', async () => {
  let nft;
  let nftContractAddress;
  let tokenId;

  // Deploys the EternalNFT contract and the EternalMarket contract before each test
  beforeEach('Setup Contract', async () => {
    const EternalNFT = await ethers.getContractFactory('EternalNFT');
    nft = await EternalNFT.deploy();
    await nft.deployed();
    nftContractAddress = await nft.address;
  });

  // Tests address for the EternalNFT contract
  it('Should have an address', async () => {
    expect(nftContractAddress).to.not.be.undefined;
    expect(nftContractAddress).to.not.be.null;
    assert.notEqual(nftContractAddress, 0x0);
    assert.notEqual(nftContractAddress, '');
  });

  // Tests name for the token of EternalNFT contract
  it('Should have a name', async () => {
    // Returns the name of the token
    const name = await nft.collectionName();

    expect(name).to.equal('EternalNFT');
  });

  // Tests symbol for the token of EternalNFT contract
  it('Should have a symbol', async () => {
    // Returns the symbol of the token
    const symbol = await nft.collectionSymbol();
    expect(symbol).to.equal('ENFT');
  });

  // Tests for NFT minting function of EternalNFT contract using tokenID of the minted NFT
  it('Should be able to mint NFT', async () => {
    // Mints a NFT
    let txn = await nft.createEternalNFT();
    let tx = await txn.wait();

    // tokenID of the minted NFT
    let event = tx.events[0];
    let value = event.args[2];
    tokenId = value.toNumber();

    // Check incrémentation correcte tokenID
    expect(tokenId).to.equal(1);

    // Mints another NFT
    txn = await nft.createEternalNFT();
    tx = await txn.wait();

    // tokenID of the minted NFT
    event = tx.events[0];
    value = event.args[2];
    tokenId = value.toNumber();

    // Check incrémentation correcte tokenID
    expect(tokenId).to.equal(2);
  });
});
