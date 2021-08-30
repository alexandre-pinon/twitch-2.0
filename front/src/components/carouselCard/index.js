import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

import api from "../../api";
import { fetchAccessToken } from '../../constants';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

function CarouselCard() {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchAccessToken();

    const fetchData = async () => {
    const result = await api.get("https://api.twitch.tv/helix/games/top");
    let dataArray = result.data.data;
    let finalArray = dataArray.map(game => {
    let newURL = game.box_art_url
        .replace("{width}", "300")
        .replace("{height}", "300");
    game.box_art_url = newURL;
    return game;
    });
    console.log(finalArray);
    setGames(finalArray);
    };
    fetchData();
  }, []);


  return (
    <section>
      <h2 className="titleHP">Recent Popular Twitch TV Games</h2>
      <div className="containProfilCarousel">
        <div className="overflow-X">
          {games.map((game) => (
            <div className="card">
              <Card className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={game.box_art_url}
                    title={game.name}
                  />
                  <CardContent>
                    <button className="btn btn-dark">
                    <Link
                      className="link"
                      to={{
                      pathname: "game/" + game.name,
                      state: {
                          gameID: game.id
                      }
                      }}
                    >
                    <Typography>{game.name}</Typography>
                    </Link>
                    </button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CarouselCard;
