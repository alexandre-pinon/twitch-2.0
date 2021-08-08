import axios from 'axios'
import dotenv from 'dotenv'
import NodeMediaServer from 'node-media-server'

dotenv.config({ path: '.stream.env' })

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: process.env.STREAM_PORT,
    allow_origin: '*',
  },
}

var nms = new NodeMediaServer(config)
nms.run()

nms.on('postPublish', async (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on postPublish]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  )
  const streamKey = StreamPath.substring(6)
  try {
    const response = await axios.post(
      `${process.env.BACK_ORIGIN}:${process.env.BACK_PORT}/stream/insert`,
      {streamKey}
    )
    console.log({ response })
  } catch (error) {
    console.log({ error })
  }
})

nms.on('donePublish', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on donePublish]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  )
})

nms.on('prePlay', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on prePlay]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  )
  // let session = nms.getSession(id);
  // session.reject();
})

nms.on('postPlay', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on postPlay]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  )
})

nms.on('donePlay', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on donePlay]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  )
})
