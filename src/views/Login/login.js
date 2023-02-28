import { Button, Form, Input, Card, Row } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { db_sessions } from "../../database/db"

export function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Successful Login
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
            .catch(err => console.log(err))
    }

    const onChange = ({ target }) => {
        if (target.name === 'username')
            setUsername(target.value)
        else
            setPassword(target.value)
    }
    console.log(isLoggedIn)
    if (isLoggedIn) {
        return <Navigate to={{ pathname: '/home' }} />

    }

    return (
        <div>
            <Row justify="center">
                <Card title='Login' style={{ width: '50%', top: '40vh', minWidth: '330px', maxWidth: '600px' }}>
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