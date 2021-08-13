import React from 'react';
import { BaseMapWithScreenshot } from '../../components/Maps/BaseMapWithScreenshot';
import { EditorMap } from '../../components/Maps/EditorMap';
import { FeatureLayerMap4 } from '../../components/Maps/FeatureLayerMap4';
import { FeatureLayerMap5 } from '../../components/Maps/FeatureLayerMap5';
import { FeatureLayerMap6 } from '../../components/Maps/FeatureLayerMap6';

interface IHomeProps {}

const Home: React.FC<IHomeProps> = (props) => {
  return (
    <div>
      <BaseMapWithScreenshot />
    </div>
  );
};

export default Home;
