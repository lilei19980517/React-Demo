import React from 'react';
import { Drawer as AntdDrawer, List } from 'antd-mobile'
import Button from '../Button/Button'
import './index.scss'
class Drawer extends React.Component {
  
  renderSidebar() {
    return <div className='drawer-root-box'>
      <List className='drawer-root-list'>
        {this.props.data.map(item1 => <List.Item key={item1.id}>
          <p className='drawer-root-title'>{item1.title}</p>
          <div className='drawer-root-items'>
            {item1.items.map(item =>
              <div
                className='drawer-root-items-item'
                key={item.value}
              >
                <span
                  onClick={() => { this.props.itemClick(item1.type, item.value) }}
                  className={(item1.values.indexOf(item.value) >= 0) ? 'isActive' : false}
                >
                  {item.label}
                </span>
              </div>
            )}
          </div>
        </List.Item>)}
      </List>
      <Button buttons={this.props.buttons} />
    </div>
  }
  render() {
    return <div className='drawer-root'>
      <AntdDrawer
        className="my-drawer"
        // style={{ minHeight: document.documentElement.clientHeight }}
        enableDragHandle={true}
        contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
        position='right'
        sidebar={this.renderSidebar()}
        open={this.props.open}
        onOpenChange={this.props.onOpenChange}
      >
      </AntdDrawer>
    </div>
  }
}
Drawer.defaultProps = {
  itemClick(v) {
    console.log(v)
  },
  data: [
    {
      id: 1,
      title: '户型',
      items: [
        { name: '一室', value: '12312' },
        { name: '一室', value: 'e12312' },
        { name: '一室', value: '12r312' },
      ]
    },
    {
      id: 2,
      title: '户型',
      items: [
        { name: '一室', value: '123312' },
        { name: '一室', value: '124312' },
      ]
    },
    {
      id: 3,
      title: '户型',
      items: [
        { name: '一室', value: '12af312' },
        { name: '一室', value: '1231f2' },
        { name: '一室', value: '12ad312' },
        { name: '一室', value: '12fa312' },
      ]
    },
  ]
}

export default Drawer;