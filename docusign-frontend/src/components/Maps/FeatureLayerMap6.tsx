import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import WebMap from '@arcgis/core/WebMap';
import Editor from '@arcgis/core/widgets/Editor';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Sketch from '@arcgis/core/widgets/Sketch';
import mapDivStyles from '../../assets/jss/components/mapDivStyles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(mapDivStyles);

interface IFeatureLayerMap6Props {}

export const FeatureLayerMap6: React.FC<IFeatureLayerMap6Props> = ({}) => {
  const mapDiv = useRef(null);
  const screenshotButton = useRef<HTMLButtonElement | null>(null);
  const imgElement = useRef(null);
  const screenshotBtn = document.getElementById('screenshotBtn')!;

  const classes = useStyles();
  useEffect(() => {
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

      view.ui.empty('top-left');
      if (screenshotButton.current != null) {
        view.ui.add(screenshotButton.current, 'top-left');
        screenshotButton.current.addEventListener('click', () => {
          let options = {
            width: view.width,
            height: view.height,
          };

          view.takeScreenshot(options).then(function (screenshot) {
            let imageElement = document.getElementById('screenshotImage')!;
            //@ts-ignore
            imageElement.src = screenshot.dataUrl;
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
  }, []);

  return (
    <div>
      <div className={classes.root} ref={mapDiv}>
        <button
          id="screenshotBtn"
          className="action-button esri-widget"
          aria-label="Select screenshot area"
          title="Select screenshot area"
          style={{
            padding: '0.6em',
            border: '1px solid #0079c1',
            textAlign: 'center',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
          ref={screenshotButton}
        >
          Select screenshot area
        </button>{' '}
      </div>
      <img ref={imgElement} alt="screenShot" id="screenshotImage"></img>
      <Button variant="outlined" onClick={() => {}}>
        Take Screenshot
      </Button>
    </div>
  );
};
