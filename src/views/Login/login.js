import { Button, Form, Input, Card, Row, message } from 'antd';
import { useState, useEffect} from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { db_user } from "../../database/db"
import ReactGA from "react-ga4";

export function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [userInfo, setUserInfo] = useState({})
    // Successful Login
    const [messageApi, contextHolder] = message.useMessage();
    const renderError = () => {
      messageApi.error('Error fetching information');
    };
    
    //User has previously logged in
    const verifyLoginStatus = async () => {
        let sessionRecord = await db_user.user.where("user_id").notEqual("").first()
        if(sessionRecord){
            setIsLoggedIn(true)
            setUserInfo(sessionRecord)
        } else {
            setIsLoggedIn(false)
        }
            
    }

    useEffect(() => {
        if(!isLoggedIn)
            verifyLoginStatus()
    }, [])

    const handleLogin = (res) => {
        const log = { //Append session info to to local storage
            user_id: res?.data?.alias,
            last_login: Date.now(),
            study_id: res?.data?.study_id,
            redcap_record_id: res?.data?.id
        }; 
        console.log('caching user information...', log)
        db_user.user.put(log);
        setIsLoggedIn(true)
        setUserInfo(log)
    }

    const submit = () => {
        let { hostname } = window.location
        const url = hostname === 'localhost' ? 'http://localhost:8080/login' : 'https://analyze-j2igbnbiba-uw.a.run.app/login'

        axios({
            method: 'post',
            url: url,
            headers: {
                "Content-Type": 'application/json'
            },
            data: {
                username: username,
                password: password
            }
        }).then((res) => {
            handleLogin(res);
            ReactGA.event({
                category: "User",
                action: "Login Attempt",
                label: "Login Form"
            });
        })
            .catch(err => renderError())
    }

    const onChange = ({ target }) => {
        if (target.name === 'username')
            setUsername(target.value)
        else
            setPassword(target.value)
    }

    if (isLoggedIn === null) //if user is navigating here, wait until status check
        return null
    
    if (isLoggedIn) {
        return <Navigate to={{ pathname: '/home' }} state={userInfo} />
    }

    return (
        <div>
            <Row justify="center">
                <Card title='Login' style={{ width: '50%', top: '40vh', minWidth: '330px', maxWidth: '600px' }}>
                    {contextHolder}
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input name='username' onChange={onChange} />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password name='password' onChange={onChange} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="" onClick={submit}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Row>
        </div>
    )
}