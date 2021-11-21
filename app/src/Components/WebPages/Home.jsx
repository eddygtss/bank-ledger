import {NavLink as RRNavLink, withRouter} from 'react-router-dom';
import React from 'react';

import "animate.css"
import "./Home.css"
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Button
} from 'reactstrap';

const Home = () => {
    return (
    <div className="home-wrapper myBackGround">
        <h1 className="home-head-line">The Right Banking Solution For All Ages</h1>
        <br/>

        <div className="home-bottom-text">
            <p className="text-center">
                Our banking system was designed for online banking with ease of use for children in mind.<br/>
                Our service is constantly growing so, stay tuned for new features and functionality.<br/>

                <br /><br />
                Open an account today and be rewarded with a $100 starting balance!
                <br /><br />
                <Button className="home-card-btn" tag={RRNavLink} exact to="/account-create" activeClassName="active">Get Started</Button>
            </p>
        </div>

    <div className="about-body">
        <Card className="about-card">
            <CardImg className="about-card-img" top width="100%" src="https://newsela.imgix.net/article_media/2019/01/kids-saving-money-92afc088.jpg?auto=compress%2C%20enhance&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&fp-z=1&ar=16%3A9&q=50" alt="Card image cap" />
            <CardBody className="about-card-body">
                <CardTitle className="about-card-title text-center fw-bold" tag="h5">Save</CardTitle>
                <CardText className="about-card-text text-center">Banking made simple. Gem Bankers United makes it easy for anyone to start saving now.</CardText>
            </CardBody>
        </Card>



        <Card className="about-card">
            <CardImg className="about-card-img" top width="100%" src="https://reviewed-com-res.cloudinary.com/image/fetch/s--pAFIN1Do--/b_white,c_limit,cs_srgb,f_auto,fl_progressive.strip_profile,g_center,q_auto,w_1200/https://reviewed-production.s3.amazonaws.com/1564514045138/M.png" alt="Card image cap" />
            <CardBody className="about-card-body">
                <CardTitle className="about-card-title text-center fw-bold" tag="h5">Spend</CardTitle>
                <CardText className="about-card-text text-center">Your money will be there when you need it. Easily transfer funds to other Gem Bank members.</CardText>
            </CardBody>
        </Card>



        <Card className="about-card">
            <CardImg className="about-card-img" top width="100%" src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/16418/images/W4qE9ZeQbuie2YI5d6PU_July_MMM_Blog_1_Banner_1.png" alt="Card image cap" />
            <CardBody className="about-card-body">
                <CardTitle className="about-card-title text-center fw-bold" tag="h5">Track</CardTitle>
                <CardText className="about-card-text text-center">Keep track of your financial growth or catch bad spending habits early on with Gem Bankers United.</CardText>
            </CardBody>
        </Card>
    </div>

</div>
    )
};
export default withRouter(Home);