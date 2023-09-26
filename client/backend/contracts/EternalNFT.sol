//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

contract EternalNFT is ERC721URIStorage {
    using Strings for uint;
    using Counters for Counters.Counter;

    // CONTRACT ADDRESS ON GOERLI NETWORK :
    // 0x457909D0e16e2C44CEfAb11467EF2831BF32B6fb

    // VARIABLES
    // Variable 1 : incrémentation tokenId
    Counters.Counter private _tokenIds;

    // Variable 2 : NOM + SYMBOLE de la collection
    string public collectionName;
    string public collectionSymbol;


    // Variable 3 : BaseURI du NFT
    string constant baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    // Variable 4 : random element du NFT (dans tableau 'element')
    string[] element = [
        'Fire',
        'Wind',
        'Wave',
        'Earth',
        'Thunder',
        'Space',
        'Time'
    ];

    // Variable 5 : random weapon du NFT (dans tableau 'weapon')
    string[] weapon = [
        'Sword',
        'Spear',
        'Shield',
        'Hammer',
        'Saber',
        'Axe',
        'Bow'
    ];

    // Variable 6 : random rank du NFT (dans tableau 'rank')
    string[] rank = [
        'Lord',
        'King',
        'Emperor',
        'Venerable',
        'Ancestor',
        'Saint',
        'God'
    ];

    // CONSTRUCTOR (modification du nom + symbol de la collection)
    constructor() ERC721("EternalNFT", "ENFT") {
        collectionName = name();
        collectionSymbol = symbol();
    }

    // FUNCTIONS
    // Function 1 : random() ==> randomisation des inputs fournis
    function random(string memory _input) internal pure returns(uint256) {
        return uint256(keccak256(abi.encodePacked(_input)));
    }


    // Function 2 : pickFirstWord() ==> sélection random de l'élément du NFT
    function pickFirstWord(uint256 _tokenId) public view returns(string memory) {
        uint256 rand = random(string(abi.encodePacked("element", Strings.toString(_tokenId))));
        rand = rand % element.length;
        return element[rand];
    }

    // Function 3 : pickSecondWord() ==> sélection random de la weapon du NFT
    function pickSecondWord(uint256 _tokenId) public view returns(string memory) {
        uint256 rand = random(string(abi.encodePacked("weapon", Strings.toString(_tokenId))));
        rand = rand % weapon.length;
        return weapon[rand];
    }

    // Function 4 : pickThirdWord() ==> sélection random du rank du NFT
    function pickThirdWord(uint256 _tokenId) public view returns(string memory) {
        uint256 rand = random(string(abi.encodePacked("rank", Strings.toString(_tokenId))));
        rand = rand % rank.length;
        return rank[rand];
    }


    // Function 5 : mint du NFT
    function createEternalNFT() external returns(uint256) {
        // Incrémentation du token Id du NFT créé
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // 1) Création de la première partie du NFT 'element'
        string memory first = pickFirstWord(newItemId);
        // 2) Création de la deuxième partie du NFT 'weapon'
        string memory second = pickSecondWord(newItemId);
        // 3) Création de la troisième partie du NFT 'rank'
        string memory third = pickThirdWord(newItemId);
        // 4) Création (et hashage) de la combinaison des 3 parties first, second et third
        string memory combinedWord = string(abi.encodePacked(first,second,third));
        // 5) Création du svg final du NFT
        string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third, "</text></svg>"));

        // 6) Jsonification des données 1) -> 5) du NFT
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                    '{"name": "',
                        combinedWord,
                        '", "description": "A highly acclaimed collection Eternal Warriors", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                    '"}'
                    )
                )
            )
        );

        // 7) Création du fichier .json final du tokenURI du NFT créé
        string memory finalTokenURI = string(abi.encodePacked(
            "data:application/json;base64,", json
        ));

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenURI);

        return newItemId;
    }
}