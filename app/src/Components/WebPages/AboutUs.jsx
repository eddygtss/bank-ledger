import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./AboutUs.css";
import {
    Carousel,
    CarouselIndicators,
    CarouselItem,
    CarouselCaption,
    CarouselControl
} from 'reactstrap';

const AboutUs = () => {
    // State for Active index
    const [activeIndex, setActiveIndex] = useState(0);

    // State for Animation
    const [animating, setAnimating] = useState(false);

    // Sample items for Carousel
    const items = [
        {
            caption: 'Sample Caption One',src:
                'https://media.geeksforgeeks.org/wp-content/uploads/20210425122739/2-300x115.png',
            altText: 'Slide One'
        },
        {
            caption: 'Sample Caption Two',src:
                'https://media.geeksforgeeks.org/wp-content/uploads/20210425122716/1-300x115.png',
            altText: 'Slide Two'
        }
    ];

    // Items array length
    const itemLength = items.length - 1

    // Previous button for Carousel
    const previousButton = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ?
            itemLength : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    // Next button for Carousel
    const nextButton = () => {
        if (animating) return;
        const nextIndex = activeIndex === itemLength ?
            0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    // Carousel Item Data
    const carouselItemData = items.map((item) => {
        return (
            <CarouselItem
                className="text-center"
                style={{maxWidth: "100%"}}
                key={item.src}
                onExited={() => setAnimating(false)}
                onExiting={() => setAnimating(true)}
            >
                <img src={item.src} alt={item.altText} />
            </CarouselItem>
        );
    });

    return (
        <div className="about-wrapper myBackGround">
            <h1 className="about-head-line">Our Mission</h1>
            <br/>

            <Carousel previous={previousButton} next={nextButton}
                      activeIndex={activeIndex}>
                <CarouselIndicators items={items}
                                    activeIndex={activeIndex}
                                    onClickHandler={(newIndex) => {
                                        if (animating) return;
                                        setActiveIndex(newIndex);
                                    }} />
                {carouselItemData}
                <CarouselControl directionText="Prev"
                                 direction="prev" onClickHandler={previousButton} />
                <CarouselControl directionText="Next"
                                 direction="next" onClickHandler={nextButton} />
            </Carousel>
            <div className="about-bottom-text">
                <h3 className="about-head-line">Gem Bankers United</h3>
                <p>
                    Our banking system was designed for online banking with ease of use for children in mind. We offer banking that is easy to use, reliable, and secure.
                    Our service is constantly growing so, stay tuned for new features and functionality.

                </p>
            </div>
        </div>
    );
};
export default withRouter(AboutUs);