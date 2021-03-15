import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import {signout} from "../actions/user";
import {authSignOut} from "../api/auth";
// import { makeStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import IconButton from '@material-ui/core/IconButton';
// import Typography from '@material-ui/core/Typography';
// import Badge from '@material-ui/core/Badge';
// import MenuItem from '@material-ui/core/MenuItem';
// import Menu from '@material-ui/core/Menu';
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
// import MoreIcon from '@material-ui/icons/MoreVert';


class NavBar extends React.Component {

    handleSignOut = () => {
        authSignOut().then((data) => {
            if (data.success) {
                this.props.dispatch(signout());
            }
        });
    };

    render = () => (
        <nav>
            <ul>
                <li>
                    <NavLink to="/home" id="nav-title">
                        <span>Supernatural</span>
                        <span>Psychology</span>
                        <span>Association</span>
                    </NavLink>
                </li>
                <li><NavLink to="/home" activeClassName="active-nav" exact={true}>Home</NavLink></li>
                <li><NavLink to="/blog" activeClassName="active-nav">Blog</NavLink></li>
                <li><NavLink to="/members" activeClassName="active-nav" exact={true}>Members</NavLink></li>
                {this.props.user.signedIn &&
                <div id="dropdown">
                    <button id="dropdown-btn">
                        <Link to={`/user/${this.props.user.uid}`}>{this.props.user.username}</Link>
                    </button>
                    <div id="dropdown-content">
                        <Link to="/account">Account</Link>
                        <Link to="#" onClick={this.handleSignOut}>Sign out</Link>
                    </div>
                </div>}
                {!this.props.user.signedIn &&
                <li id="nav-sign-in">
                    <NavLink to="/sign-in" activeClassName="active-nav">Sign in</NavLink>
                </li>
                }
            </ul>
        </nav>
    );
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(NavBar);

// const useStyles = makeStyles((theme) => ({
//     grow: {
//         flexGrow: 1,
//     },
//     menuButton: {
//         marginRight: theme.spacing(2),
//     },
//     title: {
//         display: 'none',
//         [theme.breakpoints.up('sm')]: {
//             display: 'block',
//         },
//         color: theme.palette.secondary.main
//     },
//     sectionDesktop: {
//         display: 'none',
//         [theme.breakpoints.up('md')]: {
//             display: 'flex',
//         },
//     },
//     sectionMobile: {
//         display: 'flex',
//         [theme.breakpoints.up('md')]: {
//             display: 'none',
//         },
//     },
// }));
//
// export default function NavBar() {
//
//     const classes = useStyles();
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
//
//     const isMenuOpen = Boolean(anchorEl);
//     const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
//
//     const handleProfileMenuOpen = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//
//     const handleMobileMenuOpen = (event) => {
//         setMobileMoreAnchorEl(event.currentTarget);
//     };
//
//     const handleMobileMenuClose = () => {
//         setMobileMoreAnchorEl(null);
//     };
//
//     const handleMenuClose = () => {
//         setAnchorEl(null);
//         handleMobileMenuClose();
//     };
//
//
//     const menuId = 'primary-search-account-menu';
//     const renderMenu = (
//         <Menu
//             anchorEl={anchorEl}
//             anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//             id={menuId}
//             keepMounted
//             transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//             open={isMenuOpen}
//             onClose={handleMenuClose}
//         >
//             <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//             <MenuItem onClick={handleMenuClose}>My account</MenuItem>
//         </Menu>
//     );
//
//     const mobileMenuId = 'primary-search-account-menu-mobile';
//     const renderMobileMenu = (
//         <Menu
//             anchorEl={mobileMoreAnchorEl}
//             anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//             id={mobileMenuId}
//             keepMounted
//             transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//             open={isMobileMenuOpen}
//             onClose={handleMobileMenuClose}
//         >
//             <MenuItem>
//                 <IconButton aria-label="show 4 new mails" color="inherit">
//                     <Badge badgeContent={4} color="secondary">
//                         <MailIcon />
//                     </Badge>
//                 </IconButton>
//                 <p>Messages</p>
//             </MenuItem>
//             <MenuItem>
//                 <IconButton aria-label="show 11 new notifications" color="inherit">
//                     <Badge badgeContent={11} color="secondary">
//                         <NotificationsIcon />
//                     </Badge>
//                 </IconButton>
//                 <p>Notifications</p>
//             </MenuItem>
//             <MenuItem onClick={handleProfileMenuOpen}>
//                 <IconButton
//                     aria-label="account of current user"
//                     aria-controls="primary-search-account-menu"
//                     aria-haspopup="true"
//                     color="inherit"
//                 >
//                     <AccountCircle />
//                 </IconButton>
//                 <p>Profile</p>
//             </MenuItem>
//         </Menu>
//     );
//
//     return (
//         <div className={classes.grow}>
//             <AppBar position="static">
//                 <Toolbar>
//                     <Typography className={classes.title} variant="h6" noWrap>
//                         Supernatural
//                     </Typography>
//                     <div className={classes.grow} />
//                     <div className={classes.sectionDesktop}>
//                         <IconButton aria-label="show 4 new mails" color="inherit">
//                             <Typography variant="h6" noWrap>
//                                 Blog
//                             </Typography>
//                         </IconButton>
//                         <IconButton aria-label="show 17 new notifications" color="inherit">
//                             <Typography variant="h6" noWrap>
//                                 Members
//                             </Typography>
//                         </IconButton>
//                         <IconButton
//                             edge="end"
//                             aria-label="account of current user"
//                             aria-controls={menuId}
//                             aria-haspopup="true"
//                             onClick={handleProfileMenuOpen}
//                             color="inherit"
//                         >
//                             <AccountCircle />
//                         </IconButton>
//                     </div>
//                     <div className={classes.sectionMobile}>
//                         <IconButton
//                             aria-label="show more"
//                             aria-controls={mobileMenuId}
//                             aria-haspopup="true"
//                             onClick={handleMobileMenuOpen}
//                             color="inherit"
//                         >
//                             <MoreIcon />
//                         </IconButton>
//                     </div>
//                 </Toolbar>
//             </AppBar>
//             {renderMobileMenu}
//             {renderMenu}
//         </div>
//     );
// }
