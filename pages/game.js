import React from 'react'
import axios from 'axios'

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Layout, Menu, Breadcrumb, Row, Col, Input, Select, Checkbox, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { providers } from "ethers";

const { Dragger } = Upload;
const { Header, Content, Footer } = Layout;
const { Option } = Select;

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadNFTDisabled: true,
      createStreamResponse: null,
      address: null
    }
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  onChange = (e) => {
    //make upload visible
    this.setState({
      uploadNFTDisabled: !e.target.checked
    })
    console.log(`checked = ${e.target.checked}`);
  }


  properties = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  createStream = async () => {
    let response = {
      statusCode: null,
      data: null,
      error: null
    }

    try {
      const createStreamResponse = await axios.post(
        "https://livepeer.com/api/stream",
        {
          name: "test stream",
          profiles: [
            {
              name: "720p",
              bitrate: 2000000,
              fps: 30,
              width: 1280,
              height: 720,
            },
            {
              name: "480p",
              bitrate: 1000000,
              fps: 30,
              width: 854,
              height: 480,
            },
            {
              name: "360p",
              bitrate: 500000,
              fps: 30,
              width: 640,
              height: 360,
            },
          ],
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer `, // API Key needs to be passed as a header
          },
        }
      );

      if (createStreamResponse && createStreamResponse.data) {
        console.log("createStreamResponse", createStreamResponse.data);

        response.statusCode = 200;
        response.data = createStreamResponse.data;
      } else {

        response.statusCode = 500;
        response.error = "Something went wrong";
      }
      this.setState({
        createStreamResponse: response
      })
    } catch (error) {
      console.log("error", error);
      response.statusCode = 500;

      // Handles Invalid API key error
      if (error.response.status === 403) {
        response.statusCode = 403;
      }
      response.error = error;
      this.setState({
        createStreamResponse: response
      })
    }
  }

  setAddress = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    this.setState({
      address: accounts[0]
    })
  }

  connectWallet = async () => {
    if(this.state.address) return null
    const { ethereum } = window;
    await ethereum.request({ method: 'eth_requestAccounts' });
    await this.setAddress();
  }

  async componentDidMount() {
    await this.setAddress();
  }

  render() {
    const { uploadNFTDisabled, createStreamResponse, address } = this.state;
    return (
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal right" >
            <Menu.Item >Home</Menu.Item>
            <Menu.Item>Stream</Menu.Item>
            <Menu.Item>

              <Button
                onClick={this.connectWallet}
                type="primary" size="large">  {address ? address : "Connect Wallet"}</Button>
            </Menu.Item>
          </Menu>
        </Header>
        <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <Row>
              <Col span={2}>
                <div className='sponser'>Select Game</div>
              </Col>
              <Col span={8} >
                <Select defaultValue="Axie-Infinity" style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value="Crypto-Kitties">Crypto Kitties</Option>
                  <Option value="The-Sandbox">The Sandbox</Option>
                  <Option value="Axie-Infinity">Axie Infinity</Option>
                </Select>
              </Col>
            </Row>
            <Row>
              <Checkbox onChange={this.onChange}>Reward NFT</Checkbox>
            </Row>

            <Row>
              <Dragger {...this.properties} disabled={uploadNFTDisabled}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                  band files
                </p>
              </Dragger>
            </Row>
            <Row>
              <Button
                type="primary"
                onClick={this.createStream}
              >
                Create Stream
              </Button>
            </Row>

            {
              createStreamResponse &&
              createStreamResponse.statusCode === 200 &&
              createStreamResponse.data && (
                <div>
                  <Row>
                    <Col span={2}>
                      <div>Ingest URL</div>
                    </Col>
                    <Col span={8}>
                      <div className='ingest-url'>rtmp://rtmp.livepeer.com/live/</div>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={2}>
                      <div>Stream Key</div>
                    </Col>
                    <Col span={8}>
                      <div className='stream-key'>{createStreamResponse.data.streamKey}</div>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={2}>
                      <div>Playback URL</div>
                    </Col>
                    <Col span={8}>
                      <div className='playback-url'>https://cdn.livepeer.com/hls/{createStreamResponse.data.playbackId}/index.m3u8</div>
                    </Col>
                  </Row>
                </div>
              )}
          </div>
        </Content>
      </Layout>
    )
  }
}

export default Game
