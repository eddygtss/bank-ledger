import React from 'react';
import { withRouter } from 'react-router-dom';
import './ContactUs.css';
import {
    Card,
    CardText,
    CardBody,
    CardTitle,
    Row,
    Col
} from 'reactstrap';

const ContactUs = () => {
    return (
        <div className="contact-wrapper myBackGround">
            <h1 className="contact-head-line">Our Team</h1>
            <br/>

            <div className="container-fluid">
                <Row xs="1" md="2" lg="2" xl="4">
                    <Col>
                        <Card className="contact-card">
                            <CardBody className="contact-card-body">
                                <CardTitle  className="contact-card-title" tag="h5">Eddy<br/>Developer</CardTitle>
                                <CardText className="contact-card-text">
                                    Email: <a href="mailto:eddy@gembanking.com">eddy@gembanking.com</a> <br/>
                                    Phone: <a href="tel:888-888-5555">888-888-5555</a>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="contact-card">
                            <CardBody className="contact-card-body">
                                <CardTitle  className="contact-card-title" tag="h5">Amar<br/>Developer</CardTitle>
                                <CardText className="contact-card-text">
                                    Email: <a href="mailto:amar@gembanking.com">amar@gembanking.com</a> <br/>
                                    Phone: <a href="tel:888-777-5555">888-777-5555</a>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="contact-card">
                            <CardBody className="contact-card-body">
                                <CardTitle className="contact-card-title" tag="h5">Muhammad<br/>Developer</CardTitle>
                                <CardText className="contact-card-text">
                                    Email: <a href="mailto:muhammad@gembanking.com">muhammad@gembanking.com</a> <br/>
                                    Phone: <a href="tel:888-666-5555">888-666-5555</a>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="contact-card">
                            <CardBody className="contact-card-body">
                                <CardTitle className="contact-card-title" tag="h5">Brian<br/>Developer</CardTitle>
                                <CardText className="contact-card-text">
                                    Email: <a href="mailto:brian@gembanking.com">brian@gembanking.com</a> <br/>
                                    Phone: <a href="tel:888-555-5555">888-555-5555</a>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="contact-bottom-text">
                <h5 className="contact-head-line">General Customer Support</h5>
                <p>
                    Here at Gem Bankers United, we pride ourselves on great customer support. We understand the importance of a reliable banking service, therefore we are ready and willing to assist in anyway possible. If you need any assistance relating to service issues or any additional queries please make contact via the following channels.
                    <br/>
                    <p className="text-center">
                        <br/>Call: 123-456-7890
                        <br/>Fax: 123-456-7890
                        <br/>Discord: https://discord.gg/xwsTzYU2
                    </p>
                </p>
            </div>
        </div>
    )
};
export default withRouter(ContactUs);