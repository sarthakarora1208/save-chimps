import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import WebMap from '@arcgis/core/WebMap';
import Editor from '@arcgis/core/widgets/Editor';
import Layer from 'esri/layers/Layer';

import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import mapDivStyles from '../../assets/jss/components/mapDivStyles';

const useStyles = makeStyles(mapDivStyles);

interface IFeatureLayerMap4Props {}

export const FeatureLayerMap4: React.FC<IFeatureLayerMap4Props> = ({}) => {
  const mapDiv = useRef(null);
  const classes = useStyles();
  useEffect(() => {
    if (mapDiv.current) {
      let polygonLayer: FeatureLayer;

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
      map.add(rangeFeatureLayer);
      view.when(() => {
        //@ts-ignore
        view.map.loadAll().then(() => {
          // Create layerInfos for layers in Editor. This
          // sets the fields for editing.
          view.map.allLayers.forEach((layer) => {
            if (layer.type === 'feature') {
              //@ts-ignore
              switch (layer.geometryType) {
                case 'polygon':
                  polygonLayer = layer as FeatureLayer;
                  break;
              }
            }
          });

          const editor = new Editor({
            view: view,
            allowedWorkflows: ['update'],
            viewModel: {
              layerInfos: [
                {
                  layer: polygonLayer,
                },
              ],
            },
            layerInfos: [
              {
                layer: polygonLayer,
                addEnabled: false,
                updateEnabled: true,
                deleteEnabled: false,
              },
            ],
            snappingOptions: {
              enabled: true,
              selfEnabled: true,
            },
          });
          // Add widget to top-right of the view
          view.ui.add(editor, 'top-right');
        });
      });
    }
    return () => {};
  }, []);

  return (
    <div>
      <div className={classes.root} ref={mapDiv}></div>;
      <div id="editorDiv"></div>
    </div>
  );
};
