import React from 'react';
import Carousel from "react-material-ui-carousel"
import autoBind from "auto-bind"
import '../style/Example.scss';
import { ReactFlvPlayer } from 'react-flv-player'

import {
    Card,
/*     CardContent, */
    CardMedia,
    Typography,
    Grid,
/*     Button,
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
    Slider, */
} from '@material-ui/core';

function Banner(props) {

    let items = [];

    const totalItems = props.length ? props.length : 1;
    const mediaLength = totalItems ;

    for (let i = 0; i < mediaLength; i++) {
        const item = props.item.Items[i];

        const media = (
            <Grid item xs={12 / totalItems} key={item.Name}>
                <CardMedia
                    className="Media"
                    image={item.Image}
                    title={item.Name}
                >
{/*                     <ReactFlvPlayer
                        url="https://www.youtube.com/watch?v=GF04QkRU4es"
                        height="auto"
                        width="1200px"
                        isMuted={false}
                    /> */}
                    <Typography hidden className="MediaCaption">
                        {item.Name}
                    </Typography>
                </CardMedia>

            </Grid>
        )

        items.push(media);
    }

    return (
        <Card raised className="Banner">
            <Grid container spacing={0} className="BannerGrid">
                {items}
            </Grid>
        </Card>
    )
}

const items = [
    {
        Name: "One",
        Caption: "Electrify your friends!",
        Items: [
            {
                Name: "Macbook Pro",
                Image: "https://via.placeholder.com/640x360/fff"
            }
        ]
    },
    {
        Name: "Two",
        Caption: "Say no to manual home labour!",
        Items: [
            {
                Name: "Washing Machine WX9102",
                Image: "https://via.placeholder.com/640x360/aaa"
            }
        ]
    },
    {
        Name: "Three",
        Caption: "Give style and color to your living room!",
        Items: [
            {
                Name: "Living Room Lamp",
                Image: "https://via.placeholder.com/640x360/000"
            }
        ]
    },
    {
        Name: "Four",
        Caption: "Electrify your friends!",
        Items: [
            {
                Name: "Macbook Pro",
                Image: "https://via.placeholder.com/640x360/"
            }
        ]
    }
]

class BannerExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            autoPlay: true,
            animation: "fade",
            indicators: true,
            timeout: 500,
            navButtonsAlwaysVisible: false,
            navButtonsAlwaysInvisible: false,
            cycleNavigation: true
        }

        autoBind(this);
    }

    toggleAutoPlay() {
        this.setState({
            autoPlay: !this.state.autoPlay
        })
    }

    toggleIndicators() {
        this.setState({
            indicators: !this.state.indicators
        })
    }

    toggleNavButtonsAlwaysVisible() {
        this.setState({
            navButtonsAlwaysVisible: !this.state.navButtonsAlwaysVisible
        })
    }

    toggleNavButtonsAlwaysInvisible() {
        this.setState({
            navButtonsAlwaysInvisible: !this.state.navButtonsAlwaysInvisible
        })
    }

    toggleCycleNavigation() {
        this.setState({
            cycleNavigation: !this.state.cycleNavigation
        })
    }

    changeAnimation(event) {
        this.setState({
            animation: event.target.value
        })
    }

    changeTimeout(event, value) {
        this.setState({
            timeout: value
        })
    }

    render() {
        return (
            <div style={{ marginTop: "50px", color: "#494949" }}>
                <Carousel
                    className="Example"
                    autoPlay={this.state.autoPlay}
                    animation={this.state.animation}
                    indicators={this.state.indicators}
                    timeout={this.state.timeout}
                    cycleNavigation={this.state.cycleNavigation}
                    navButtonsAlwaysVisible={this.state.navButtonsAlwaysVisible}
                    navButtonsAlwaysInvisible={this.state.navButtonsAlwaysInvisible}
                    next={(now, previous) => console.log(`Next User Callback: Now displaying child${now}. Previously displayed child${previous}`)}
                    prev={(now, previous) => console.log(`Prev User Callback: Now displaying child${now}. Previously displayed child${previous}`)}
                    onChange={(now, previous) => console.log(`OnChange User Callback: Now displaying child${now}. Previously displayed child${previous}`)}
                    // fullHeightHover={false}
                    // navButtonsProps={{style: {backgroundColor: 'cornflowerblue', borderRadius: 0}}}
                    // navButtonsWrapperProps={{style: {bottom: '0', top: 'unset', }}}
                    // indicatorContainerProps={{style: {margin: "20px"}}}
                    // NextIcon='next'
                >
                    {
                        items.map((item, index) => {
                            return <Banner item={item} key={index} contentPosition={item.contentPosition} />
                        })
                    }
                </Carousel>


{/*                 <FormLabel component="legend">Options</FormLabel>
                <FormControlLabel
                    control={
                        <Checkbox onChange={this.toggleAutoPlay} checked={this.state.autoPlay} value="autoplay"
                            color="primary" />
                    }
                    label="Auto-play"
                />
                <FormControlLabel
                    control={
                        <Checkbox onChange={this.toggleIndicators} checked={this.state.indicators} value="indicators"
                            color="primary" />
                    }
                    label="Indicators"
                />
                <FormControlLabel
                    control={
                        <Checkbox onChange={this.toggleNavButtonsAlwaysVisible} checked={this.state.navButtonsAlwaysVisible} value="NavButtonsAlwaysVisible" color="primary" />
                    }
                    label="NavButtonsAlwaysVisible"
                />

                <FormControlLabel
                    control={
                        <Checkbox onChange={this.toggleNavButtonsAlwaysInvisible} checked={this.state.navButtonsAlwaysInvisible} value="NavButtonsAlwaysInvisible" color="primary" />
                    }
                    label="NavButtonsAlwaysInvisible"
                />
                <FormControlLabel
                    control={
                        <Checkbox onChange={this.toggleCycleNavigation} checked={this.state.cycleNavigation} value="CycleNavigation" color="primary" />
                    }
                    label="CycleNavigation"
                />

                <FormControlLabel
                    control={
                        <RadioGroup name="animation" value={this.state.animation} onChange={this.changeAnimation} row
                            style={{ marginLeft: "10px" }}>
                            <FormControlLabel value="fade" control={<Radio color="primary" />} label="Fade" />
                            <FormControlLabel value="slide" control={<Radio color="primary" />} label="Slide" />
                        </RadioGroup>
                    }
                />

                <FormControlLabel
                    control={
                        <div style={{ width: 300 }}>
                            <Typography id="discrete-slider" gutterBottom>
                                Animation Duration (Timeout) in ms
                            </Typography>
                            <Slider
                                defaultValue={500}
                                getAriaValueText={() => `${this.state.timeout}ms`}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                step={100}
                                marks
                                min={100}
                                max={2000}
                                onChange={this.changeTimeout}
                            />
                        </div>
                    }
                /> */}
            </div>

        )
    }
}

export default BannerExample;