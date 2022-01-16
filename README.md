# 🍜 Noodles - Streaming app

## Streamer

- creates a new stream using livepeer
- optionally can upload an NFT 
- stream data is stored in ipfs using Pinata 
- ipfs hash is stored in the blockchain as an ERC721 token (Kovan)
- all previous streams are fetched using Covalent API for faster data fetch 

## Viewer 

- donate to the streamer using Superfluid sdk (works only on Kovan) - 5$ per month. 
- Viewer NFT generated without gas minting done via NFTPort and published to Polygon
- generative NFTs are everytime generated using NFT image uploaded from ipfs, address of streamer and viewer (avatar is added if ENS is set) 
