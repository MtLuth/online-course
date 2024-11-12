import PropTypes from "prop-types";
import { ListSubheader } from "@mui/material";
import { styled } from "@mui/material/styles";

type NavGroup = {
  navlabel?: boolean;
  subheader?: string;
};

interface ItemType {
  item: NavGroup;
}

const ListSubheaderStyle = styled(ListSubheader)(({ theme }) => ({
  ...theme.typography.overline,
  fontWeight: 700,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(0),
  color: theme.palette.text.primary,
  lineHeight: "26px",
  padding: "3px 12px",
}));

const NavGroup = ({ item }: ItemType) => {
  return (
    <ListSubheaderStyle disableSticky>{item.subheader}</ListSubheaderStyle>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
