import { TableRow, withStyles } from '@material-ui/core';

export const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.selected,
    },
  },
}))(TableRow);
