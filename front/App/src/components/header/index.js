import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Logo from '../images/icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog, faVideo } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';


const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menu: {
    height: '3vh'
  },
  logo: {
    width: '4vw',
    height: 'auto',
    marginTop: '-39px',
  },
  button: {
    marginLeft: '-90%',
  },
  listItem: {
    borderRadius: '50px',
  }
});

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Gotaga', 'Sardoche', 'Kameto', 'Julia Bayonneta'].map((text, index) => (
          <ListItem className={classes.listItem} button key={text}>
            <ListItemIcon>
              <Avatar>{text.substr(0, 1)}</Avatar>          
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
          <ListItem className={classes.listItem} button key="">
            <ListItemIcon><FontAwesomeIcon icon={faVideo}/></ListItemIcon>
            <ListItemText primary="Studio"/>
          </ListItem>
          <ListItem className={classes.listItem} button key="">
            <ListItemIcon><FontAwesomeIcon icon={faCog}/></ListItemIcon>
            <ListItemText primary="Réglages"/>
          </ListItem>
          <ListItem className={classes.listItem} button key="">
            <ListItemIcon><FontAwesomeIcon icon={faBars}/></ListItemIcon>
            <ListItemText primary="Déconnexion"/>
          </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.menu}>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button className={classes.button} onClick={toggleDrawer(anchor, true)}><FontAwesomeIcon icon={faBars}/></Button>
          <div>
            <img className={classes.logo} src={Logo}/>
          </div>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}