import React from 'react';

class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {

    // 如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应图片居中
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();

  }

  render() {
    let controllerUnitClassName = 'controller-unit';

    // 如果对应的是居中的图片，显示控制按钮的居中态
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center';
    }

    // 如果对应的是翻转的图片，显示控制按钮的居中态
    if (this.props.arrange.isInverse) {
      controllerUnitClassName += ' is-inverse';
    }

    return (
      <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
    )
  }
}

export default ControllerUnit;
