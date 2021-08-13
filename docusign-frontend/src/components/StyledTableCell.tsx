import { TableCell, withStyles } from '@material-ui/core';
export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
