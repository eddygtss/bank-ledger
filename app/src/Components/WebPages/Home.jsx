import {NavLink as RRNavLink, withRouter} from 'react-router-dom';
import React from 'react';

import "animate.css"
import "./Home.css"
import "../../App.css";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Button, Row, Col
} from 'reactstrap';

const Home = () => {
    return (
        <div className="about-wrapper">
            <h1 className="about-head-line">The Right Banking Solution For All Ages</h1>
            <br/>

            <Row lg="3" md="1" sm="1" className="home-body">

                <Col className="home-cards">
                    <Card className="home-card">
                        <CardImg className="home-card-img" top width="100%" src="https://newsela.imgix.net/article_media/2019/01/kids-saving-money-92afc088.jpg?auto=compress%2C%20enhance&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&fp-z=1&ar=16%3A9&q=50" alt="Card image cap" />
                        <CardBody className="home-card-body">
                            <CardTitle className="home-card-title" tag="h5">Save</CardTitle>
                            <CardText className="home-card-text">Banking made simple. Gem Bankers United makes it easy for anyone to start saving now.</CardText>
                        </CardBody>
                    </Card>
                </Col>

                <Col className="home-cards">
                    <Card className="home-card">
                        <CardImg className="home-card-img" top width="100%" src="https://reviewed-com-res.cloudinary.com/image/fetch/s--pAFIN1Do--/b_white,c_limit,cs_srgb,f_auto,fl_progressive.strip_profile,g_center,q_auto,w_1200/https://reviewed-production.s3.amazonaws.com/1564514045138/M.png" alt="Card image cap" />
                        <CardBody className="home-card-body">
                            <CardTitle className="home-card-title" tag="h5">Spend</CardTitle>
                            <CardText className="home-card-text">Your money will be there when you need it. Easily transfer funds from Gem Bankers United to outside accounts.</CardText>
                        </CardBody>
                    </Card>
                </Col>

                <Col className="home-cards">
                    <Card className="home-card">
                        <CardImg className="home-card-img" top width="100%" src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/16418/images/W4qE9ZeQbuie2YI5d6PU_July_MMM_Blog_1_Banner_1.png" alt="Card image cap" />
                        <CardBody className="home-card-body">
                            <CardTitle className="home-card-title" tag="h5">Track</CardTitle>
                            <CardText className="home-card-text">Track of your financial growth or catch bad spending habits early on wit Gem Bankers United.</CardText>
                        </CardBody>
                    </Card>
                </Col>

            </Row>
            <div className="home-bottom-text">
                <h3 className="home-head-line text-center">Gem Bankers United</h3>
                <p className="text-center">
                    Our banking system was designed for online banking with ease of use for children in mind. We offer banking that is easy to use, reliable, and secure.
                    Our service is constantly growing so, stay tuned for new features and functionality.

                    Open an account today and be rewarded with a $100 starting balance!
                    <br />
                    <Button className="home-card-btn" tag={RRNavLink} exact to="/account-create" activeClassName="active">Get Started</Button>
                </p>
            </div>

        </div>
    )
};
export default withRouter(Home);