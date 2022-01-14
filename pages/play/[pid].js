import { withRouter } from 'next/router'
import React, {useEffect, useRouter} from "react";
import VideoJS from '../../components/VideoJS';


function Page({ router }) {
  const { pid } = router.query
  const playbackId = pid;
  console.log(playbackId)
  console.log(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`)


  const playerRef = React.useRef(null);

  const videoJsOptions = { // lookup the options in the docs for more options
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`
    }]
  }
  

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };



  return (
    <div className="relative bg-black h-56 lg:h-96 w-full xl:w-3/5 overflow-hidden">
      <div data-vjs-player>

        {playbackId ?   <VideoJS options={videoJsOptions} onReady={handlePlayerReady} /> : <div>Loading...</div>}

    


      </div>

    </div>
  )
}

export default withRouter(Page)