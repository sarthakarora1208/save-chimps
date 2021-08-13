import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Map from '@arcgis/core/Map';
import mapDivStyles from '../../assets/jss/components/mapDivStyles';

const useStyles = makeStyles(mapDivStyles);

interface IFeatureLayerMap1Props {}

export const FeatureLayerMap1: React.FC<IFeatureLayerMap1Props> = ({}) => {
  const mapDiv = useRef(null);
  const classes = useStyles();
  useEffect(() => {
    if (mapDiv.current) {
      /**
       * Initialize application
       */
      const map = new Map({
        basemap: 'arcgis-topographic',
      });

      const view = new MapView({
        //@ts-ignore
        container: mapDiv.current,
        map: map,
        zoom: 7,
        center: [4.0383, 21.7587],
      });

      const rangeFeatureLayer = new FeatureLayer({
        url: 'https://services8.arcgis.com/3jJ2PRlmT2cdkmQE/arcgis/rest/services/africa_map_1/FeatureServer/0',
      });
      map.add(rangeFeatureLayer);
      var query = rangeFeatureLayer.createQuery();

      rangeFeatureLayer.queryFeatures(query).then(function (response) {
        console.log(JSON.stringify(response, null, 4));
        console.log(JSON.stringify(response.features, null, 4));
        console.log(JSON.stringify(response.fields, null, 4));
        console.log(JSON.stringify(response.geometryType, null, 4));
        // do something with the query results
        // do something with the query results
      });
    }
  }, []);
  //className="mapDiv"
  return (
    <div className={classes.root} ref={mapDiv}>
      h
    </div>
  );
};
