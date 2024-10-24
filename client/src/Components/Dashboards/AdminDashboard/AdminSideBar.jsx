import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { Link, useLocation } from "react-router-dom";

const AdminSideBar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(1);

  // Set selected based on current path
  useEffect(() => {
    switch (location.pathname) {
      case "/adminDashboard":
        setSelected(1);
        break;
      case "/adminDashboard/allUsers":
        setSelected(2);
        break;
      case "/adminDashboard/allVendors":
        setSelected(3);
        break;
      case "/adminDashboard/vendorRequest":
        setSelected(4);
        break;
      default:
        setSelected(1);
    }
  }, [location.pathname]);

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed top-0 left-0">
      <div className="p-4 text-lg font-bold">Admin Dashboard</div>
      <List>
        <ListItem button component={Link} to="/adminDashboard">
          <div
            className={
              selected === 1
                ? "text-black bg-white w-full rounded-lg flex p-2"
                : "flex align-middle"
            }
          >
            <ListItemIcon>
              <DashboardIcon
                className={
                  selected === 1 ? "text-black text-4xl" : "text-white"
                }
              />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              className={selected === 1 ? "" : "text-2xl"}
            />
          </div>
        </ListItem>

        <ListItem button component={Link} to="/adminDashboard/allUsers">
          <div
            className={
              selected === 2
                ? "text-black bg-white w-full rounded-lg flex p-2"
                : "flex align-middle"
            }
          >
            <ListItemIcon>
              <GroupIcon
                className={
                  selected === 2 ? "text-black text-4xl" : "text-white"
                }
              />
            </ListItemIcon>
            <ListItemText
              primary="All Users"
              className={selected === 2 ? "" : "text-2xl"}
            />
          </div>
        </ListItem>

        <ListItem button component={Link} to="/adminDashboard/allVendors">
          <div
            className={
              selected === 3
                ? "text-black bg-white w-full rounded-lg flex p-2"
                : "flex align-middle"
            }
          >
            <ListItemIcon>
              <StoreIcon
                className={
                  selected === 3 ? "text-black text-4xl" : "text-white"
                }
              />
            </ListItemIcon>
            <ListItemText
              primary="All Vendors"
              className={selected === 3 ? "" : "text-2xl"}
            />
          </div>
        </ListItem>

<<<<<<< HEAD
                <ListItem onClick={() => setSelected(4)} button component={Link} to="/adminDashboard/vendorRequest">
                    {
                        selected === 4 ? <div className="text-black bg-white w-full rounded-lg flex p-2" ><ListItemIcon>
                            <DomainAddIcon className='text-black text-4xl' />
                        </ListItemIcon>
                            <ListItemText primary="Vendor Request" /></div> : <div className='flex align-middle'><ListItemIcon>
                                <DomainAddIcon className="text-white" />
                            </ListItemIcon>
                            <ListItemText primary="Vendor Request" className='text-2xl' /></div>
                    }
                </ListItem>
                <ListItem onClick={() => setSelected(5)} button component={Link} to="/adminDashboard/all-orders">
                    {
                        selected === 5 ? <div className="text-black bg-white w-full rounded-lg flex p-2" ><ListItemIcon>
                            <FolderRoundedIcon className='text-black text-4xl' />
                        </ListItemIcon>
                            <ListItemText primary="Orders" /></div> : <div className='flex align-middle'><ListItemIcon>
                                <FolderRoundedIcon className="text-white" />
                            </ListItemIcon>
                            <ListItemText primary="Orders" className='text-2xl' /></div>
                    }
                </ListItem>
=======
        <ListItem button component={Link} to="/adminDashboard/vendorRequest">
          <div
            className={
              selected === 4
                ? "text-black bg-white w-full rounded-lg flex p-2"
                : "flex align-middle"
            }
          >
            <ListItemIcon>
              <DomainAddIcon
                className={
                  selected === 4 ? "text-black text-4xl" : "text-white"
                }
              />
            </ListItemIcon>
            <ListItemText
              primary="Vendor Request"
              className={selected === 4 ? "" : "text-2xl"}
            />
          </div>
        </ListItem>
>>>>>>> 91d09e91c49a52fc3b98a7e22d74bc8aa563bb8f

        <ListItem className="place-self-end" button component={Link} to="/">
          <ListItemIcon>
            <ExitToAppIcon className="text-white" />
          </ListItemIcon>
          <ListItemText primary="Exit" />
        </ListItem>
      </List>
    </div>
  );
};

export default AdminSideBar;
