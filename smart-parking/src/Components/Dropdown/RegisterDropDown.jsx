import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { NavLink } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

export default function RegisterDropDown() {
  const [expanded, setExpanded] = useState(false);

  // Handle accordion toggle
  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      {/* Dropdown for large screens */}
      <div className="hidden sm:inline-block">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-3 text-sm font-bold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
              Register
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden"
          >
            <div className="py-1">
              <MenuItem>
                <NavLink
                  to="userregister"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  User
                </NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink
                  to="ParkingOwner"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Parking Owner
                </NavLink>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>

      {/* Accordion for small screens */}
      <div className="sm:hidden">
        <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            className="flex justify-center" // Centers the text in the accordion header
          >
            <Typography className="text-center w-full">Register</Typography>
          </AccordionSummary>
          <AccordionDetails className="flex justify-center flex-col items-center">
            <NavLink
              to="userregister"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center"
            >
              User
            </NavLink>
            <NavLink
              to="ParkingOwner"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center"
            >
              Parking Owner
            </NavLink>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
