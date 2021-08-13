import React, { useRef, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Sketch from '@arcgis/core/widgets/Sketch';
import SaveIcon from '@material-ui/icons/Save';
import { DialogContent } from '@material-ui/core';
import { RootState } from '../../../app/rootReducer';
import {
  addMapImageToS3,
  setImageBinary,
  setIsSketchOnMapModalOpen,
} from '../../../slices/revisionRequestSlice';
import { setErrorMsg } from '../../../slices/alertSlice';

import sketchMapModalStyles from '../../../assets/jss/components/sketchMapModalStyles';
import { useHistory } from 'react-router';
import { reviewAudit } from '../../../constants/routes';

interface ISketchOnMapModalProps {}

const useStyles = makeStyles(sketchMapModalStyles);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SketchOnMapModal: React.FC<ISketchOnMapModalProps> = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const classes = useStyles();

  const screenshotButton = useRef<HTMLButtonElement | null>(null);
  const mapDiv = useRef(null);

  const { open, imagebinary, audit } = useSelector((state: RootState) => {
    return {
      imagebinary: state.revisionRequest.imageBinary,
      open: state.revisionRequest.isSketchOnMapModalOpen,
      audit: state.audit.audit,
    };
  }, shallowEqual);

  useEffect(() => {
    setTimeout(() => {
      if (mapDiv.current) {
        const map = new WebMap({
          portalItem: {
            id: 'ee74e2dd6fb84e3c8c1b35db6393a32d',
          },
        });
        const view = new MapView({
          //@ts-ignore
          container: mapDiv.current,
          map: map,
          zoom: 5,
        });
        const rangeFeatureLayer = new FeatureLayer({
          url: 'https://services8.arcgis.com/3jJ2PRlmT2cdkmQE/arcgis/rest/services/species_map/FeatureServer/0',
        });
        const graphicsLayer = new GraphicsLayer();
        map.add(rangeFeatureLayer);
        map.add(graphicsLayer);
        if (screenshotButton.current != null) {
          screenshotButton.current.addEventListener('click', () => {
            view
              .takeScreenshot({
                width: view.width * 0.75,
                height: view.height * 0.75,
                format: 'jpg',
                quality: 60,
              })
              .then(function (screenshot) {
                dispatch(setImageBinary(screenshot.dataUrl));
                dispatch(addMapImageToS3());
                dispatch(setIsSketchOnMapModalOpen(false));
              });
          });
        }
        view.when(() => {
          const sketch = new Sketch({
            layer: graphicsLayer,
            view: view,
            // graphic will be selected as soon as it is created
            creationMode: 'update',
          });
          sketch.visibleElements = {
            selectionTools: {
              'lasso-selection': false,
            },
            settingsMenu: false,
          };

          view.ui.add(sketch, 'top-right');
        });
      }
    }, 1000);
  }, []);
  const handleClose = () => {
    // if (imagebinary === '') {
    //   dispatch(setErrorMsg('Click on save to save changes'));
    // } else {
    dispatch(setIsSketchOnMapModalOpen(false));
    // }
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sketch on Map
            </Typography>
            <Button
              autoFocus
              startIcon={<SaveIcon />}
              color="inherit"
              ref={screenshotButton}
            >
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <div>
          <div className={classes.root} ref={mapDiv}></div>
        </div>
      </Dialog>
    </div>
  );
};
