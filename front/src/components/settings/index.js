import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

function Settings() {
  const classes = useStyles();

  return (
    <div className="container">
      <h2 className="titleHP">Paramètres</h2>
      <div className="row">
        <List className={classes.root}>
          <Link className="noLinkStyle" to="/settings/profil">
            <ListItem
              className="messageChat"
              id="listItemParams"
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <Avatar alt="Mon profil" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText primary="Mon profil" />
            </ListItem>
          </Link>
          <Link className="noLinkStyle" to="/settings/background">
            <ListItem
              className="messageChat"
              id="listItemParams"
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <Avatar
                  alt="Personnalisation"
                  src="/static/images/avatar/1.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Personnalisation" />
            </ListItem>
          </Link>
        </List>
      </div>
    </div>
  );
}

export default Settings;
