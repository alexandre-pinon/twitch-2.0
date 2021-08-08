import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

function ListFollowings() {
  const classes = useStyles();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setData(result.data);
      console.log(result.data);
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <h2 className="titleHP">Followings</h2>
      <div className="row">
        {data.map((item) => (
          <List className={classes.root}>
            <ListItem className="messageChat" alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={item.name} src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText primary={item.name} />
            </ListItem>
          </List>
        ))}
      </div>
    </div>
  );
}

export default ListFollowings;
