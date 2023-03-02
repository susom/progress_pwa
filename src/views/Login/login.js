import { Button, Form, Input, Card, Row, message } from 'antd';
import { useState, useEffect} from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { db_sessions } from "../../database/db"
import { useLocation } from 'react-router-dom';

export function Login({isOnline}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    
    // Successful Login
    const [messageApi, contextHolder] = message.useMessage();
    const renderError = () => {
      messageApi.error('Error fetching information');
    };
    
    //User has previously logged in
    const verifyLoginStatus = async () => {
        let sessionRecord = await db_sessions.logs.where("userid").notEqual("").first()
        if(sessionRecord)
            setIsLoggedIn(true)
        else
            setIsLoggedIn(false)
    }

    useEffect(() => {
        if(!isLoggedIn)
            verifyLoginStatus()
    }, [])

    const handleLogin = (res) => {
        const log = { //Append session info to to local storage
            userid: res?.data?.alias,
            timestamp: Date.now(),
            hash: res?.data?.hash
        }; 
        console.log('caching login...', log)
        db_sessions.logs.put(log);
        setIsLoggedIn(true)
    }

    const submit = () => {
        let { hostname } = window.location
        const url = hostname === 'localhost' ? 'http://localhost:8080/login' : process.env.REACT_APP_BACKEND_URL

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
            handleLogin(res)
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
        return <Navigate to={{ pathname: '/home' }} />
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