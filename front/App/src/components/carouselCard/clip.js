import React, {useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
  });

function ClipCarousel() {

    const classes = useStyles();

    const [data, setData]= useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('https://jsonplaceholder.typicode.com/users',)
            setData(result.data)
            console.log(result.data)
        }
        fetchData()
    }, [])

  return (
    <section>
    <h2 className="titleHP">Clips</h2>
        <div className="containProfilCarousel">
            <div className="overflow-X">
            {data.map(item => (
                <div className="card">
                    <Card className={classes.root}>
                        <CardActionArea id="clipsCard">
                            <iframe 
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/xHhtuVB9ZSI" 
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen />
                        </CardActionArea>
                    </Card>
                </div>
            ))}
            </div>
        </div>
    </section>
  );
}

export default ClipCarousel;
