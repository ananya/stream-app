import { withRouter } from 'next/router'
import axios from 'axios';
import React, { useEffect, useRouter, useState } from "react";
import VideoJS from '../../components/VideoJS';
import { Row, Col, Card, Meta, Skeleton } from 'antd';
import Creater from './creater.js';

function CreaterPage({ router }) {
  const { query, isReady } = router
  console.log("address", query.address)
  if (!isReady) {
    return (
      <>
      <Skeleton.Input style={{ maxWidth: '500px' }} active size="default" />
      <Skeleton paragraph={{ rows: 10 }} style={{ marginTop: '20px' }} active />
      </>
    )
  } else {
    return (
      <Creater address={query.address}/>
    )
  }
}

export default withRouter(CreaterPage)
