import {NavLink as RRNavLink, withRouter} from 'react-router-dom';
import React, { useState, useContext } from 'react';

import "animate.css"
import 'react-notifications-component/dist/theme.css'
import "./ContactUs.css"
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';

const ContactUs = () => {


    return (

        <div className="contact-wrapper">
            <h1 className="contact-head-line">Our Team</h1>
            <br/>

            <div className="contact-body">

                <Card className="contact-card">
                    {/*<CardImg top width="100%" src="https://www.becomingminimalist.com/wp-content/uploads/2019/09/how-to-be-happy.jpg" alt="Card image cap" />*/}
                    <CardBody className="contact-card-body">
                        <CardTitle  className="contact-card-tittle" tag="h5">Developer: Eddy</CardTitle>
                        {/*<CardSubtitle tag="h6" className="contact-card-subtitle">Eddy</CardSubtitle>*/}
                        <CardText className="contact-card-text">Email: ########## <br/> Phone: ###-###-####</CardText>
                        <Button className="contact-card-btn" tag={RRNavLink} exact to="/account-create" activeClassName="active">Contact</Button>
                    </CardBody>
                </Card>

                <Card className="contact-card">
                    {/*<CardImg top width="100%" src="https://static-26.sinclairstoryline.com/resources/media/8a6bd265-cf1d-4a0e-9282-922c4969ade1-large16x9_GettyImages894377512.jpg?1533228729450" alt="Card image cap" />*/}
                    <CardBody className="contact-card-body">
                        <CardTitle  className="contact-card-tittle" tag="h5">Developer: Amar</CardTitle>
                        {/*<CardSubtitle tag="h6" className="contact-card-subtitle">Amar</CardSubtitle>*/}
                        <CardText className="contact-card-text">Email: ########## <br/> Phone: ###-###-####</CardText>
                        <Button className="contact-card-btn" tag={RRNavLink} exact to="/account-create" activeClassName="active">Contact</Button>
                    </CardBody>
                </Card>

                <Card className="contact-card">
                    {/*<CardImg top width="100%" src="https://www.gps-securitygroup.com/wp-content/uploads/2021/04/gps-security-blog-8-April.jpg" alt="Card image cap" />*/}
                    <CardBody className="contact-card-body">
                        <CardTitle className="contact-card-tittle" tag="h5">Developer: Muhammad</CardTitle>
                        {/*<CardSubtitle tag="h6" className="contact-card-subtitle">Muhammad</CardSubtitle>*/}
                        <CardText className="contact-card-text">Email: ########## <br/> Phone: ###-###-####</CardText>
                        <Button className="contact-card-btn" tag={RRNavLink} exact to="/account-create" activeClassName="active">Contact</Button>
                    </CardBody>
                </Card>

                <Card className="contact-card">
                    {/*<CardImg top width="100%" src="https://www.gps-securitygroup.com/wp-content/uploads/2021/04/gps-security-blog-8-April.jpg" alt="Card image cap" />*/}
                    <CardBody className="contact-card-body">
                        <CardTitle className="contact-card-tittle" tag="h5">Developer: Brian</CardTitle>
                        {/*<CardSubtitle tag="h6" className="contact-card-subtitle">Brian</CardSubtitle>*/}
                        <CardText className="contact-card-text">Email: ########## <br/> Phone: ###-###-####</CardText>
                        <Button className="contact-card-btn" tag={RRNavLink} exact to="/account-create" activeClassName="active">Contact</Button>
                    </CardBody>
                </Card>
            </div>

            <div className="contact-bottom-text">
                <h5 className="contact-head-line">General Customer Support</h5>
                <p>
                    Here at Gem Bankers United, we pride ourselves on great customer support. We understand the importance of a reliable banking service, therefore we are ready and willing to assist in anyway possible. If you need any assistance relating to service issues or any additional queries please make contact via the following channels.
                    <br/>
                    <br/>Call: 123-456-7890
                    <br/>Fax: 123-456-7890
                    <br/>Discord: https://discord.gg/xwsTzYU2
                </p>
            </div>
        </div>



    )
};
export default withRouter(ContactUs);