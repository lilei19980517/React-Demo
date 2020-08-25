import React from 'react';
import { Flex } from 'antd-mobile'
import './Card.scss'

class CardList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div className='cardlist-root'>
        {
          this.props.list.map(item => 
            <Flex
              key={item.id}
              className='cardlist-root-item'
            >
              <img 
                className='cardlist-root-item-img'
                src={item.imgSrc}
                alt={item.title}
                style={this.props.imgStyle}
              />
              <Flex
                className='cardlist-root-item-text'
                direction="column"
                justify='around'
              >
                <p className='cardlist-root-item-text-title'>{item.title}</p>
                <Flex 
                  className='cardlist-root-item-text-footer'
                  justify='between'
                >
                  <span>
                    {item.from}
                  </span>
                  <span>
                    {item.date}
                  </span>
                </Flex>
              </Flex>
            </Flex>
          )
        }
      </div>

    )
  }
}

export default CardList