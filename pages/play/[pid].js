import { withRouter } from 'next/router'
import axios from 'axios';
import React, { useEffect, useRouter, useState } from "react";
import VideoJS from '../../components/VideoJS';
import { Row, Col, Card, Meta, Skeleton } from 'antd';
import Player from './player.js';

// function Page({ router }) {
//   const { pid } = router.query
//   const ipfsHash = pid
//   const [ipfsResponse, setIpsfResponse] = useState(null)
//   const [gotIpsfResponse, setGotIpsfResponse] = useState(false)

//   const getStreamData = async () => {
//     console.log("get stream data", ipfsHash)

//     const response = await axios
//       .get(`https://ipfs.io/ipfs/${ipfsHash}`)
//       .then(res => {
//         console.log("got stream data yay", res)

//         setIpsfResponse(res.data)
//         console.log("ipfsResponse", ipfsResponse)
//         setGotIpsfResponse(true)
        
//       })
//   }

//   useEffect(() => {
//     if (!router.isReady) return;

//     getStreamData()
//   }, [router.isReady]);

//   const playbackId = pid;
//   console.log(playbackId)
//   console.log(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`)


//   const playerRef = React.useRef(null);

//   const videoJsOptions = { // lookup the options in the docs for more options
//     autoplay: true,
//     controls: true,
//     responsive: true,
//     fluid: true,
//     sources: [{
//       src: `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`
//     }]
//   }


//   const handlePlayerReady = (player) => {
//     playerRef.current = player;

//     // you can handle player events here
//     player.on('waiting', () => {
//       console.log('player is waiting');
//     });

//     player.on('dispose', () => {
//       console.log('player will dispose');
//     });
//   };



//   return (
//     <>
//       <Row>
//         <Col span={18}>
//           <div className="relative bg-black h-56 lg:h-96 w-full xl:w-3/5 overflow-hidden">
//             <div data-vjs-player>
//               {playbackId ? <VideoJS options={videoJsOptions} onReady={handlePlayerReady} /> : <div>Loading...</div>}
//             </div>
//           </div>
//         </Col>
//         {/* {ipfsResponse} */}
//         {gotIpsfResponse && (
//           <Col span={6}>
//             <Card
//               hoverable
//               style={{ width: 300 }}
//               cover={<img alt="example" src={ipfsResponse.nft_image} />}
//             // actions={[
//             //   <a href={`/play/${item.ipfsHash}`} > <PlayCircleOutlined key="play" /> </a>,
//             //   <CopyOutlined key="copy" />,
//             // ]}
//             >
//               <Meta title="Live Stream" description={
//                 <div>
//                   nft name: {ipfsResponse.nft_name}.
//                   <br />
//                   nft description: {ipfsResponse.nft_description}.
//                   <br />
//                   nft symbol: {ipfsResponse.nft_symbol}
//                 </div>} />
//             </Card>
//           </Col>
//         )}
//       </Row>
//     </>
//   )
// }

// export default withRouter(Page)


function Page({ router }) {
  const { query, isReady } = router
  console.log("pid-pid", query.pid)
  if (!isReady) {
    return (
      <>
      <Skeleton.Input style={{ maxWidth: '500px' }} active size="default" />
      <Skeleton paragraph={{ rows: 10 }} style={{ marginTop: '20px' }} active />
      </>
    )
  } else {
    return (
      <Player pid={query.pid} />
    )
  }
}

export default withRouter(Page)
