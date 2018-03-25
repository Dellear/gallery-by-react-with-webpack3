// css
import 'normalize.css/normalize.css';
import '../styles/App.pcss';

import React from 'react';
import ReactDOM from 'react-dom';
import ImgFigure from './ImgFigure';
import ControllerUnit from './controllerUnit';

// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

/**
 * 利用自执行函数，将图片名信息转化为图片的url地址
 */
imageDatas = (function getImagesUrl(imageDatasArr) {
  for (let i = 0, len = imageDatasArr.length; i < len; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageUrl = require(`../images/${imageDatasArr[i].fileName}`);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
  
})(imageDatas);


/**
 * 获取区间内的一个随机值(取整)
 *
 * @param {any} low
 * @param {any} high
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * 获取0～30°之间的任意一个正副值（取整）
 *
 * @returns
 */
function get30DegRandom() {
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}


class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        /* {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,   // 旋转角度
          isInverse: false  // 图片正反面
          isCenter: false  // 图片是否在中间
        } */
      ],
    };
  }

  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount() {
    // 首选拿到舞台的大小
    const stageDom = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDom.scrollWidth,
      stageH = stageDom.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imageFigure的大小
    const imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDom.scrollWidth,
      imgH = imgFigureDom.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置点
    this.props.constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH,
    }

    // 计算左侧、右侧区域图片排布位置的取值范围
    this.props.constant.hPosRange.leftSecX = [-halfImgW, halfStageW - halfImgW * 3];
    this.props.constant.hPosRange.rightSecX = [halfStageW + halfImgW, stageW - halfImgW];
    this.props.constant.hPosRange.y = [-halfImgH, stageH - halfImgH];

    // 计算上侧区域图片排布位置的取值范围
    this.props.constant.vPosRange.topY = [-halfImgH, halfStageH - halfImgH * 3];
    this.props.constant.vPosRange.x = [halfStageW - imgW, halfImgW];


    // this.rearrange(getRangeRandom(0, imageDatas.length - 1));
    this.rearrange(0);
  }

  /**
   * 翻转图片
   *
   * @param {any} index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {Function} 这是一个闭包函数，期内return一个真正待被执行的函数
   *
   * @memberOf AppComponent
   */
  inverse(index) {
    return function () {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr,
      })
    }.bind(this);
  }

  /**
   * 图片居中
   *
   * @param {any} index 需要居中的图片的索引
   * @returns
   *
   * @memberOf AppComponent
   */
  center(index) {
    return function () {
      this.rearrange(index);
    }.bind(this)
  }

  /**
   * 重新布局所有图片
   *
   * @param {any} centerIndex 指定居中排布哪个图片
   *
   * @memberOf AppComponent
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      constant = this.props.constant,
      centerPos = constant.centerPos,
      hPosRange = constant.hPosRange,
      vPosRange = constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2), // 取一个或者不取
      topImgSpliceIndex = 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首选居中 centerIndex 的图片
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true,
    }

    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * imgsArrangeArr.length );

    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
        },
        rotate: get30DegRandom(),
        isCenter: false,
      }
    });

    // 布局左右两侧的图片
    for (let i = 0, len = imgsArrangeArr.length, k = len / 2; i < len; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边，后半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
        },
        rotate: get30DegRandom(),
        isCenter: false,
      }
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({ imgsArrangeArr });

  }



  render() {
    const controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach(function (value, index) {

      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0,
          },
          rotate: 0,
          isInverse: false,
        }
      }

      imgFigures.push(<ImgFigure key={index} data={value} ref={`imgFigure${index}`}
        arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);

      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)} center={this.center(index)}  />);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-section">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
  constant: {
    centerPos: {
      left: 0,
      right: 0,
    },
    hPosRange: { // 水平方向的取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0],
    },
    vPosRange: {  // 垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0],
    },
  },
};

export default AppComponent;
