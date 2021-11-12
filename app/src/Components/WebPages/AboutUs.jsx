import {NavLink as RRNavLink, withRouter} from 'react-router-dom';
import React, { useState, useContext } from 'react';

import "animate.css"
import "./Home.css"
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';

const Home = () => {


    return (
    <div className="about-wrapper">
        <h1 className="about-head-line">The Right Banking Solution For All Ages</h1>
        <br/>

    <div className="about-body">

        <Card className="about-card">
            <CardImg className="about-card-img" top width="100%" src="https://newsela.imgix.net/article_media/2019/01/kids-saving-money-92afc088.jpg?auto=compress%2C%20enhance&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&fp-z=1&ar=16%3A9&q=50" alt="Card image cap" />
            <CardBody className="about-card-body">
                <CardTitle className="about-card-tittle" tag="h5">Save</CardTitle>
                {/*<CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle>*/}
                <CardText className="about-card-text">Banking made simple. Gem Bankers United makes it easy for anyone to start saving now.</CardText>
                <Button className="about-card-btn" tag={RRNavLink} exact to="/account-create" activeClassName="active">Get Started</Button>
            </CardBody>
        </Card>

        <Card className="about-card">
            <CardImg className="about-card-img" top width="100%" src="https://reviewed-com-res.cloudinary.com/image/fetch/s--pAFIN1Do--/b_white,c_limit,cs_srgb,f_auto,fl_progressive.strip_profile,g_center,q_auto,w_1200/https://reviewed-production.s3.amazonaws.com/1564514045138/M.png" alt="Card image cap" />
            <CardBody className="about-card-body">
                <CardTitle className="about-card-tittle" tag="h5">Spend</CardTitle>
                {/*<CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle>*/}
                <CardText className="about-card-text">Your money will be there when you need it. Easily transfer funds from Gem Bankers United to outside accounts.</CardText>
                <Button className="about-card-btn" tag={RRNavLink} exact to="/account-create" activeClassName="active">Get Started</Button>
            </CardBody>
        </Card>

        <Card className="about-card">
            <CardImg className="about-card-img" top width="100%" src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/16418/images/W4qE9ZeQbuie2YI5d6PU_July_MMM_Blog_1_Banner_1.png" alt="Card image cap" />
            <CardBody className="about-card-body">
                <CardTitle className="about-card-tittle" tag="h5">Track</CardTitle>
                {/*<CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle>*/}
                <CardText className="about-card-text">Track of your financial growth or catch bad spending habits early on wit Gem Bankers United.</CardText>
                <Button className="about-card-btn" tag={RRNavLink} exact to="/account-create" activeClassName="active">Get Started</Button>
            </CardBody>
        </Card>

    </div>
        <div className="about-bottom-text">
            <h3 className="about-head-line">Gem Bankers United</h3>
            <p>
                Our banking system was designed for online banking with ease of use for children in mind. We offer banking that is easy to use, reliable, and secure.
                Our service is constantly growing so, stay tuned for new features and functionality.

            </p>
        </div>

</div>


    )
};
export default withRouter(Home);