import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Layout, Menu, Breadcrumb, Row, Col, Input } from 'antd';
const { Header, Content, Footer } = Layout;


export default function Creater() {
  return (
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
                href="/game"
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
  )
}
