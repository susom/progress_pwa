import { Modal, Typography, Divider } from 'antd';
import './guide.css';
import guideImage from '../../assets/img/GuideIOS.jpg';
import guideSafari from '../../assets/img/GuideSafari.jpg';

function Guide({ open, onClose }) {
    const { Title, Paragraph } = Typography;

    return (
        <Modal title="Installation instructions" className='guide' open={open} onCancel={onClose} footer={null}>
            <div style={{ height: '500px', overflow: 'scroll' }}>
                <Paragraph>
                    The Calm Tool can be installed as an IOS or Android application on your home screen.
                    This will enable offline use after being loaded for the first time.
                    Please follow the instructions below depending on your device type.
                </Paragraph>
                <Divider />
                <Title level={4}>iOS - Safari</Title>
                <Paragraph>You can add this application to your home screen by doing the following:</Paragraph>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideSafari}></img>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideImage}></img>
                </div>
                <Divider />
            </div>
        </Modal>
    );
}

export default Guide;