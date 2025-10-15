'use client'
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import {load as cocoSSDLoad} from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'
import { renderPredictions } from '@/utils/renderPred'

let detectInterval;

const ObjectDetection = () => {

  const [isLoading,setIsLoading] = useState(true)

  const webcamRef = useRef(null);
  const canvasRef = useRef(null)



  const runCoco = async () => {
    setIsLoading(true)
    // 5. Load network
    const model = await cocoSSDLoad();
    setIsLoading(false)

    detectInterval = setInterval(() => {
      runObjectDetection(model)
    }, 10);
  };

  async function runObjectDetection(model) {
    if (
      canvasRef.current && webcamRef.current !==null && webcamRef.current.video?.readyState===4
    ){
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;
      // 6. Make Detections
      const predictions = await model.detect(
        webcamRef.current.video,
        undefined,
        0.6
      );

      const context = canvasRef.current.getContext("2d");
      renderPredictions(predictions, context);

    }
  }

  const showmyVideo = () => {
    if (webcamRef.current !== null && webcamRef.current.video?.readyState===4) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  }

  useEffect(() => {
    runCoco()
    showmyVideo()
  },[])

  return (
    <div className='mt-8'>{
        isLoading ? (
          <div >Loading model</div>
        ):

        <div className='relative flex justify-center items-center p-1.5 rounded-md'>
            
          <Webcam
            ref = {webcamRef}
            className='rounded-md w-full lg:h-[720px]'
            muted
          />
          {/* Cnvas */}
          <canvas 
            ref = {canvasRef}
            className='absolute left-0 top-0 z-999999  w-full lg:h-[720px]'
          />
        </div>}
    </div>
  )
}

export default ObjectDetection
