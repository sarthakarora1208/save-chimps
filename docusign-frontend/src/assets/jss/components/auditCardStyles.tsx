import { createStyles, Theme } from '@material-ui/core';

const auditCardStyles = (theme: Theme) =>
  createStyles({
    card: {
      marginRight: '1.5rem',
      position: 'relative',
      width: 300,
      // margin: 'auto',
      transition: '0.3s',
      boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      //backgroundColor: theme.palette.secondary.main,
      //      backdropFilter:
      //       'blur(20px) saturate(100%) contrast(45%) brightness(130%)',
      backdropFilter: 'blur(20px)',

      content: '',
      height: '100%',
      '&:hover': {
        boxShadow: '0 8px 20px  rgba(0,0,0,0.1)',
      },
    },
    content: {
      textAlign: 'left',
      // padding: 10 * 3,
    },
    divider: {
      margin: `${10 * 3}px 0`,
    },
    heading: {
      color: theme.palette.primary.dark,
      fontWeight: 'bold',
    },
    subheading: {
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      padding: '0.2rem 0.5rem',
      display: 'inline-block',
      lineHeight: 1.8,
      marginBottom: '0.5rem',
    },
    body: {
      fontSize: '14px',
    },
    svg: {
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      zIndex: -1,
      opacity: 0.6,
    },
    link: {
      display: 'block',
      fontWeight: 'bold',
      color: theme.palette.primary.dark,
      marginLeft: '-8px',
      // marginBottom:"-8px",
    },
  });
export default auditCardStyles;
