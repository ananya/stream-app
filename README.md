# 🍜 Noodles - Streaming app

## Streamer

- creates a new stream using livepeer
- optionally can upload an NFT 
- stream data is stored in ipfs using Pinata (livestream related urls + Future viewer NFT generation data)
- ipfs hash is stored in the blockchain as an ERC721 token (Kovan, Polygon)
- all previous streams are fetched using Covalent API for faster data fetch 

## Viewer 

- donate to the streamer using Superfluid sdk (works only on Kovan) - 5$ per month. 
- Viewer NFT generated without gas minting done via NFTPort and published to Polygon
- generative NFTs are everytime generated using NFT image uploaded from ipfs, address of streamer and viewer (avatar is added if ENS is set) 


# Deployments



## Streamer NFT 
Polygon : https://polygonscan.com/token/0xe3fe2ce72be1074528812924cfc9abad0d3ac898
Kovan: https://kovan.etherscan.io/address/0x806ff7b2e5ef0a3984e2601d7506655264bf31c5


## Sample viewer NFT using NFT Port 
https://polygonscan.com/tx/0x0edb781fc267f26f858f362eeb1a5ef35e932b9748ead197be2f1e8ca6223f2d
