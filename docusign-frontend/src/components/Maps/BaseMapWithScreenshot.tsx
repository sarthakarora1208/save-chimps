import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

import mapDivStyles from '../../assets/jss/components/mapDivStyles';
import { useDispatch } from 'react-redux';
import { setImageBinary } from '../../slices/revisionRequestSlice';
import * as watchUtils from '@arcgis/core/core/watchUtils';

const useStyles = makeStyles(mapDivStyles);

interface IBaseMapWithScreenshotProps {}

export const BaseMapWithScreenshot: React.FC<IBaseMapWithScreenshotProps> =
  ({}) => {
    const mapDiv = useRef(null);
    const dispatch = useDispatch();
    const classes = useStyles();
    useEffect(() => {
      if (mapDiv.current) {
        const map = new WebMap({
          portalItem: {
            id: '7faa14f535164df48216d63dcbe6cfc5',
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
        map.add(rangeFeatureLayer);

        view.when(() => {
          view.whenLayerView(rangeFeatureLayer).then((layerView) => {
            watchUtils.whenFalse(layerView, 'updating', () => {
              console.log(rangeFeatureLayer.loaded);
              setTimeout(() => {
                view
                  .takeScreenshot({
                    width: view.width * 0.75,
                    height: view.height * 0.75,
                    format: 'jpg',
                    quality: 70,
                  })
                  .then(function (screenshot) {
                    dispatch(setImageBinary(screenshot.dataUrl));
                  });
              }, 2500);
            });
          });
        });
      }
      return () => {};
    });
    return (
      <div>
        <div className={classes.root} ref={mapDiv}></div>
      </div>
    );
  };
