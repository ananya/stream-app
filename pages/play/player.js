import React from "react";
import axios from 'axios';
import { ethers } from "ethers";

import { Row, Col, Card, Meta, Skeleton, Image, Button, Input, Popover } from 'antd';
import VideoJS from '../../components/VideoJS';


class Player extends React.Component {
  constructor(props) {
    super(props);
    console.log("pid-play", this.props.pid)
    this.playerRef = React.createRef();
    this.state = {
      ingest_url: null,
      nft_description: null,
      nft_image: null,
      nft_name: null,
      nft_symbol: null,
      playback_url: null,
      stream_key: null,
      isLoading: true,
      address: null,
      inputAddress: null,
      NFTMintingAddress: null
    }
  }

  async componentDidMount() {
    console.log("componentDidMount")
    this.getStreamData()
    await this.setAddress();
  }

  setDataFromIpfs = (ipfsResponse) => {
    console.log("setDataFromIpfs", ipfsResponse)
    this.setState({
      ingest_url: ipfsResponse.ingest_url,
      nft_description: ipfsResponse.nft_description,
      nft_image: ipfsResponse.nft_image,
      nft_name: ipfsResponse.nft_name,
      nft_symbol: ipfsResponse.nft_symbol,
      playback_url: ipfsResponse.playback_url,
      stream_key: ipfsResponse.stream_key,
      isLoading: false
    })
  }

  getStreamData = async () => {
    const { pid } = this.props;
    console.log("get stream data", pid)

    const response = await axios
      .get(`https://ipfs.io/ipfs/${pid}`)
      .then(res => {
        console.log("got stream data yay", res.data)
        return res.data

      })

    this.setDataFromIpfs(response);
  }

  handlePlayerReady = (player) => {

    this.playerRef.current = player;

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };


  setAddress = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    this.setState({
      address: accounts[0]
    })
  }

  connectWallet = async () => {
    console.log("connectWallet")
    if (this.state.address) return null
    const { ethereum } = window;
    await ethereum.request({ method: 'eth_requestAccounts' });
    await this.setAddress();
  }

  setConnectedWalletAddressAsMintAddress =  () => {
    const { address }  = this.state;
    this.setState({
      NFTMintingAddress: address
    })
  }

  mintNFTPort = async () => {
    const {
      isLoading,
      ingest_url,
      nft_description,
      nft_image,
      nft_name,
      nft_symbol,
      playback_url,
      stream_key,
      address
    } = this.state;

    const options = {
      method: 'POST',
      url: 'https://api.nftport.xyz/v0/mints/easy/urls',
      headers: { 'Content-Type': 'application/json', Authorization: process.env.NEXT_PUBLIC_NFT_PORT_API_KEY },
      data: {
        chain: 'polygon',
        name: nft_name,
        description: nft_description,
        file_url: nft_image,
        mint_to_address: address
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  setMintAddress = (address) => {
    this.setState({
      NFTMintingAddress: address
    })
  }

  onAddingAddress = async () => {
    const { inputAddress } = this.state;
    console.log(inputAddress, "inputAddress")
    if (ethers.utils.isAddress(inputAddress)) {
      this.setMintAddress(inputAddress);
    } else {
      const provider = new ethers.providers.AlchemyProvider(null, process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
      const address = await provider.resolveName(inputAddress)
      this.setMintAddress(address);
    }
  }


  handleInputChange = (e) => {
    this.setState({
      inputAddress: e.target.value
    })
  }

  render() {
    const { pid } = this.props;
    const {
      isLoading,
      ingest_url,
      nft_description,
      nft_image,
      nft_name,
      nft_symbol,
      playback_url,
      stream_key,
      address,
      NFTMintingAddress
    } = this.state;


    console.log("streamData", ingest_url,
      nft_description,
      nft_image,
      nft_name,
      nft_symbol,
      playback_url,
      stream_key)


    const videoJsOptions = { // lookup the options in the docs for more options
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{
        src: playback_url
      }]
    }

    return (
      <Row>
        <Col span={18}>
          <div className="relative bg-black h-56 lg:h-96 w-full xl:w-3/5 overflow-hidden">
            <div data-vjs-player>
              {playback_url ? <VideoJS options={videoJsOptions} onReady={this.handlePlayerReady} /> : <div>Loading...</div>}
            </div>
          </div>
        </Col>
        {/* {ipfsResponse} */}

        {!isLoading ? (
          <Col span={4} offset={1}>
            <br />
            <Image
              width={250}
              src={nft_image}
            />

            <div>
              nft name: {nft_name}.
              <br />
              nft description: {nft_description}.
              <br />
              nft symbol: {nft_symbol}
            </div>
            <br />
            {address ?
              <Button onClick={this.setConnectedWalletAddressAsMintAddress} type="primary" size="large" block ghost>Select {address.substring(0, 7)} </Button> :
              <div>
                <Button onClick={this.connectWallet} type="primary" size="large" block>Connect Wallet</Button>

              </div>

            }

            <br />
            <br />
            or
            <br />

            <Input.Group compact>
              <Input style={{ width: 'calc(100% - 80px)' }} placeholder="Enter address or ens" name="address" onChange={this.handleInputChange} />
              <Button type="primary" onClick={this.onAddingAddress}>Submit</Button>
            </Input.Group>
            <br />
            <br />
            <div>
              Mint NFT at {NFTMintingAddress ? NFTMintingAddress.substring(0, 7) : "address"}
            </div>
            <Popover content="Minting without gas in Polygon Network using NFTPort." title="Gasless NFT Minting">
              <Button
                type="primary"
                size="large"
                block
              // onClick={this.mintNFTPort}
              >Mint NFT without Gas</Button>
            </Popover>
          </Col>
        ) : <div>Loading NFT</div>}
      </Row>
    )
  }
}

export default Player;