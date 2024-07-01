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

    // 计算左侧、右侧、上侧、下侧区域图片排布位置的取值范围
    const posRange = this.props.constant.posRange;
    posRange.leftSecX = [-halfImgW, halfStageW - halfImgW * 3];
    posRange.rightSecX = [halfStageW + halfImgW, stageW - halfImgW];
    posRange.topSecY = [-halfImgH, halfStageH - halfImgH];
    posRange.bottomSecY = [halfStageH - halfImgH, stageH - halfImgH];

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
      posRange = constant.posRange;

    // 布局左右两侧的图片
    for (let i = 0, len = imgsArrangeArr.length, k = len / 2; i < len; i++) {
      let posRangeX = [0, 0], posRangeY = [0, 0];

      if (i !== centerIndex) {
        //左上、左下、右上、右下
        if (i < k) {
          posRangeX = posRange.leftSecX;
          if (i < k/2) {
            posRangeY = posRange.topSecY;
          } else {
            posRangeY = posRange.bottomSecY;
          }
        } else {
          posRangeX = posRange.rightSecX;
          if (len - i < k/2) {
            posRangeY = posRange.bottomSecY;
          } else {
            posRangeY = posRange.topSecY;
          }
        }

        imgsArrangeArr[i] = {
          pos: {
            top: getRangeRandom(posRangeY[0], posRangeY[1]),
            left: getRangeRandom(posRangeX[0], posRangeX[1]),
          },
          rotate: get30DegRandom(),
          isCenter: false,
        }
      } else {
        imgsArrangeArr[i] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true,
        }
      }
    }

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
    posRange: { // 取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      topSecY: [0, 0],
      bottomSecY: [0, 0],
    },
  },
};

export default AppComponent;
