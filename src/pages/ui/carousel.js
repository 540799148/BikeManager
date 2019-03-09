import React from 'react';
import {Card, Carousel, Col, Modal} from 'antd';
import './ui.css'

export default class Carousels extends React.Component {
  render() {
    return (
        <div>
          <Card title="图片轮播" className="card-wrap">
            <Carousel effect="fade" autoplay>
              <div><img src="/carousel-img/carousel-1.jpg" style={{width:'100%'}}/></div>
              <div><img src="/carousel-img/carousel-2.jpg" style={{width:'100%'}}/></div>
              <div><img src="/carousel-img/carousel-3.jpg" style={{width:'100%'}}/></div>
            </Carousel>
          </Card>
        </div>
    )
  }
}