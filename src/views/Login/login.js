import { Button, Checkbox, Form, Input, Card, Row} from 'antd';

export function Login() {
    return (
        <div>
            <Row justify="center">

                
            <Card title='Login' style={{width: '50%', top: '50vh'}}>
                
                <Form
                    name="basic"
                    // labelCol={{span: 8,}}
                    // wrapperCol={{span: 16,}}
                    // style={{maxWidth: 600,}}
                    initialValues={{remember: true}}
                    // onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
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
                        <Input />
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
                        <Input.Password />
                    </Form.Item>


                    <Form.Item
                        // wrapperCol={{
                        //     offset: 8,
                        //     span: 16,
                        // }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            </Row>
        </div>
    )
}