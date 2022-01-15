import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Layout, Menu, Breadcrumb, Row, Col, Input } from 'antd';
const { Header, Content, Footer } = Layout;
import React from 'react'
import axios from 'axios'

import Nftmodal from '../components/nftmodal';

class Creater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      createStreamResponse: null,
    }
  }

  createStream = async () => {
    console.log("NEXT_PUBLIC_LIVEPEER_API_KEY", process.env.NEXT_PUBLIC_LIVEPEER_API_KEY)
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
            authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`, // API Key needs to be passed as a header
          },
        }
      );

      if (createStreamResponse && createStreamResponse.data) {
        console.log("createStreamResponse", createStreamResponse.data);

        response.statusCode = 200;
        response.data = createStreamResponse.data;
        // this.pinJSONToIPFS(createStreamResponse.data);
        this.setState({
          createStreamResponse: response,
          modalVisible: true,
        })
      } else {

        response.statusCode = 500;
        response.error = "Something went wrong";
      }
    } catch (error) {
      console.log("error", error);
      response.statusCode = 500;

      // Handles Invalid API key error
      // if (error.response.status === 403) {
      //   response.statusCode = 403;
      // }
      response.error = error;
      this.setState({
        createStreamResponse: response
      })
    }
  }

  render() {
    return (
      <>
        <Layout>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="logo">
              <h1>Stream App</h1>
            </div>
          </Header>
          <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb> */}
            <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
              <Row>
                <Col span={8}>
                  <Button 
                    type="primary"
                    onClick={this.createStream}
                  >
                  Create Stream
                  </Button>
                </Col>
                <Col span={8} offset={8}>
                  <Input.Group compact>
                    <Input 
                      style={{ width: 'calc(100% - 200px)' }} 
                      disabled
                      defaultValue="$100" />
                    <Button type="primary">Claim</Button>
                  </Input.Group>
                </Col>
              </Row>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>

        {this.state.createStreamResponse && this.state.createStreamResponse.data && (
          <Nftmodal
            visible={this.state.modalVisible}
            onClose={() => this.setState({ modalVisible: false })}
            stream={this.state.createStreamResponse.data}
          />
        )}
      </>
    )
  }
}

export default Creater
