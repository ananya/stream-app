import React from 'react'
import axios from 'axios'

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {
  Form,
  Select,
  InputNumber,
  message,
  Input,
  Layout,
  Switch,
  Radio,
  Menu,
  Slider,
  Button,
  Upload,
  Rate,
  Checkbox,
  Row,
  Col,
  Modal
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
const { Option } = Select;



class Nftmodal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rewardNFT: false,
      nftImageIFSCResponse: null,
    }
  }

  pinJSONToIPFS = (JSONBody) => {
    const { onIPFSUpload } = this.props;
    const { nftImageIFSCResponse } = this.state;
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
      }
    })
    .then(function (response) {

      onIPFSUpload(response.data.IpfsHash, nftImageIFSCResponse);
      console.log(response);
        //handle response here
    })
    .catch(function (error) {
      console.log(error);
        //handle error here
    });
  };

  onFinish = (values) => {
    const { nftImageIFSCResponse } = this.state;
    const { stream } = this.props;
    console.log("nftImageIFSCResponse", nftImageIFSCResponse);
    console.log('Received values of form: ', values);

    const streamCreateData = {
      ingest_url: "rtmp://rtmp.livepeer.com/live/",
      stream_key: stream.streamKey,
      playback_url: `https://cdn.livepeer.com/hls/${stream.playbackId}/index.m3u8`,
      select_sponsers: values.select_sponsers,
      nft_image: `https://ipfs.io/ipfs/${nftImageIFSCResponse}`,
      nft_name: values.nft_name,
      nft_description: values.nft_description,
      nft_symbol: values.nft_symbol,
    }
    this.pinJSONToIPFS(streamCreateData);
    this.onModalClose();
  };

  onModalClose = () => {
    const { onClose } = this.props

    // add a new react component to show the new added livestream to the user
    onClose()
  }

  onChangeRewardNFT = (checked) => {
    this.setState({
      rewardNFT: checked
    })
  }

  uploadNFT = (file) => {
    // debugger
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', file);

    axios
    .post(url, data, {
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
      }      
    })
    .then((response) => {
      console.log("response", response)
      this.setState({
        nftImageIFSCResponse: response.data.IpfsHash
      })
      //handle response here
    })
    .catch((error) => {
      console.log("error", error)
        //handle error here
    });
  }

  render() {
    const { visible, stream } = this.props;
    const { rewardNFT } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <>
        <Modal
          centered
          destroyOnClose
          visible={visible}
          title="Create Stream"
          width='65%'
          footer={null}
          onCancel={this.onModalClose}
          bodyStyle={{ padding: "0px", margin: "0px" }}
        >
          <div style={{ padding: "10px 20px 40px 20px" }}>
            <Form
              name="validate_other"
              {...formItemLayout}
              onFinish={this.onFinish}
            >
              <Form.Item
                name="ingest_url"
                label="Ingest URL"
              >
                <span className="ant-form-text">rtmp://rtmp.livepeer.com/live/</span>
              </Form.Item>
              
              <Form.Item
                name="stream_key"
                label="Stream Key"
              >
                <span className="ant-form-text">{stream.streamKey}</span>
              </Form.Item>
              
              <Form.Item
                name="playback_url"
                label="Playback URL"
              >
                <span className="ant-form-text">https://cdn.livepeer.com/hls/{stream.playbackId}/index.m3u8</span>
              </Form.Item>

              <Form.Item
                name="select_sponsers"
                label="Select sponsers"
                // rules={[{ required: true, message: 'Please select atleast your sponsers', type: 'array' }]}
              >
                <Select mode="multiple" placeholder="Please select sponsers">
                  <Option value="Crypto-Kitties">Crypto Kitties</Option>
                  <Option value="The-Sandbox">The Sandbox</Option>
                  <Option value="Axie-Infinity">Axie Infinity</Option>
                </Select>
              </Form.Item>

              <Form.Item name="switch" label="Reward NFT" valuePropName="checked">
                <Switch 
                  onChange = {this.onChangeRewardNFT}
                />
              </Form.Item>

              { rewardNFT && (
                <>
                  <Form.Item name="nft_image" label="Upload NFT">
                    <Dragger
                      name="file"
                      multiple={true}
                      action={this.uploadNFT}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                      </p>
                    </Dragger>
                  </Form.Item>

                  <Form.Item name="nft_name" label="NFT Name">
                    <Input placeholder="Enter NFT Name" />
                  </Form.Item>

                  <Form.Item name="nft_symbol" label="NFT Symbol">
                    <Input placeholder="Enter NFT Symbol" />
                  </Form.Item>

                  <Form.Item name="nft_description" label="NFT Description">
                    <Input placeholder="Enter NFT Description" />
                  </Form.Item>
                </>
                )
              }

              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Button type="primary" htmlType="submit">
                  Start Stream
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </>
    )
  }
}

export default Nftmodal;