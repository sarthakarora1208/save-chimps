import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

import mapDivStyles from '../../assets/jss/components/mapDivStyles';

const useStyles = makeStyles(mapDivStyles);

interface IBaseMapProps {}

export const BaseMap: React.FC<IBaseMapProps> = ({}) => {
  const mapDiv = useRef(null);
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
    }
    return () => {};
  });
  return (
    <div>
      <div className={classes.root} ref={mapDiv}></div>
    </div>
  );
};
