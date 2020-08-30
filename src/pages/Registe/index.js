import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace } from 'antd-mobile'
import { Link } from 'react-router-dom'
import instance from '../../utils/axios'
import { BASE_URL } from '../../utils/url'
import { Formik, Form, Field,ErrorMessage} from 'formik'
import {Toast} from 'antd-mobile'
import { setToken} from '../../utils/auth'
import styles from './index.module.css'

// 验证规则：
const REG_UNAME = /^[a-zA-Z][a-zA-Z\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{3,12}$/

class Registe extends Component {
  state={
    message:''
  }
  render() {
    return (
      <div className={styles.root}>
        <WhiteSpace size="xl" />
        <Formik
          initialValues={{
            username: "",
            password: "",
            passwordAgain: "",
          }}
          // validationSchema={Yup.object().shape({
          //   username: Yup.string().required('请输入账号').matches(REG_UNAME),
          //   password: Yup.string().required('请输入密码').matches(REG_PWD),
          //   passwordAgain:Yup.string().required('请再次确认密码')
          // })}
          validate={values=>{
            let errors ={}
            const {username,password,passwordAgain}=values
            if(username.trim().length===0 || !REG_UNAME.test(username.trim())){
              errors.username = '用户名必须6-9位大小写字母、下划线_、数字，且不能数字开头'
            } 
            if(password.trim().length === 0 || !REG_PWD.test(username.trim())){
              errors.password = '密码必须是5到8位的大小写字母、数字、下划线_'
            }
            if(passwordAgain !== password){
              errors.passwordAgain = '两次输入密码不一样'
            }
            return errors
          }}
         onSubmit={async (values) => {
            // 发送请求
            const res = await instance.post(BASE_URL+'/user/registered',{
                username:values.username,
                password:values.password
            })
            if(res.status===200){
              if(res.data.status!==200){
                res.data.description==='你输入的账号名重复'
                ?
                Toast.fail('用户名已被其他人使用',1.5,null,false)
                :
                Toast.fail(res.data.description,1,null,false)
              }else{
                setToken(res.data.body.token)
                Toast.success(res.data.description,1.5,()=>{this.props.history.replace('/home/my')},false)
                
              }
            }
          }}
          render = {props =>     <WingBlank>
            <Form>
              <div className={styles.formItem}>
                <label className={styles.label}>用户名</label>
                <Field 
                  name='username' 
                  className={styles.input} 
                  placeholder="请输入账号" 
                />
              </div>
                <ErrorMessage
                  className={styles.error}
                  name="username"
                  component="div"
                />
              <div className={styles.formItem}>
                <label className={styles.label}>密码</label>
                <Field 
                  name='password'
                  className={styles.input}
                  type="password"
                  placeholder="请输入密码"
                />
              </div>
                <ErrorMessage
                  className={styles.error}
                  name="password"
                  component="div"
                />
              <div className={styles.formItem}>
                <label className={styles.label}>重复密码</label>
                <Field
                  name='passwordAgain'
                  className={styles.input}
                  type="password"
                  placeholder="请重新输入密码"
                />
              </div>
                <ErrorMessage
                  className={styles.error}
                  name="passwordAgain"
                  component="div"
                />
              <div className={styles.formSubmit}>
                <button className={styles.submit} type="submit">
                  注册
                </button>
              </div>
            </Form>
            <Flex className={styles.backHome} justify="between">
              <Link to="/home">点我回首页</Link>
              <Link to="/login">已有账号，去登录</Link>
            </Flex>
          </WingBlank>}
        />
      </div>
    )
  }
}

export default Registe
